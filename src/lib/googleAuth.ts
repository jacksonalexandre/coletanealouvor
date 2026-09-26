/**
 * Login com o Google via Google Identity Services (GIS), todo no navegador —
 * o app é estático, então não há servidor para trocar código por token. O GIS
 * devolve um ID token (JWT) assinado pelo Google; daqui só tiramos o perfil.
 */

export type GoogleUser = {
  /** Identificador estável da conta Google ("sub" do token). */
  id: string;
  name: string;
  email: string;
  picture: string | null;
};

type CredentialResponse = { credential: string };

type GsiButtonOptions = {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  locale?: string;
};

type Gsi = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (parent: HTMLElement, options: GsiButtonOptions) => void;
      prompt: () => void;
      disableAutoSelect: () => void;
      revoke: (hint: string, done?: () => void) => void;
    };
  };
};

declare global {
  interface Window {
    google?: Gsi;
  }
}

export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || null;

let scriptPromise: Promise<Gsi> | null = null;

/** Carrega o script do GIS uma vez só; rejeita se estiver offline ou bloqueado. */
export function loadGoogle(): Promise<Gsi> {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (!scriptPromise) {
    scriptPromise = new Promise<Gsi>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () =>
        window.google?.accounts?.id ? resolve(window.google) : reject(new Error("GIS indisponível"));
      script.onerror = () => {
        scriptPromise = null;
        script.remove();
        reject(new Error("Não foi possível carregar o login do Google"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/** Lê o payload do ID token. Nomes vêm em UTF-8, por isso o TextDecoder em vez de só atob. */
export function userFromCredential(credential: string): GoogleUser | null {
  try {
    const payload = credential.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    if (typeof claims.sub !== "string" || claims.aud !== googleClientId) return null;
    return {
      id: claims.sub,
      name: typeof claims.name === "string" ? claims.name : String(claims.email ?? ""),
      email: typeof claims.email === "string" ? claims.email : "",
      picture: typeof claims.picture === "string" ? claims.picture : null,
    };
  } catch {
    return null;
  }
}
