/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Projeto Supabase com o acervo (tabelas coletanea_*) e o login (mesmo do ei-clube). */
  readonly VITE_SUPABASE_URL?: string;
  /** Chave pública (anon): só leitura, pelas políticas RLS. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
