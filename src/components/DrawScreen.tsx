import { useEffect, useState } from "react";
import type { Frame } from "@/lib/content";
import { drawPhase } from "@/lib/draw";

export function DrawScreen({ frame }: { frame: Extract<Frame, { kind: "draw" }> }) {
  const [now, setNow] = useState(Date.now());
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    const interval = setInterval(() => setNow(Date.now()), 40);
    return () => { clearInterval(interval); media.removeEventListener("change", change); };
  }, []);
  const phase = drawPhase(frame.results, frame.startedAt, now);
  const candidates = frame.candidates?.length ? frame.candidates : frame.results;
  const value = phase.revealing
    ? reduced ? "…" : candidates[(phase.tick * 7 + phase.index * 13) % candidates.length]
    : frame.results[phase.index];
  const history = [...(frame.history ?? []), ...frame.results.slice(0, phase.index)];
  const pages = Math.max(1, Math.ceil(history.length / 18));
  const page = Math.floor(Math.max(0, now - (frame.startedAt ?? 0)) / 7000) % pages;
  return <section className="draw-stage" data-phase={phase.revealing ? "drawing" : "revealed"}>
    <h2>{frame.title}</h2>
    <div className="draw-winner-area">
      <div className={`draw-winner ${phase.revealing ? "drawing" : "revealed"}`} key={`${phase.index}-${phase.revealing}`}
        style={{ fontSize: (value?.length ?? 0) > 24 ? 66 : (value?.length ?? 0) > 10 ? 92 : 158 }}>
        {value ?? "—"}
      </div>
      <p className="draw-status">{phase.revealing ? "SORTEANDO…" : "SORTEADO"}
        {frame.results.length > 1 && <span> · {phase.index + 1} de {frame.results.length}</span>}
      </p>
    </div>
    <div className="draw-history">
      <h3>JÁ SORTEADOS {pages > 1 && <span>· {page + 1}/{pages}</span>}</h3>
      <div className="draw-history-grid">
        {history.slice(page * 18, (page + 1) * 18).map((result, i) => <span key={i}>{result}</span>)}
      </div>
      {!history.length && <p>Primeiro sorteio</p>}
    </div>
  </section>;
}
