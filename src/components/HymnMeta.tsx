import type { Hymn } from "@/lib/types";
import { useApp } from "@/store/useApp";

/**
 * Complemento do título de um hino: sigla da coleção (fora do HASD, a primeira),
 * detalhe da versão (ex: "PLAYBACK") e número — distingue os hinos repetidos.
 */
export function HymnMeta({ hymn }: { hymn: Hymn }) {
  const collections = useApp((state) => state.collections);
  const collection = collections.find((item) => item.id === hymn.collection);
  const showSigla = collection && collections[0]?.id !== collection.id;

  return (
    <>
      {showSigla && (
        <span className="ml-2 rounded border border-ink-700 px-1 align-middle text-[10px] text-ink-400">
          {collection.sigla}
        </span>
      )}
      {hymn.detail && <span className="ml-1.5 text-xs text-ink-400">{hymn.detail}</span>}
      {hymn.number != null && <span className="ml-2 text-xs tabular-nums text-ink-500">{hymn.number}</span>}
    </>
  );
}
