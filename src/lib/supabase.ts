/**
 * Acesso de leitura ao acervo no Supabase (tabelas coletanea_*), pela API REST
 * com a chave pública (anon). As funções coletanea_* devolvem cada parte do
 * acervo em uma chamada só, no formato que o app usa.
 */
const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  if (!url || !key) throw new Error("Supabase não configurado (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)");
  const response = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!response.ok) throw new Error(`${fn}: HTTP ${response.status}`);
  return (await response.json()) as T;
}
