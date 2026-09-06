import { useDeferredValue, useMemo, useRef, useState } from "react";
import { ListPlus, Search as SearchIcon, Video, VideoOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, normalize } from "@/lib/utils";
import { useApp } from "@/store/useApp";

/** Busca do hinário: por título ou por número. */
export function HymnSearch() {
  const hymns = useApp((state) => state.hymns);
  const videos = useApp((state) => state.videos);
  const hymnId = useApp((state) => state.hymnId);
  const openHymn = useApp((state) => state.openHymn);
  const addToSetlist = useApp((state) => state.addToSetlist);

  const [term, setTerm] = useState("");
  const deferred = useDeferredValue(term);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const query = normalize(deferred).trim();
    if (!query) return hymns;

    const number = /^\d+$/.test(query) ? Number(query) : null;
    const parts = query.split(/\s+/);

    return hymns
      .filter((hymn) => {
        if (number != null && hymn.number === number) return true;
        return parts.every((part) => hymn.search.includes(part));
      })
      .sort((a, b) => {
        // Número exato primeiro, depois quem começa com o termo buscado.
        if (number != null) {
          const exact = (hymn: typeof a) => (hymn.number === number ? 0 : 1);
          if (exact(a) !== exact(b)) return exact(a) - exact(b);
        }
        const starts = (hymn: typeof a) => (hymn.search.startsWith(query) ? 0 : 1);
        if (starts(a) !== starts(b)) return starts(a) - starts(b);
        return a.number - b.number;
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
          placeholder="Buscar hino por título ou número"
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
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="w-9 shrink-0 text-right text-sm tabular-nums text-brand-400">
                    {hymn.number}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-ink-200">{hymn.title}</span>
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
