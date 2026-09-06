import { useEffect, useRef, useState } from "react";
import { createChannel } from "@/lib/channel";
import { useLiveReceiver } from "@/lib/useLive";
import { SlideCanvas } from "@/components/SlideCanvas";

/** Janela/tela de projeção: só letra, sem nenhum controle visível. */
export default function Display() {
  const state = useLiveReceiver();
  const [idle, setIdle] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Esconde o cursor depois de 2s parado — projetor não deve mostrar seta.
  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), 2000);
    const wake = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), 2000);
    };
    window.addEventListener("mousemove", wake);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
    };
  }, []);

  // Teclado também funciona a partir da tela de projeção.
  useEffect(() => {
    const channel = createChannel(() => {});
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        channel.post({ type: "command", action: "next" });
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        channel.post({ type: "command", action: "prev" });
      }
      if (event.key.toLowerCase() === "b") channel.post({ type: "command", action: "blank" });
      if (event.key.toLowerCase() === "f") void toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      channel.close();
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await rootRef.current?.requestFullscreen({ navigationUI: "hide" });
    } catch {
      // Navegador pode recusar sem gesto do usuário; segue em janela.
    }
  };

  const slide = state.slides[state.slideIndex] ?? "";
  const empty = state.slides.length === 0 || state.blank;

  return (
    <div
      ref={rootRef}
      onDoubleClick={toggleFullscreen}
      className={`h-dvh w-screen bg-black ${idle ? "cursor-none" : "cursor-default"}`}
    >
      <SlideCanvas text={slide} title={state.title} style={state.style} blank={empty} />
      {state.updatedAt === 0 && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-400">
          <p className="text-lg">Tela de projeção pronta</p>
          <p className="text-sm">Arraste para o projetor e dê dois cliques para tela cheia</p>
        </div>
      )}
    </div>
  );
}
