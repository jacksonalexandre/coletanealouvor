import { ChevronLeft, ChevronRight, EyeOff, Radio, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlideCanvas } from "@/components/SlideCanvas";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";

/** Pré-visualização do que está no ar + o que vem a seguir. */
export function LivePanel() {
  const slides = useApp((state) => state.slides);
  const slideIndex = useApp((state) => state.slideIndex);
  const style = useApp((state) => state.style);
  const blank = useApp((state) => state.blank);
  const live = useApp((state) => state.live);
  const title = useApp((state) => state.song(state.songId)?.title ?? "");
  const step = useApp((state) => state.step);
  const setBlank = useApp((state) => state.setBlank);
  const setLive = useApp((state) => state.setLive);
  const stepSong = useApp((state) => state.stepSong);

  const current = slides[slideIndex] ?? "";
  const next = slides[slideIndex + 1] ?? "";

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-ink-400 uppercase">No ar</span>
          <span className="text-xs text-ink-400">
            {slides.length > 0 ? `${slideIndex + 1}/${slides.length}` : "—"}
          </span>
        </div>
        <div
          className={cn(
            "aspect-video overflow-hidden rounded-xl border",
            live && !blank ? "border-brand-500/70" : "border-ink-700",
          )}
        >
          <SlideCanvas text={current} title={title} style={style} blank={blank || !live} />
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-xs font-semibold tracking-wider text-ink-400 uppercase">A seguir</span>
        <div className="aspect-video overflow-hidden rounded-xl border border-ink-800 opacity-60">
          <SlideCanvas text={next} style={style} compact />
        </div>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" className="flex-1" onClick={() => step(-1)}>
            <ChevronLeft className="size-5" />
          </Button>
          <Button size="lg" className="flex-[2]" onClick={() => step(1)}>
            <ChevronRight className="size-5" />
            Próximo
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={blank ? "danger" : "outline"}
            className="flex-1"
            onClick={() => setBlank(!blank)}
            title="Tecla B"
          >
            <EyeOff className="size-4" />
            {blank ? "Em preto" : "Apagar"}
          </Button>
          <Button
            variant={live ? "default" : "outline"}
            className="flex-1"
            onClick={() => setLive(!live)}
            title="Tecla L"
          >
            <Radio className="size-4" />
            {live ? "No ar" : "Colocar no ar"}
          </Button>
          <Button variant="outline" onClick={() => stepSong(1)} title="Próxima música do roteiro">
            <SkipForward className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
