import { useRef, useState } from "react";
import { FileUp, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { importMedia, removeMedia, type MediaEntry } from "@/lib/media";
import { useLibrary } from "@/store/useLibrary";
import { useApp } from "@/store/useApp";
import { AssetImage } from "./ContentScreen";

export function MediaLibrary() {
  const { media, refresh, error } = useLibrary();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sequence, setSequence] = useState(true);
  const [dragging, setDragging] = useState(false);
  const importFiles = async (files: File[]) => {
    if (busy || !files.length) return;
    setBusy(true);
    try {
      const imported = await importMedia(files, sequence, setMessage);
      await refresh();
      if (imported[0]) useApp.getState().prepare(imported[0].content);
      setMessage(
        `${imported.length} apresentação(ões) salva(s) neste navegador.`,
      );
    } catch (cause) {
      console.error(cause);
      const reason = cause instanceof Error ? cause.message : "";
      setMessage(
        /PDF|Escolha|compatibilidade|Imagem|Divida/.test(reason)
          ? reason
          : "Não foi possível importar. Confira se o arquivo abre, não exige senha e se há espaço no navegador.",
      );
      await refresh();
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  const remove = async (entry: MediaEntry) => {
    const s = useApp.getState();
    const uses = (c: typeof s.preview) =>
      c?.kind === "media" &&
      c.assetIds.some((id) => entry.content.assetIds.includes(id));
    if (uses(s.liveContent)) {
      setMessage(
        "Este arquivo está no ar. Coloque outro conteúdo no ar antes de removê-lo.",
      );
      return;
    }
    const referenced = [
      ...s.setlist,
      ...s.savedPlans.flatMap((p) => p.items),
    ].some((i) => i.type === "content" && uses(i.content));
    if (referenced) {
      setMessage(
        "Este arquivo pertence a um roteiro. Remova-o das programações antes de excluir a mídia.",
      );
      return;
    }
    if (
      !confirm(
        `Remover “${entry.content.title}” deste navegador? O arquivo original permanece no computador.`,
      )
    )
      return;
    try {
      await removeMedia(entry);
      if (uses(s.preview)) useApp.setState({ preview: null });
      await refresh();
      setMessage("Mídia removida. Você pode importar o original novamente.");
    } catch {
      setMessage("Não foi possível remover o arquivo. Tente novamente.");
    }
  };
  return (
    <div
      className="library-scroll"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void importFiles(Array.from(e.dataTransfer.files));
      }}
    >
      <div className={`drop-area ${dragging ? "dragging" : ""}`}>
        <FileUp size={26} />
        <strong>Apresentações e imagens</strong>
        <p>Arraste um PDF ou imagens aqui.</p>
        <Button disabled={busy} onClick={() => input.current?.click()}>
          {busy ? "Importando…" : "Escolher arquivos"}
        </Button>
        <input
          ref={input}
          type="file"
          hidden
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp,.ppt,.pptx"
          onChange={(e) => void importFiles(Array.from(e.target.files ?? []))}
        />
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={sequence}
            onChange={(e) => setSequence(e.target.checked)}
          />
          Agrupar imagens em uma apresentação
        </label>
      </div>
      <p className="hint">
        PowerPoint: exporte como PDF para preservar a aparência. Seus arquivos
        ficam somente neste navegador. Guarde os originais.
      </p>
      {(message || error) && (
        <p role="status" className="feedback">
          {message || error}
        </p>
      )}
      {!media.length && !busy && (
        <p className="hint">Nenhuma apresentação importada.</p>
      )}
      {media.map((entry) => (
        <div className="media-row" key={entry.id}>
          <button
            className="media-thumb"
            onClick={() => useApp.getState().prepare(entry.content)}
            aria-label={`Preparar ${entry.content.title}`}
          >
            <AssetImage id={entry.content.assetIds[0]} thumbnail />
          </button>
          <button
            className="min-w-0 flex-1 text-left"
            onClick={() => useApp.getState().prepare(entry.content)}
          >
            <strong className="block truncate text-sm">
              {entry.content.title}
            </strong>
            <span className="hint">
              {entry.content.assetIds.length} slide(s) ·{" "}
              {(entry.bytes / 1024 / 1024).toFixed(1)} MB
            </span>
          </button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => useApp.getState().addContent(entry.content)}
            title="Adicionar ao roteiro"
          >
            +
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => void remove(entry)}
            aria-label={`Remover ${entry.content.title}`}
          >
            <Trash2 size={15} />
          </Button>
        </div>
      ))}
    </div>
  );
}
