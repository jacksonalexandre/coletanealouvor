/**
 * Preferências na conta: com login, as chaves abaixo vão para a tabela
 * coletanea_preferencias (uma linha por usuário) e voltam a cada login. Sem
 * login, continuam só no navegador (localStorage), como sempre.
 *
 * No login vale a versão mais recente: se o navegador mudou depois do último
 * envio (sem login ou offline), ele sobe para a conta; senão, a conta desce
 * para o navegador. Preferências de outra conta no navegador perdem para a
 * conta que entrou. Depois disso, cada mudança é enviada com um pequeno
 * atraso, juntando várias seguidas em um envio só.
 */
import { local, onLocalChange } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

/** O que acompanha a pessoa. Fica de fora o que é do aparelho (tela do projetor, tocar no aparelho, volume). */
export const SYNCED_KEYS = [
  "setlist",
  "appearance",
  "passageStyle",
  "bibleVersion",
  "bibleBookOrder",
  "hymnCollection",
  "videos",
  "raffle",
  "countdownLabel",
  "countdownTime",
] as const;

const synced = new Set<string>(SYNCED_KEYS);

export type SyncStatus = "off" | "syncing" | "ok" | "error";

type Options = {
  /** Chamado depois de aplicar no navegador o que veio da conta. */
  onApplied: () => void;
  onStatus: (status: SyncStatus, error?: string) => void;
};

const PUSH_DELAY = 1500;

/** Quando as preferências deste navegador mudaram e de qual conta vieram por último. */
type Meta = { updatedAt: string | null; owner: string | null };
const META_KEY = "preferencesMeta";
const readMeta = () => local.get<Meta>(META_KEY, { updatedAt: null, owner: null });
const writeMeta = (patch: Partial<Meta>) => local.write(META_KEY, { ...readMeta(), ...patch });

let started = false;
let userId: string | null = null;
let timer = 0;

function snapshot() {
  const dados: Record<string, unknown> = {};
  for (const key of SYNCED_KEYS) {
    const value = local.get<unknown>(key, undefined);
    if (value !== undefined) dados[key] = value;
  }
  return dados;
}

export function startPreferenceSync({ onApplied, onStatus }: Options) {
  if (started || !supabase) return;
  started = true;
  const db = supabase;

  const push = async () => {
    clearTimeout(timer);
    timer = 0;
    const id = userId;
    if (!id) return;
    onStatus("syncing");
    const updatedAt = readMeta().updatedAt ?? new Date().toISOString();
    const { error } = await db
      .from("coletanea_preferencias")
      .upsert({ user_id: id, dados: snapshot(), atualizado_em: updatedAt });
    if (userId !== id) return;
    if (error) {
      onStatus("error", error.message);
      return;
    }
    writeMeta({ owner: id, updatedAt });
    onStatus("ok");
  };

  const pull = async (id: string) => {
    onStatus("syncing");
    const { data, error } = await db
      .from("coletanea_preferencias")
      .select("dados, atualizado_em")
      .eq("user_id", id)
      .maybeSingle();
    if (userId !== id) return;
    if (error) {
      onStatus("error", error.message);
      return;
    }
    // Conta nova (sem nada salvo): o que está neste navegador vira o ponto de partida.
    if (!data) {
      await push();
      return;
    }
    // Mudou aqui depois do último envio desta mesma conta (ou nunca sincronizou): sobe.
    const meta = readMeta();
    const mine = meta.owner === null || meta.owner === id;
    if (mine && meta.updatedAt && Date.parse(meta.updatedAt) > Date.parse(data.atualizado_em)) {
      await push();
      return;
    }
    const dados = (data.dados ?? {}) as Record<string, unknown>;
    for (const key of SYNCED_KEYS) if (key in dados) local.write(key, dados[key]);
    writeMeta({ owner: id, updatedAt: data.atualizado_em });
    onApplied();
    onStatus("ok");
  };

  db.auth.onAuthStateChange((_event, session) => {
    const id = session?.user.id ?? null;
    // Renovação de token dispara o evento de novo com o mesmo usuário: nada a fazer.
    if (id === userId) return;
    userId = id;
    clearTimeout(timer);
    // Fora do callback: chamar o banco aqui dentro trava o lock de sessão do supabase-js.
    if (id) setTimeout(() => void pull(id), 0);
    else onStatus("off");
  });

  onLocalChange((key) => {
    if (!synced.has(key)) return;
    // Marca a hora mesmo sem login: no próximo login, decide quem é mais recente.
    writeMeta({ updatedAt: new Date().toISOString() });
    if (!userId) return;
    clearTimeout(timer);
    timer = window.setTimeout(() => void push(), PUSH_DELAY);
  });

  // Fechando a aba com mudança pendente: envia já.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && timer) void push();
  });
}
