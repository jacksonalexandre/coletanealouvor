import { useApp } from "@/store/useApp";

/** Ação de teclado ou da barra da projeção; a projeção manda pelo canal para o controle executar. */
export type ShortcutAction =
  | { type: "toggle" }
  | { type: "next" }
  | { type: "prev" }
  | { type: "blank" }
  | { type: "fullscreen" }
  | { type: "mute" }
  | { type: "seekBy"; seconds: number }
  | { type: "seekPercent"; percent: number }
  | { type: "seekEnd" }
  | { type: "seekTo"; seconds: number }
  | { type: "volume"; value: number }
  | { type: "volumeBy"; delta: number };

/**
 * Teclas no padrão do YouTube (K, J/L, ↑/↓, M, 0–9, Home/End). As setas sozinhas
 * já passam de hino/versículo, então os 5 s do YouTube ficam em Shift+←/→.
 */
export function shortcutFor(event: KeyboardEvent): ShortcutAction | null {
  if (event.ctrlKey || event.metaKey || event.altKey) return null;
  const key = event.key.toLowerCase();

  if (event.shiftKey) {
    if (event.key === "ArrowRight") return { type: "seekBy", seconds: 5 };
    if (event.key === "ArrowLeft") return { type: "seekBy", seconds: -5 };
    return null;
  }

  if (event.key === " " || key === "k") return { type: "toggle" };
  if (event.key === "ArrowRight" || event.key === "PageDown" || key === "n") return { type: "next" };
  if (event.key === "ArrowLeft" || event.key === "PageUp" || key === "p") return { type: "prev" };
  if (key === "b") return { type: "blank" };
  if (key === "f") return { type: "fullscreen" };
  if (key === "m") return { type: "mute" };
  if (key === "l") return { type: "seekBy", seconds: 10 };
  if (key === "j") return { type: "seekBy", seconds: -10 };
  if (event.key === "ArrowUp") return { type: "volumeBy", delta: 0.05 };
  if (event.key === "ArrowDown") return { type: "volumeBy", delta: -0.05 };
  if (event.key === "Home") return { type: "seekPercent", percent: 0 };
  if (event.key === "End") return { type: "seekEnd" };
  if (/^[0-9]$/.test(event.key)) return { type: "seekPercent", percent: Number(event.key) * 10 };
  return null;
}

/** Executa a ação no controle. Tela cheia é de cada janela e fica de fora. */
export function runShortcut(action: ShortcutAction) {
  const store = useApp.getState();
  const duration = store.player.duration;

  switch (action.type) {
    case "toggle":
      return store.toggle();
    case "next":
      return store.passage ? store.movePassageVerses(1) : store.stepHymn(1);
    case "prev":
      return store.passage ? store.movePassageVerses(-1) : store.stepHymn(-1);
    case "blank":
      return store.setBlank(!store.blank);
    case "mute":
      return store.toggleMute();
    case "volume":
      return store.setVolume(action.value);
    case "volumeBy":
      return store.setVolume(Math.min(1, Math.max(0, Math.round((store.volume + action.delta) * 100) / 100)));
    case "seekBy":
      return store.seekBy(action.seconds);
    case "seekTo":
      return store.seekTo(action.seconds);
    case "seekPercent":
      if (duration > 0) store.seekTo((duration * action.percent) / 100);
      return;
    case "seekEnd":
      if (duration > 0) store.seekTo(Math.max(0, duration - 1));
      return;
  }
}

/** A tecla deve ficar com o elemento em foco (campo de texto, diálogo)? */
export function belongsToTarget(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null;
  if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return true;
  // Com um diálogo aberto (sorteio, configurações), espaço/setas são dele.
  return !!target?.closest('[role="dialog"]');
}
