import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { startPreferenceSync, type SyncStatus } from "@/lib/preferenceSync";
import { supabase } from "@/lib/supabase";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  picture: string | null;
};

type AuthState = {
  user: AuthUser | null;
  /** Sessão já lida do armazenamento (ou da URL, na volta do Google). */
  ready: boolean;
  /** Mensagem para o operador quando o login falha (offline, redirect recusado…). */
  authError: string | null;
  /** Preferências na conta: desligado (sem login), enviando, em dia ou com erro. */
  syncStatus: SyncStatus;
  syncError: string | null;
  /** Lê a sessão atual e passa a ouvir as mudanças; seguro chamar mais de uma vez. */
  initAuth: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Liga a sincronização das preferências com a conta (só na tela de controle). */
  startSync: (onApplied: () => void) => void;
};

function userFromSession(session: Session | null): AuthUser | null {
  if (!session) return null;
  const { id, email, user_metadata: meta } = session.user;
  const text = (value: unknown) => (typeof value === "string" && value ? value : null);
  return {
    id,
    email: email ?? "",
    name: text(meta.full_name) ?? text(meta.name) ?? email ?? "",
    picture: text(meta.avatar_url) ?? text(meta.picture),
  };
}

let initialized = false;

export const useAuth = create<AuthState>((set) => ({
  user: null,
  ready: false,
  authError: null,
  syncStatus: "off",
  syncError: null,

  initAuth: async () => {
    if (!supabase || initialized) return;
    initialized = true;
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: userFromSession(session), ready: true });
    });
    const { data, error } = await supabase.auth.getSession();
    set({ user: userFromSession(data.session), ready: true, authError: error?.message ?? null });
  },

  signIn: async () => {
    if (!supabase) return;
    // Volta para a raiz do app (no GitHub Pages fica em /<repo>/).
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: new URL(import.meta.env.BASE_URL, window.location.origin).href },
    });
    if (error) set({ authError: error.message });
  },

  signOut: async () => {
    // As preferências ficam no navegador: sair não apaga nada.
    await supabase?.auth.signOut();
    set({ user: null });
  },

  startSync: (onApplied) => {
    startPreferenceSync({
      onApplied,
      onStatus: (syncStatus, error) => set({ syncStatus, syncError: error ?? null }),
    });
  },
}));
