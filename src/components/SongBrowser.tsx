import { useDeferredValue, useMemo, useState } from "react";
import { ListPlus, Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatDuration, normalize } from "@/lib/utils";
import { useApp } from "@/store/useApp";

/** Busca no acervo + navegação por categoria/álbum. */
export function SongBrowser() {
  const catalog = useApp((state) => state.catalog);
  const songId = useApp((state) => state.songId);
  const openSong = useApp((state) => state.openSong);
  const addToSetlist = useApp((state) => state.addToSetlist);

  const [term, setTerm] = useState("");
  const [albumId, setAlbumId] = useState<number | null>(null);
  const deferred = useDeferredValue(term);

  const albumsById = useMemo(
    () => new Map((catalog?.albums ?? []).map((album) => [album.id, album])),
    [catalog],
  );

  const results = useMemo(() => {
    const songs = catalog?.songs ?? [];
    const query = normalize(deferred).trim();
    const digits = /^\d+$/.test(query) ? Number(query) : null;

    const filtered = songs.filter((song) => {
      if (albumId != null && !song.albums.some((ref) => ref.albumId === albumId)) return false;
      if (!query) return true;
      if (digits != null && song.hymnNumber === digits) return true;
      return query.split(/\s+/).every((part) => song.search.includes(part));
    });

    // Sem busca e sem filtro a lista inteira (1889 itens) não ajuda ninguém.
    return query || albumId != null ? filtered.slice(0, 300) : filtered.slice(0, 60);
  }, [catalog, deferred, albumId]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative p-3">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-6 size-4 -translate-y-1/2 text-ink-400" />
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar por título, álbum ou número do hino"
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

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
        <Chip active={albumId === null} onClick={() => setAlbumId(null)}>
          Tudo
        </Chip>
        {(catalog?.categories ?? []).flatMap((category) =>
          category.albumIds.slice(0, 40).map((id) => {
            const album = albumsById.get(id);
            if (!album) return null;
            return (
              <Chip key={id} active={albumId === id} onClick={() => setAlbumId(albumId === id ? null : id)}>
                {album.subtitle ?? album.name}
              </Chip>
            );
          }),
        )}
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {results.map((song) => {
          const album = albumsById.get(song.albums[0]?.albumId ?? -1);
          return (
            <li key={song.id} className="list-item-lazy">
              <div
                className={cn(
                  "group flex items-center gap-2 rounded-lg px-2 py-2",
                  songId === song.id ? "bg-ink-700" : "hover:bg-ink-800",
                )}
              >
                <button onClick={() => openSong(song.id)} className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm text-ink-200">
                    {song.hymnNumber != null && (
                      <span className="mr-2 text-brand-400">{song.hymnNumber}</span>
                    )}
                    {song.title}
                  </span>
                  <span className="block truncate text-xs text-ink-400">
                    {album?.name ?? "—"}
                    {song.duration ? ` · ${formatDuration(song.duration)}` : ""}
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                  title="Adicionar ao roteiro"
                  onClick={() => addToSetlist(song.id)}
                >
                  <ListPlus className="size-4" />
                </Button>
              </div>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-ink-400">Nada encontrado.</li>
        )}
      </ul>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1 text-xs whitespace-nowrap transition-colors",
        active
          ? "border-brand-600 bg-brand-600/15 text-brand-400"
          : "border-ink-700 text-ink-400 hover:text-ink-200",
      )}
    >
      {children}
    </button>
  );
}
