import { useDeferredValue, useMemo, useRef, useState } from "react";
import { ListPlus, Search as SearchIcon, Video, VideoOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, normalize } from "@/lib/utils";
import { useApp } from "@/store/useApp";

/** Busca do hinário: por título ou por número, em todas as coleções ou em uma só. */
export function HymnSearch() {
  const allHymns = useApp((state) => state.hymns);
  const collections = useApp((state) => state.collections);
  const hymnCollection = useApp((state) => state.hymnCollection);
  const setHymnCollection = useApp((state) => state.setHymnCollection);
  const videos = useApp((state) => state.videos);
  const hymnId = useApp((state) => state.hymnId);
  const openHymn = useApp((state) => state.openHymn);
  const play = useApp((state) => state.play);
  const addToSetlist = useApp((state) => state.addToSetlist);

  /** Duplo clique já abre a projeção (se preciso) e toca, sem passar pelo "Tocar". */
  const openAndPlay = (id: number) => {
    openHymn(id);
    void play();
  };

  const [term, setTerm] = useState("");
  const deferred = useDeferredValue(term);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtro salvo de uma coleção que não existe mais: mostra todas.
  const activeCollection = collections.some((c) => c.id === hymnCollection) ? hymnCollection : null;
  const hymns = useMemo(
    () => (activeCollection ? allHymns.filter((hymn) => hymn.collection === activeCollection) : allHymns),
    [allHymns, activeCollection],
  );
  const siglas = useMemo(() => new Map(collections.map((c) => [c.id, c.sigla])), [collections]);
  // Com mais de uma coleção na lista, a sigla diferencia os hinos repetidos.
  const showSigla = collections.length > 1 && !activeCollection;

  const results = useMemo(() => {
    const query = normalize(deferred).trim();
    if (!query) {
      // Sem busca: ordem alfabética pelo título, o número é só um detalhe.
      return [...hymns].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }

    const number = /^\d+$/.test(query) ? Number(query) : null;
    const parts = query.split(/\s+/);

    return hymns
      .filter((hymn) => {
        if (number != null && hymn.number === number) return true;
        return parts.every((part) => hymn.search.includes(part));
      })
      .sort((a, b) => {
        // Número exato primeiro, depois quem começa com o termo buscado, depois alfabética.
        if (number != null) {
          const exact = (hymn: typeof a) => (hymn.number === number ? 0 : 1);
          if (exact(a) !== exact(b)) return exact(a) - exact(b);
        }
        const starts = (hymn: typeof a) => (hymn.search.startsWith(query) ? 0 : 1);
        if (starts(a) !== starts(b)) return starts(a) - starts(b);
        return a.title.localeCompare(b.title, "pt-BR");
      });
  }, [hymns, deferred]);

  const openFirst = () => {
    const first = results[0];
    if (first) {
      openHymn(first.id);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative p-3">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-6 size-4 -translate-y-1/2 text-ink-400" />
        <Input
          ref={inputRef}
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") openFirst();
            if (event.key === "Escape") setTerm("");
          }}
          placeholder={
            activeCollection ? `Buscar em ${siglas.get(activeCollection)}` : "Buscar hino por título ou número"
          }
          className="pl-9"
          autoComplete="off"
          autoFocus
        />
        {term && (
          <button
            onClick={() => setTerm("")}
            className="absolute top-1/2 right-6 -translate-y-1/2 text-ink-400 hover:text-ink-200"
            aria-label="Limpar busca"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {collections.length > 1 && (
        <div className="no-scrollbar -mt-1 flex gap-1.5 overflow-x-auto px-3 pb-2">
          <CollectionChip label="Todos" active={!activeCollection} onClick={() => setHymnCollection(null)} />
          {collections.map((collection) => (
            <CollectionChip
              key={collection.id}
              label={collection.sigla}
              title={collection.name}
              active={activeCollection === collection.id}
              onClick={() => setHymnCollection(collection.id)}
            />
          ))}
        </div>
      )}

      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {results.map((hymn) => {
          const hasVideo = videos[String(hymn.id)] != null;
          return (
            <li key={hymn.id} className="list-item-lazy">
              <div
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-2 py-2",
                  hymnId === hymn.id ? "bg-ink-700" : "hover:bg-ink-800",
                )}
              >
                <button
                  onClick={() => openHymn(hymn.id)}
                  onDoubleClick={() => openAndPlay(hymn.id)}
                  title="Duplo clique: abre a projeção e já toca"
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="min-w-0 flex-1 truncate text-sm text-ink-200">
                    {hymn.title}
                    {hymn.detail && <span className="ml-1.5 text-xs text-ink-400">{hymn.detail}</span>}
                  </span>
                  {showSigla && (
                    <span className="shrink-0 rounded border border-ink-700 px-1 text-[10px] text-ink-400">
                      {siglas.get(hymn.collection) ?? hymn.collection}
                    </span>
                  )}
                  {hymn.number != null && (
                    <span className="shrink-0 text-xs tabular-nums text-ink-500">{hymn.number}</span>
                  )}
                  {hasVideo ? (
                    <Video className="size-3.5 shrink-0 text-ink-600" />
                  ) : (
                    <VideoOff className="size-3.5 shrink-0 text-amber-500/60" />
                  )}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                  title="Adicionar ao roteiro"
                  onClick={() => addToSetlist(hymn.id)}
                >
                  <ListPlus className="size-4" />
                </Button>
              </div>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-ink-400">Nenhum hino encontrado.</li>
        )}
      </ul>
    </div>
  );
}

function CollectionChip({
  label,
  title,
  active,
  onClick,
}: {
  label: string;
  title?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-1 text-[11px] whitespace-nowrap",
        active
          ? "border-brand-600 bg-brand-600 text-ink-950"
          : "border-ink-700 text-ink-300 hover:border-brand-600/60 hover:text-ink-100",
      )}
    >
      {label}
    </button>
  );
}
