import { openDB, type IDBPDatabase } from "idb";
import type { Catalog } from "@/lib/types";

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

/**
 * Carrega um JSON do acervo servindo primeiro o que está em IndexedDB e
 * revalidando em segundo plano — a primeira pintura não espera a rede.
 */
async function cachedJson<T>(url: string, key: string, onFresh?: (value: T) => void): Promise<T> {
  const cached = await read<{ etag: string; value: T }>(key);
  const revalidate = fetch(url)
    .then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const etag = response.headers.get("etag") ?? "";
      if (cached && etag && etag === cached.etag) return cached.value;
      const value = (await response.json()) as T;
      await write(key, { etag, value });
      return value;
    })
    .catch((error) => {
      if (cached) return cached.value;
      throw error;
    });

  if (cached) {
    void revalidate.then((value) => {
      if (value !== cached.value) onFresh?.(value);
    });
    return cached.value;
  }
  return revalidate;
}

export function loadCatalog(onFresh?: (catalog: Catalog) => void) {
  return cachedJson<Catalog>("/data/catalog.json", "catalog", onFresh);
}

export function loadLyrics() {
  return cachedJson<Record<string, string>>("/data/lyrics.json", "lyrics");
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
