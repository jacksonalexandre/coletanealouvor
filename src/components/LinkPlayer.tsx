import { useEffect, useState } from "react";
import { Link2, ListPlus, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEFAULT_VIDEO_TITLE, fetchVideoTitle, parseVideoId, thumbnailUrl } from "@/lib/youtube";
import { useApp } from "@/store/useApp";

/** Ícone de link no topo: cola um link do YouTube e projeta na hora ou guarda na programação. */
export function LinkPlayer() {
  const liveLink = useApp((state) => state.liveLink);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={liveLink ? "secondary" : "ghost"} size="icon" title="Link do YouTube">
          <Link2 className={cn("size-4", liveLink && "text-brand-400")} />
        </Button>
      </DialogTrigger>
      <DialogContent title="Link do YouTube" description="Qualquer vídeo, fora do hinário: projeta na hora ou entra na programação.">
        <LinkForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function LinkForm({ onDone }: { onDone: () => void }) {
  const playLink = useApp((state) => state.playLink);
  const addVideoToSetlist = useApp((state) => state.addVideoToSetlist);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  // O título automático só preenche se o operador não digitou um.
  const [titleEdited, setTitleEdited] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState(false);

  const videoId = parseVideoId(url);
  const invalid = url.trim() !== "" && !videoId;

  useEffect(() => {
    if (!videoId || titleEdited) return;
    let cancelled = false;
    setLoadingTitle(true);
    void fetchVideoTitle(videoId).then((found) => {
      if (cancelled) return;
      setLoadingTitle(false);
      if (found) setTitle(found);
    });
    return () => {
      cancelled = true;
    };
  }, [videoId, titleEdited]);

  const link = () => ({ videoId: videoId!, title: title.trim() || DEFAULT_VIDEO_TITLE });

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-ink-400" htmlFor="link-url">
          Link do vídeo
        </label>
        <Input
          id="link-url"
          autoFocus
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            if (!titleEdited) setTitle("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && videoId) {
              void playLink(link());
              onDone();
            }
          }}
          placeholder="https://www.youtube.com/watch?v=… ou youtu.be/…"
        />
        {invalid && <p className="mt-1 text-xs text-amber-400">Não reconheci um vídeo do YouTube nesse link.</p>}
      </div>

      <div>
        <label className="mb-1 flex items-center gap-2 text-xs text-ink-400" htmlFor="link-title">
          Título (opcional)
          {loadingTitle && <Loader2 className="size-3 animate-spin" />}
        </label>
        <Input
          id="link-title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setTitleEdited(event.target.value.trim() !== "");
          }}
          placeholder={DEFAULT_VIDEO_TITLE}
        />
      </div>

      {videoId && (
        <img
          src={thumbnailUrl(videoId)}
          alt=""
          className="aspect-video w-full rounded-lg border border-ink-700 bg-black object-cover"
        />
      )}

      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={!videoId}
          onClick={() => {
            void playLink(link());
            onDone();
          }}
        >
          <Play className="size-4" />
          Projetar agora
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          disabled={!videoId}
          onClick={() => {
            addVideoToSetlist(link());
            onDone();
          }}
        >
          <ListPlus className="size-4" />
          Na programação
        </Button>
      </div>
    </div>
  );
}
