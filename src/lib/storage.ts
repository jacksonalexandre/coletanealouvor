import { openDB, type IDBPDatabase } from "idb";
import type { BibleVersionId } from "@/lib/bibleVersions";
import { rpc } from "@/lib/supabase";
import type { Bible, Hymnal, VideoMap } from "@/lib/types";

let dbPromise: Promise<IDBPDatabase> | null = null;

function db() {
  if (!dbPromise) {
    dbPromise = openDB("coletanea", 1, {
      upgrade(database) {
        database.createObjectStore("acervo");
      },
    });
  }
  return dbPromise;
}

async function read<T>(key: string): Promise<T | undefined> {
  try {
    return (await (await db()).get("acervo", key)) as T | undefined;
  } catch {
    return undefined;
  }
}

async function write(key: string, value: unknown) {
  try {
    await (await db()).put("acervo", value, key);
  } catch {
    // Modo privado / cota cheia: seguimos sem cache offline.
  }
}

/** Quando cada parte do acervo mudou no banco; uma consulta pequena por sessão. */
let revisionsPromise: Promise<Record<string, string>> | null = null;
function revisions() {
  if (!revisionsPromise) {
    revisionsPromise = rpc<Record<string, string>>("coletanea_revisao").catch((error) => {
      revisionsPromise = null;
      throw error;
    });
  }
  return revisionsPromise;
}

/**
 * Serve primeiro o que está em IndexedDB e revalida em segundo plano — a busca
 * abre sem esperar a rede. Só baixa de novo quando a revisão no banco mudou.
 */
async function cached<T>(
  key: string,
  revisionKey: string,
  load: () => Promise<T>,
  onFresh?: (value: T) => void,
): Promise<T> {
  const stored = await read<{ revision?: string; value: T }>(key);
  const revalidate = revisions()
    .then(async (all) => {
      const revision = all[revisionKey] ?? "";
      if (stored && stored.revision === revision) return stored.value;
      const value = await load();
      await write(key, { revision, value });
      return value;
    })
    .catch((error) => {
      if (stored) return stored.value;
      throw error;
    });

  if (stored) {
    void revalidate.then((value) => {
      if (value !== stored.value) onFresh?.(value);
    });
    return stored.value;
  }
  return revalidate;
}

export function loadHymnal(onFresh?: (hymnal: Hymnal) => void) {
  return cached("hymnal", "hinario", () => rpc<Hymnal>("coletanea_hinario"), onFresh);
}

export function loadBible(version: BibleVersionId, onFresh?: (bible: Bible) => void) {
  return cached(
    `biblia:${version}`,
    `biblia:${version}`,
    async () => {
      const bible = await rpc<Bible | null>("coletanea_biblia", { p_versao: version });
      // Versão ainda não importada no banco: a aba Bíblia mostra "não disponível".
      if (!bible?.books.length) throw new Error(`Bíblia ${version} não importada`);
      return bible;
    },
    onFresh,
  );
}

/**
 * Mapa hino -> vídeo. O banco é a base; o que o operador cadastra na mão fica
 * por cima, no navegador dele.
 */
export async function loadVideoMap(): Promise<VideoMap> {
  let base: VideoMap = {};
  try {
    base = await cached("videos", "videos", () => rpc<VideoMap>("coletanea_mapa_videos"));
  } catch {
    // Offline na primeira carga: vale só o que o operador cadastrou.
  }
  return { ...base, ...local.get<VideoMap>("videos", {}) };
}

const PREFIX = "coletanea:";

export const local = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Sem persistência disponível; a sessão continua em memória.
    }
  },
};
