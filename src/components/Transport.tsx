import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Loader2,
  MonitorPlay,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VideoLink } from "@/components/VideoLink";
import { passageReference, passageVerses } from "@/lib/bible";
import { cn, formatDuration } from "@/lib/utils";
import { thumbnailUrl } from "@/lib/youtube";
import { useApp } from "@/store/useApp";

/** Comando da projeção: o que está no ar e os controles do vídeo. */
export function Transport() {
  const hymn = useApp((state) => state.hymn(state.hymnId));
  const videoId = useApp((state) => state.videoOf(state.hymnId));
  const playing = useApp((state) => state.playing);
  const blank = useApp((state) => state.blank);
  const volume = useApp((state) => state.volume);
  const player = useApp((state) => state.player);
  const displayOpen = useApp((state) => state.displayOpen);
  const passage = useApp((state) => state.passage);
  const bible = useApp((state) => state.bible);

  const toggle = useApp((state) => state.toggle);
  const seekTo = useApp((state) => state.seekTo);
  const setVolume = useApp((state) => state.setVolume);
  const setBlank = useApp((state) => state.setBlank);
  const stepHymn = useApp((state) => state.stepHymn);
  const movePassageVerses = useApp((state) => state.movePassageVerses);
  const closePassage = useApp((state) => state.closePassage);

  const [scrubbing, setScrubbing] = useState<number | null>(null);

  if (passage && bible.length) {
    return (
      <PassageTransport
        reference={passageReference(bible, passage)}
        verses={passageVerses(bible, passage)}
        blank={blank}
        displayOpen={displayOpen}
        activated={player.activated}
        onPrev={() => movePassageVerses(-1)}
        onNext={() => movePassageVerses(1)}
        onBlank={() => setBlank(!blank)}
        onClose={closePassage}
      />
    );
  }

  if (!hymn) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-ink-400">
        Busque um hino para começar.
      </div>
    );
  }

  const duration = player.duration || 0;
  const position = scrubbing ?? player.currentTime;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <div>
        <span className="text-xs font-semibold tracking-wider text-ink-400 uppercase">No ar</span>
        <div
          className={cn(
            "mt-1 aspect-video overflow-hidden rounded-xl border bg-black",
            playing && !blank ? "border-brand-500/70" : "border-ink-700",
          )}
        >
          {videoId && !blank ? (
            <img
              src={thumbnailUrl(videoId)}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-ink-600">
              {blank ? "Tela apagada" : "Sem vídeo"}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-ink-200">
          <span className="mr-2 tabular-nums text-brand-400">{hymn.number}</span>
          {hymn.title}
        </p>
        <Status displayOpen={displayOpen} activated={player.activated} error={player.error} />
      </div>

      <VideoLink hymnId={hymn.id} videoId={videoId} />

      <div className="mt-auto space-y-3">
        <div>
          <Slider
            value={[Math.min(position, duration || 1)]}
            min={0}
            max={duration || 1}
            step={0.5}
            disabled={!videoId || duration === 0}
            onValueChange={([value]) => setScrubbing(value)}
            onValueCommit={([value]) => {
              seekTo(value);
              setScrubbing(null);
            }}
          />
          <div className="mt-1 flex justify-between text-[11px] tabular-nums text-ink-400">
            <span>{formatDuration(Math.floor(position))}</span>
            <span>{duration ? formatDuration(Math.floor(duration)) : "--:--"}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="lg" onClick={() => stepHymn(-1)} title="Hino anterior (P)">
            <ChevronLeft className="size-5" />
          </Button>
          <Button size="lg" className="flex-1" onClick={toggle} disabled={!videoId} title="Espaço">
            {player.buffering ? (
              <Loader2 className="size-5 animate-spin" />
            ) : playing ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5" />
            )}
            {playing ? "Pausar" : "Tocar"}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => stepHymn(1)} title="Próximo hino (N)">
            <ChevronRight className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={blank ? "danger" : "outline"}
            className="flex-1"
            onClick={() => setBlank(!blank)}
            title="Tecla B"
          >
            <EyeOff className="size-4" />
            {blank ? "Tela apagada" : "Apagar tela"}
          </Button>
          <div className="flex w-28 items-center gap-2">
            <Volume2 className="size-4 shrink-0 text-ink-400" />
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={([value]) => setVolume(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PassageTransport({
  reference,
  verses,
  blank,
  displayOpen,
  activated,
  onPrev,
  onNext,
  onBlank,
  onClose,
}: {
  reference: string;
  verses: { number: number; text: string }[];
  blank: boolean;
  displayOpen: boolean;
  activated: boolean;
  onPrev: () => void;
  onNext: () => void;
  onBlank: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <div>
        <span className="text-xs font-semibold tracking-wider text-ink-400 uppercase">No ar</span>
        <div className="mt-1 max-h-64 space-y-2 overflow-y-auto rounded-xl border border-brand-500/70 bg-ink-900 p-3">
          <p className="text-sm font-semibold text-brand-400">{reference}</p>
          {verses.map((verse) => (
            <p key={verse.number} className="text-sm text-ink-200">
              <span className="mr-2 tabular-nums text-brand-400">{verse.number}</span>
              {verse.text}
            </p>
          ))}
        </div>
        <Status displayOpen={displayOpen} activated={activated} error={null} />
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" onClick={onPrev} title="Versículo anterior (P)">
            <ChevronLeft className="size-5" />
          </Button>
          <Button variant="secondary" size="lg" className="flex-1" onClick={onClose}>
            Encerrar passagem
          </Button>
          <Button variant="secondary" size="lg" onClick={onNext} title="Próximo versículo (N)">
            <ChevronRight className="size-5" />
          </Button>
        </div>

        <Button variant={blank ? "danger" : "outline"} className="w-full" onClick={onBlank} title="Tecla B">
          <EyeOff className="size-4" />
          {blank ? "Tela apagada" : "Apagar tela"}
        </Button>
      </div>
    </div>
  );
}

function Status({
  displayOpen,
  activated,
  error,
}: {
  displayOpen: boolean;
  activated: boolean;
  error: string | null;
}) {
  if (error) return <Line tone="danger">{error}</Line>;
  if (!displayOpen) {
    return (
      <Line tone="muted">
        <MonitorPlay className="size-3.5" />
        Abra a projeção para tocar.
      </Line>
    );
  }
  if (!activated) {
    return <Line tone="warn">Clique uma vez na janela de projeção para liberar o som.</Line>;
  }
  return <Line tone="ok">Projeção pronta.</Line>;
}

function Line({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "danger" | "muted";
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "mt-1 flex items-center gap-1.5 text-xs",
        tone === "ok" && "text-brand-400",
        tone === "warn" && "text-amber-400",
        tone === "danger" && "text-red-400",
        tone === "muted" && "text-ink-400",
      )}
    >
      {children}
    </p>
  );
}
