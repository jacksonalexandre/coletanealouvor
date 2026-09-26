/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Client ID OAuth (tipo "Aplicativo da Web") do Google Cloud. Sem ele, o login fica escondido. */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  /** Projeto Supabase com o acervo (tabelas coletanea_*). */
  readonly VITE_SUPABASE_URL?: string;
  /** Chave pública (anon): só leitura, pelas políticas RLS. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
