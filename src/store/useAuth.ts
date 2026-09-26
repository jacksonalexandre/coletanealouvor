import { create } from "zustand";
import { googleClientId, loadGoogle, userFromCredential, type GoogleUser } from "@/lib/googleAuth";
import { local } from "@/lib/storage";

type AuthState = {
  user: GoogleUser | null;
  /** GIS carregado e inicializado; só então dá para desenhar o botão oficial. */
  ready: boolean;
  /** Mensagem para o operador quando o login falha (script bloqueado, offline…). */
  authError: string | null;
  /** Inicializa o GIS com o callback de login; seguro chamar mais de uma vez. */
  initGoogle: () => Promise<void>;
  signOut: () => void;
};

let initialized = false;

export const useAuth = create<AuthState>((set) => ({
  user: local.get<GoogleUser | null>("googleUser", null),
  ready: false,
  authError: null,

  initGoogle: async () => {
    if (!googleClientId || initialized) return;
    try {
      const google = await loadGoogle();
      if (initialized) return;
      initialized = true;
      google.accounts.id.initialize({
        client_id: googleClientId,
        auto_select: true,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
        callback: ({ credential }) => {
          const user = userFromCredential(credential);
          if (!user) {
            set({ authError: "Resposta de login inválida." });
            return;
          }
          local.set("googleUser", user);
          set({ user, authError: null });
        },
      });
      set({ ready: true, authError: null });
    } catch (error) {
      set({ authError: error instanceof Error ? error.message : String(error) });
    }
  },

  signOut: () => {
    // Sem isso, o auto_select entraria de novo na mesma conta na próxima visita.
    window.google?.accounts.id.disableAutoSelect();
    local.set("googleUser", null);
    set({ user: null });
  },
}));
