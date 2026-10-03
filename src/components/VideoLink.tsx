import { useEffect, useState } from "react";
import { Check, Link2, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseVideoId, watchUrl } from "@/lib/youtube";
import { useApp } from "@/store/useApp";
import { canEditHymns, useAuth } from "@/store/useAuth";

type Props = { hymnId: number; videoId: string | null };

/**
 * Cadastro do vídeo de um hino. O mapa vem do Supabase (coletanea_videos); o
 * que o operador cola aqui fica no navegador dele, por cima do banco.
 * Sem login só mostra: cadastrar, trocar e remover pedem conta.
 */
export function VideoLink({ hymnId, videoId }: Props) {
  const setVideo = useApp((state) => state.setVideo);
  const clearVideo = useApp((state) => state.clearVideo);
  const canEdit = useAuth(canEditHymns);
  const signIn = useAuth((state) => state.signIn);

  const [input, setInput] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setInput("");
    setInvalid(false);
    setEditing(false);
  }, [hymnId]);

  const save = () => {
    if (setVideo(hymnId, input)) {
      setInput("");
      setEditing(false);
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  };

  if (videoId && (!editing || !canEdit)) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-ink-800 px-2 py-1.5 text-xs text-ink-400">
        <Check className="size-3.5 shrink-0 text-brand-500" />
        <a
          href={watchUrl(videoId)}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 flex-1 truncate hover:text-ink-200"
        >
          Vídeo cadastrado
        </a>
        {canEdit && (
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Trocar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => clearVideo(hymnId)}
              aria-label="Remover vídeo"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-ink-800 px-2 py-1.5 text-xs text-ink-400">
        <Lock className="size-3.5 shrink-0" />
        <span className="min-w-0 flex-1">Sem vídeo. Entre para cadastrar.</span>
        <Button variant="ghost" size="sm" onClick={() => void signIn()}>
          Entrar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-ink-800 p-2">
      <label className="flex items-center gap-1.5 text-xs text-ink-400">
        <Link2 className="size-3.5" />
        Link do vídeo no YouTube
      </label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setInvalid(false);
          }}
          onKeyDown={(event) => event.key === "Enter" && save()}
          onPaste={(event) => {
            // Colar um link válido já salva: um passo a menos no meio do culto.
            const pasted = event.clipboardData.getData("text");
            if (parseVideoId(pasted)) {
              event.preventDefault();
              if (setVideo(hymnId, pasted)) {
                setInput("");
                setEditing(false);
              }
            }
          }}
          placeholder="Cole aqui"
          className="h-9 text-xs"
        />
        <Button size="sm" onClick={save} disabled={!input.trim()}>
          Salvar
        </Button>
      </div>
      {invalid && <p className="text-xs text-amber-400">Não reconheci um vídeo nesse link.</p>}
    </div>
  );
}
