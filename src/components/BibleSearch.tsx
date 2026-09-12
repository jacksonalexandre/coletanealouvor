import { useDeferredValue, useMemo, useState } from "react";
import { ChevronLeft, ListPlus, Loader2, MonitorPlay, Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findBook } from "@/lib/bible";
import { BIBLE_VERSIONS } from "@/lib/bibleVersions";
import { cn, normalize } from "@/lib/utils";
import { useApp } from "@/store/useApp";
import type { PassageRef } from "@/lib/types";

type Range = { start: number; end: number };

/** Escolha de tradução, livro → capítulo → versículo(s) para projetar uma passagem. */
export function BibleSearch() {
  const bible = useApp((state) => state.bible);
  const bibleVersion = useApp((state) => state.bibleVersion);
  const bibleLoading = useApp((state) => state.bibleLoading);
  const setBibleVersion = useApp((state) => state.setBibleVersion);
  const openPassage = useApp((state) => state.openPassage);
  const addPassageToSetlist = useApp((state) => state.addPassageToSetlist);

  const [term, setTerm] = useState("");
  const deferred = useDeferredValue(term);
  const [bookAbbrev, setBookAbbrev] = useState<string | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [range, setRange] = useState<Range | null>(null);

  const book = bookAbbrev ? findBook(bible, bookAbbrev) : null;
  const verses = book && chapter ? book.chapters[chapter - 1] : null;

  const books = useMemo(() => {
    const query = normalize(deferred).trim();
    if (!query) return bible;
    return bible.filter((candidate) => candidate.search.includes(query));
  }, [bible, deferred]);

  const chooseBook = (abbrev: string) => {
    setBookAbbrev(abbrev);
    setChapter(null);
    setRange(null);
  };

  const chooseChapter = (n: number) => {
    setChapter(n);
    setRange(null);
  };

  const clickVerse = (n: number, extend: boolean) => {
    setRange((current) => {
      if (extend && current) {
        return n < current.start ? { start: n, end: current.end } : { start: current.start, end: n };
      }
      return { start: n, end: n };
    });
  };

  const ref = (): PassageRef | null =>
    book && chapter && range
      ? { book: book.abbrev, chapter, verseStart: range.start, verseEnd: range.end }
      : null;

  const versionBar = (
    <div className="flex gap-1 border-b border-ink-800 p-2">
      {BIBLE_VERSIONS.map((version) => (
        <button
          key={version.id}
          onClick={() => setBibleVersion(version.id)}
          disabled={bibleLoading}
          className={cn(
            "flex-1 rounded-lg py-1.5 text-xs font-medium disabled:opacity-60",
            bibleVersion === version.id ? "bg-ink-700 text-ink-100" : "text-ink-400 hover:text-ink-200",
          )}
          title={version.name}
        >
          {version.id === bibleVersion && bibleLoading ? (
            <Loader2 className="mx-auto size-3.5 animate-spin" />
          ) : (
            version.abbrev
          )}
        </button>
      ))}
    </div>
  );

  if (!bible.length) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {versionBar}
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-ink-400">
          {bibleLoading ? (
            "Carregando…"
          ) : (
            <span>
              Bíblia não disponível. Rode <code className="mx-1">npm run import:bible</code> e recarregue.
            </span>
          )}
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {versionBar}
        <div className="relative p-3">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-6 size-4 -translate-y-1/2 text-ink-400" />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={(event) => event.key === "Escape" && setTerm("")}
            placeholder="Buscar livro da Bíblia"
            className="pl-9"
            autoComplete="off"
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
          {books.map((candidate) => (
            <li key={candidate.abbrev} className="list-item-lazy">
              <button
                onClick={() => chooseBook(candidate.abbrev)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-ink-200 hover:bg-ink-800"
              >
                <span className="min-w-0 flex-1 truncate">{candidate.name}</span>
                <span className="text-xs text-ink-500 uppercase">{candidate.testament}</span>
              </button>
            </li>
          ))}
          {books.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-ink-400">Nenhum livro encontrado.</li>
          )}
        </ul>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {versionBar}
        <BackHeader label={book.name} onBack={() => setBookAbbrev(null)} />
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-6 gap-1.5">
            {book.chapters.map((_, index) => (
              <button
                key={index}
                onClick={() => chooseChapter(index + 1)}
                className="rounded-lg bg-ink-800 py-2 text-sm text-ink-200 tabular-nums hover:bg-ink-700"
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {versionBar}
      <BackHeader label={`${book.name} ${chapter}`} onBack={() => setChapter(null)} />

      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {verses?.map((text, index) => {
          const n = index + 1;
          const selected = range && n >= range.start && n <= range.end;
          return (
            <li key={n} className="list-item-lazy">
              <button
                onClick={(event) => clickVerse(n, event.shiftKey)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg px-3 py-1.5 text-left text-sm",
                  selected ? "bg-brand-600/15 text-ink-100 ring-1 ring-brand-600/50" : "text-ink-300 hover:bg-ink-800",
                )}
              >
                <span className="w-5 shrink-0 text-right tabular-nums text-brand-400">{n}</span>
                <span className="min-w-0 flex-1">{text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {range && (
        <div className="flex gap-1.5 border-t border-ink-800 p-3">
          <Button
            className="flex-1"
            onClick={() => {
              const passage = ref();
              if (passage) openPassage(passage);
            }}
          >
            <MonitorPlay className="size-4" />
            Projetar {range.start === range.end ? range.start : `${range.start}-${range.end}`}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            title="Adicionar ao roteiro"
            onClick={() => {
              const passage = ref();
              if (passage) addPassageToSetlist(passage);
            }}
          >
            <ListPlus className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function BackHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-2 border-b border-ink-800 p-3">
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onBack} aria-label="Voltar">
        <ChevronLeft className="size-4" />
      </Button>
      <span className="truncate text-sm font-medium text-ink-200">{label}</span>
    </div>
  );
}
