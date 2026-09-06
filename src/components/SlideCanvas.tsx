import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SlideStyle } from "@/lib/types";

const backgrounds: Record<SlideStyle["background"], string> = {
  black: "bg-black",
  deep: "bg-ink-950",
  gradient: "bg-[radial-gradient(ellipse_at_top,#132033,#04060b_70%)]",
};

type Props = {
  text: string;
  title?: string;
  style: SlideStyle;
  blank?: boolean;
  className?: string;
  /** Menor = usado como miniatura, sem título e com menos respiro. */
  compact?: boolean;
};

/**
 * Ajusta o corpo do texto ao espaço disponível: calcula o tamanho da fonte a
 * partir da linha mais longa e da quantidade de linhas, e reage a resize.
 */
export function SlideCanvas({ text, title, style, blank, className, compact }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(24);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const fit = () => {
      const lines = text.split("\n").filter(Boolean);
      if (lines.length === 0) return setFontSize(24);
      const longest = Math.max(...lines.map((line) => line.length), 1);
      const width = box.clientWidth * (compact ? 0.94 : 0.86);
      const height = box.clientHeight * (compact ? 0.9 : 0.8);
      // 0.52em é a largura média de caractere da Inter; 1.32 é a altura de linha.
      const byWidth = width / (longest * 0.52);
      const byHeight = height / (lines.length * 1.32);
      setFontSize(Math.max(10, Math.min(byWidth, byHeight) * style.fontScale));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text, style.fontScale, compact]);

  return (
    <div
      ref={boxRef}
      className={cn(
        "relative flex h-full w-full items-center overflow-hidden",
        backgrounds[style.background],
        style.align === "center" ? "justify-center" : "justify-start",
        className,
      )}
    >
      {!blank && (
        <p
          className={cn(
            "m-0 leading-[1.32] font-semibold whitespace-pre-line text-white",
            style.align === "center" ? "text-center" : "px-[4%] text-left",
            style.uppercase && "uppercase",
          )}
          style={{ fontSize: `${fontSize}px`, textShadow: "0 2px 24px rgba(0,0,0,.55)" }}
        >
          {text}
        </p>
      )}
      {!blank && !compact && style.showTitle && title && (
        <span className="absolute right-0 bottom-[2.5%] left-0 text-center text-[1.6vh] tracking-wide text-white/35">
          {title}
        </span>
      )}
    </div>
  );
}
