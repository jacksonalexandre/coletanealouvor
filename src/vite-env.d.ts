/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Client ID OAuth (tipo "Aplicativo da Web") do Google Cloud. Sem ele, o login fica escondido. */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
