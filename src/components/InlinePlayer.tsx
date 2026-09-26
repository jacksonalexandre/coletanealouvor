import { lazy, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";

const Display = lazy(() => import("@/routes/Display"));

/** Projeção embutida na tela de controle, para tocar no próprio aparelho (celular). */
export function InlinePlayer() {
  const playing = useApp((state) => state.playing);
  const blank = useApp((state) => state.blank);

  return (
    <div className="shrink-0 p-3 pb-0">
      <div
        className={cn(
          "aspect-video overflow-hidden rounded-xl border bg-black",
          playing && !blank ? "border-brand-500/70" : "border-ink-700",
        )}
      >
        <Suspense fallback={null}>
          <Display embedded />
        </Suspense>
      </div>
    </div>
  );
}
