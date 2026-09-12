export type BibleVersionId = "ara" | "arc" | "ntlh" | "nvi";

/** Traduções disponíveis; bate com scripts/import-bible.mjs e public/data/biblia-<id>.json. */
export const BIBLE_VERSIONS: { id: BibleVersionId; abbrev: string; name: string }[] = [
  { id: "ara", abbrev: "ARA", name: "Almeida Revista e Atualizada" },
  { id: "arc", abbrev: "ARC", name: "Almeida Revista e Corrigida" },
  { id: "ntlh", abbrev: "NTLH", name: "Nova Tradução na Linguagem de Hoje" },
  { id: "nvi", abbrev: "NVI", name: "Nova Versão Internacional" },
];

export const DEFAULT_BIBLE_VERSION: BibleVersionId = "nvi";

export function isBibleVersion(value: string): value is BibleVersionId {
  return BIBLE_VERSIONS.some((version) => version.id === value);
}
