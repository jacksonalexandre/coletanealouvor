/**
 * Cliente do Supabase: login com o Google (Supabase Auth, mesmo projeto do
 * ei-clube) e leitura do acervo (tabelas coletanea_*). As funções coletanea_*
 * devolvem cada parte do acervo em uma chamada só, no formato que o app usa.
 */
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** null quando o build não tem URL/chave: o app segue sem login e sem acervo remoto. */
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null;

export async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  if (!supabase) throw new Error("Supabase não configurado (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)");
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(`${fn}: ${error.message}`);
  return data as T;
}
