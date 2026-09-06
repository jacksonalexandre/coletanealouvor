import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SlideCanvas } from "@/components/SlideCanvas";
import { useApp } from "@/store/useApp";

/** Miniaturas dos slides da música aberta; clique manda para a projeção. */
export function SlideStrip() {
  const slides = useApp((state) => state.slides);
  const slideIndex = useApp((state) => state.slideIndex);
  const style = useApp((state) => state.style);
  const goTo = useApp((state) => state.goTo);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const active = containerRef.current?.querySelector<HTMLElement>("[data-active='true']");
    active?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [slideIndex]);

  if (slides.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-ink-400">
        Escolha uma música para ver os slides.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid h-full auto-rows-min grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 overflow-y-auto p-3"
    >
      {slides.map((slide, index) => (
        <button
          key={index}
          data-active={index === slideIndex}
          onClick={() => goTo(index)}
          className={cn(
            "relative aspect-video overflow-hidden rounded-lg border text-left transition-colors",
            index === slideIndex
              ? "border-brand-500 ring-2 ring-brand-500/40"
              : "border-ink-700 hover:border-ink-600",
          )}
        >
          <SlideCanvas text={slide} style={style} compact />
          <span className="absolute top-1 left-1 rounded bg-black/60 px-1.5 text-[10px] text-white/70">
            {index + 1}
          </span>
        </button>
      ))}
    </div>
  );
}
