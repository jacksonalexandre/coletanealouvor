import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/useAuth";

/** Botão "Entrar com Google" (Supabase Auth) ou, já logado, a foto com o menu de sair. */
export function GoogleLogin() {
  const user = useAuth((state) => state.user);
  const ready = useAuth((state) => state.ready);
  const authError = useAuth((state) => state.authError);
  const initAuth = useAuth((state) => state.initAuth);

  useEffect(() => {
    void initAuth();
  }, [initAuth]);

  // Sem Supabase configurado no build, o app segue funcionando sem login.
  if (!supabase || !ready) return null;
  if (user) return <UserMenu />;
  return <SignInButton error={authError} />;
}

function SignInButton({ error }: { error: string | null }) {
  const signIn = useAuth((state) => state.signIn);
  const [opening, setOpening] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      title={error ?? undefined}
      disabled={opening}
      onClick={() => {
        setOpening(true);
        void signIn().finally(() => setOpening(false));
      }}
    >
      <LogIn className="size-4" />
      {opening ? "Abrindo…" : error ? "Tentar login de novo" : "Entrar com Google"}
    </Button>
  );
}

function UserMenu() {
  const user = useAuth((state) => state.user)!;
  const signOut = useAuth((state) => state.signOut);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        title={`${user.name} (${user.email})`}
        className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-ink-700 bg-ink-800 text-sm font-semibold text-ink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70"
      >
        {user.picture ? (
          <img src={user.picture} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />
        ) : (
          (user.name || user.email).charAt(0).toUpperCase()
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-ink-700 bg-ink-900 p-3 shadow-xl">
          <p className="truncate text-sm font-medium text-ink-200">{user.name}</p>
          <p className="truncate text-xs text-ink-400">{user.email}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      )}
    </div>
  );
}
