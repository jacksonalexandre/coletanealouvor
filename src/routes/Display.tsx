import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { createChannel } from "@/lib/channel";
import { formatClock, formatRemaining, useNow } from "@/lib/countdown";
import { randomIndex } from "@/lib/draw";
import { shortcutFor, type ShortcutAction } from "@/lib/shortcuts";
import { cn, formatDuration } from "@/lib/utils";
import { emptyLive } from "@/lib/useLive";
import type { LiveCountdown, LiveDraw, LiveState, PlayerState } from "@/lib/types";

type YTPlayer = {
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      host?: string;
      videoId?: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: () => void;
        onStateChange: (event: { data: number }) => void;
        onError: (event: { data: number }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Carrega a IFrame Player API uma única vez por janela. */
function loadYouTubeApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("Não foi possível carregar o player do YouTube."));
    window.onYouTubeIframeAPIReady = () => resolve(window.YT!);
    document.head.appendChild(script);
  });
  return apiPromise;
}

const erros: Record<number, string> = {
  2: "Id de vídeo inválido.",
  5: "O player não conseguiu reproduzir este vídeo.",
  100: "Vídeo não encontrado ou removido.",
  101: "O dono do vídeo não permite reprodução incorporada.",
  150: "O dono do vídeo não permite reprodução incorporada.",
};

/**
 * Janela de projeção: só o vídeo do hino, sem nenhum controle visível.
 *
 * `embedded`: a mesma projeção dentro da tela de controle (celular), sem abrir
 * outra janela. O canal é o mesmo — BroadcastChannel entrega mensagens entre
 * objetos da mesma página. Aí o toque em "Tocar" já é o gesto que libera o som,
 * o teclado fica com o controle e o player mostra os próprios botões, porque o
 * iOS só deixa começar um vídeo com som a partir de um toque dentro dele.
 */
export default function Display({ embedded = false }: { embedded?: boolean }) {
  const [live, setLive] = useState<LiveState>(emptyLive);
  const [activated, setActivated] = useState(embedded);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const playerRef = useRef<YTPlayer | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof createChannel> | null>(null);
  const liveRef = useRef(live);
  const stateRef = useRef({ playing: false, buffering: false, ended: false });
  const activatedRef = useRef(embedded);
  const rootRef = useRef<HTMLDivElement>(null);
  liveRef.current = live;

  const report = useCallback((patch: Partial<PlayerState> = {}) => {
    const player = playerRef.current;
    const state: PlayerState = {
      ready: !!player,
      activated: activatedRef.current,
      playing: stateRef.current.playing,
      buffering: stateRef.current.buffering,
      ended: stateRef.current.ended,
      currentTime: player?.getCurrentTime() ?? 0,
      duration: player?.getDuration() ?? 0,
      error: null,
      updatedAt: Date.now(),
      ...patch,
    };
    channelRef.current?.post({ type: "player", state });
  }, []);

  // Canal com a janela de controle.
  useEffect(() => {
    const channel = createChannel((message) => {
      if (message.type === "state") {
        setLive((current) => (message.state.updatedAt >= current.updatedAt ? message.state : current));
      }
      if (message.type === "hello") channel.post({ type: "display-open" });
    });

    channelRef.current = channel;
    channel.post({ type: "display-open" });

    const bye = () => channel.post({ type: "display-closed" });
    window.addEventListener("pagehide", bye);
    return () => {
      bye();
      window.removeEventListener("pagehide", bye);
      channel.close();
    };
  }, []);

  // Cria o player uma vez.
  useEffect(() => {
    let cancelled = false;

    void loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !mountRef.current) return;
        playerRef.current = new YT.Player(mountRef.current, {
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            controls: embedded ? 1 : 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            playsinline: 1,
            fs: embedded ? 1 : 0,
          },
          events: {
            onReady: () => {
              if (activatedRef.current) playerRef.current?.unMute();
              setReady(true);
              report({ ready: true });
            },
            onStateChange: (event) => {
              stateRef.current = {
                playing: event.data === YT.PlayerState.PLAYING,
                buffering: event.data === YT.PlayerState.BUFFERING,
                ended: event.data === YT.PlayerState.ENDED,
              };
              report();
            },
            onError: (event) => {
              const message = erros[event.data] ?? `Erro ${event.data} no player.`;
              setError(message);
              report({ error: message });
            },
          },
        });
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message);
      });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [report]);

  // Troca de vídeo.
  const loadedRef = useRef<string | null>(null);
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !ready) return;

    if (live.videoId !== loadedRef.current) {
      loadedRef.current = live.videoId;
      setError(null);
      stateRef.current = { playing: false, buffering: false, ended: false };
      if (!live.videoId) player.stopVideo();
      // Sem gesto nesta janela o navegador recusa o play; aí só deixamos pronto.
      else if (live.playing && activatedRef.current) player.loadVideoById(live.videoId);
      else player.cueVideoById(live.videoId);
      return;
    }

    if (!live.videoId) return;
    if (live.playing && activatedRef.current) player.playVideo();
    if (!live.playing) player.pauseVideo();
  }, [live.videoId, live.playing, ready]);

  // Volume e busca na linha do tempo.
  useEffect(() => {
    if (ready) playerRef.current?.setVolume(Math.round(live.volume * 100));
  }, [live.volume, ready]);

  useEffect(() => {
    if (!ready || !live.seek) return;
    playerRef.current?.seekTo(live.seek.time, true);
    // Pausado não há relatório periódico: avisa a nova posição ao controle.
    const timer = window.setTimeout(() => report(), 150);
    return () => clearTimeout(timer);
  }, [live.seek, ready, report]);

  // Relatório periódico de posição enquanto toca.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (playerRef.current && stateRef.current.playing) report();
    }, 500);
    return () => clearInterval(timer);
  }, [report]);

  // Teclado da janela de projeção. Embutida, o controle já ouve o teclado da página.
  useEffect(() => {
    if (embedded) return;
    const onKey = (event: KeyboardEvent) => {
      const action = shortcutFor(event);
      if (!action) return;
      event.preventDefault();
      if (action.type === "fullscreen") void toggleFullscreen();
      else channelRef.current?.post({ type: "command", action });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [embedded]);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else {
        const target = embedded ? rootRef.current : document.documentElement;
        await target?.requestFullscreen({ navigationUI: "hide" });
      }
    } catch {
      // Navegador pode recusar sem gesto do usuário; segue em janela.
    }
  };

  /**
   * Libera o som. Pelo clique na janela também entra em tela cheia; sem gesto
   * (navegador já autoriza som neste site) só libera.
   */
  const activate = (fromGesture = true) => {
    if (activatedRef.current) return;
    activatedRef.current = true;
    setActivated(true);
    const player = playerRef.current;
    if (player) {
      player.unMute();
      player.setVolume(Math.round(liveRef.current.volume * 100));
      if (liveRef.current.playing) player.playVideo();
    }
    if (fromGesture && !document.fullscreenElement) void toggleFullscreen();
    report({ activated: true });
  };

  // Se o navegador já deixa tocar com som sem clique (site com "Som: Permitir"
  // ou uso frequente), dispensa o "Clique para ativar o som".
  const activateRef = useRef(activate);
  activateRef.current = activate;
  useEffect(() => {
    if (embedded) return;
    let cancelled = false;
    void canAutoplayWithSound().then((allowed) => {
      if (allowed && !cancelled) activateRef.current(false);
    });
    return () => {
      cancelled = true;
    };
  }, [embedded]);

  const send = (action: ShortcutAction) => channelRef.current?.post({ type: "command", action });
  const showBar = !embedded && activated && !!live.videoId && !live.passage && !live.draw && !live.countdown;
  const barVisible = useIdleVisibility(rootRef, showBar);

  const covered = live.blank || (!live.videoId && !live.passage && !live.draw && !live.countdown);
  const background = live.appearance.displayBackground;
  const text = live.appearance.displayText;

  return (
    <div
      ref={rootRef}
      className={embedded ? "relative size-full overflow-hidden" : "relative h-dvh w-screen overflow-hidden"}
      // Tamanhos em cqw/cqh: acompanham a janela inteira ou o quadro embutido.
      style={{ background, containerType: "size" }}
      onDoubleClick={toggleFullscreen}
    >
      {/* O iframe do YouTube engole o movimento do mouse: esta camada o capta por cima.
          Mouse parado: somem a barra e o cursor, para não aparecerem na transmissão. */}
      {showBar && <div className={cn("absolute inset-0 z-20", !barVisible && "cursor-none")} />}
      <div className="absolute inset-0 [&>iframe]:size-full">
        <div ref={mountRef} className="size-full" />
      </div>

      {live.passage && !live.blank && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center ${
            embedded ? "gap-3 overflow-y-auto px-4 py-3" : "gap-8 px-20"
          }`}
          style={{ background: live.passageStyle.background, color: live.passageStyle.color }}
        >
          <p
            className="font-semibold tracking-wide uppercase opacity-75"
            style={{ fontSize: passageSize(live.passageStyle.fontSize * 0.6, embedded) }}
          >
            {live.passage.reference}
          </p>
          <div
            className="max-w-5xl space-y-4 leading-relaxed"
            style={{ fontSize: passageSize(live.passageStyle.fontSize, embedded) }}
          >
            {live.passage.verses.map((verse) => (
              <p key={verse.number}>
                <span className="mr-3 align-top opacity-70" style={{ fontSize: "0.5em" }}>
                  {verse.number}
                </span>
                {verse.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {live.draw && !live.blank && (
        <DrawScreen draw={live.draw} background={background} text={text} accent={live.appearance.accent} />
      )}

      {live.countdown && !live.blank && (
        <CountdownScreen
          countdown={live.countdown}
          background={background}
          text={text}
          accent={live.appearance.accent}
        />
      )}

      {/* Tela apagada por cima: vídeo/passagem continuam por baixo. */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          covered ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background }}
      />

      {/* Passagem, sorteio e cronômetro não têm som: mostram direto, sem pedir o clique de ativação. */}
      {!activated && !live.passage && !live.draw && !live.countdown && (
        <button
          onClick={() => activate()}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ background, color: text }}
        >
          <span className="text-2xl font-semibold">Clique para ativar o som</span>
          <span className="text-sm opacity-60">
            Uma vez por sessão. Também entra em tela cheia.
          </span>
        </button>
      )}

      {showBar && (
        <ProjectionBar
          visible={barVisible}
          live={live}
          playerRef={playerRef}
          onAction={send}
          onFullscreen={toggleFullscreen}
        />
      )}

      {activated && error && (
        <div className="absolute inset-x-0 bottom-8 text-center text-sm text-amber-400">{error}</div>
      )}

      {activated && !error && live.updatedAt === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-ink-400">
          Tela de projeção pronta
        </div>
      )}
    </div>
  );
}

const IDLE_MS = 2500;

/**
 * Visível enquanto o mouse se mexe na janela (e sempre que está sobre a barra);
 * some depois de alguns segundos parado ou quando o mouse sai da janela.
 */
function useIdleVisibility(rootRef: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) {
      setVisible(false);
      return;
    }
    let timer = 0;
    const show = (event: PointerEvent) => {
      setVisible(true);
      clearTimeout(timer);
      const overBar = (event.target as HTMLElement | null)?.closest("[data-projection-bar]");
      if (!overBar) timer = window.setTimeout(() => setVisible(false), IDLE_MS);
    };
    const hide = () => {
      clearTimeout(timer);
      setVisible(false);
    };
    root.addEventListener("pointermove", show);
    root.addEventListener("pointerdown", show);
    root.addEventListener("pointerleave", hide);
    return () => {
      clearTimeout(timer);
      root.removeEventListener("pointermove", show);
      root.removeEventListener("pointerdown", show);
      root.removeEventListener("pointerleave", hide);
    };
  }, [rootRef, enabled]);

  return visible;
}

/**
 * Barra de controle da projeção, no estilo do YouTube. Os comandos vão para o
 * controle pelo canal, como o teclado; a posição é lida direto do player daqui.
 */
function ProjectionBar({
  visible,
  live,
  playerRef,
  onAction,
  onFullscreen,
}: {
  visible: boolean;
  live: LiveState;
  playerRef: React.RefObject<YTPlayer | null>;
  onAction: (action: ShortcutAction) => void;
  onFullscreen: () => void;
}) {
  const [time, setTime] = useState({ current: 0, duration: 0 });
  const [scrubbing, setScrubbing] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(() => !!document.fullscreenElement);

  useEffect(() => {
    if (!visible) return;
    const read = () =>
      setTime({
        current: playerRef.current?.getCurrentTime() ?? 0,
        duration: playerRef.current?.getDuration() ?? 0,
      });
    read();
    const timer = window.setInterval(read, 250);
    return () => clearInterval(timer);
  }, [visible, playerRef]);

  useEffect(() => {
    const update = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  // Sem foco no slider: espaço e setas continuam com os atalhos da janela.
  const blur = () => (document.activeElement as HTMLElement | null)?.blur();
  const position = scrubbing ?? time.current;
  const muted = live.volume === 0;

  return (
    <div
      data-projection-bar
      className={cn(
        "absolute inset-x-0 bottom-0 z-30 bg-linear-to-t from-black/85 via-black/50 to-transparent px-6 pt-12 pb-4 text-white transition-opacity duration-300",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <Slider
        value={[Math.min(position, time.duration || 1)]}
        min={0}
        max={time.duration || 1}
        step={0.5}
        disabled={time.duration === 0}
        onValueChange={([value]) => setScrubbing(value)}
        onValueCommit={([value]) => {
          onAction({ type: "seekTo", seconds: value });
          setScrubbing(null);
          blur();
        }}
      />
      <div className="mt-3 flex items-center gap-1">
        <BarButton title="Anterior (P)" onClick={() => onAction({ type: "prev" })}>
          <ChevronLeft className="size-6" />
        </BarButton>
        <BarButton title={live.playing ? "Pausar (K)" : "Tocar (K)"} onClick={() => onAction({ type: "toggle" })}>
          {live.playing ? <Pause className="size-6" /> : <Play className="size-6" />}
        </BarButton>
        <BarButton title="Próximo (N)" onClick={() => onAction({ type: "next" })}>
          <ChevronRight className="size-6" />
        </BarButton>

        <BarButton title={muted ? "Ativar som (M)" : "Mudo (M)"} onClick={() => onAction({ type: "mute" })}>
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </BarButton>
        <Slider
          className="w-24"
          value={[live.volume]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={([value]) => onAction({ type: "volume", value })}
          onValueCommit={blur}
        />

        <span className="ml-4 text-sm tabular-nums opacity-90">
          {formatDuration(Math.floor(position))} /{" "}
          {time.duration ? formatDuration(Math.floor(time.duration)) : "--:--"}
        </span>
        <span className="ml-4 min-w-0 flex-1 truncate text-sm opacity-75">{live.title}</span>

        <BarButton title="Apagar tela (B)" onClick={() => onAction({ type: "blank" })} active={live.blank}>
          <EyeOff className="size-5" />
        </BarButton>
        <BarButton title="Tela cheia (F)" onClick={onFullscreen}>
          {fullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
        </BarButton>
      </div>
    </div>
  );
}

function BarButton({
  title,
  onClick,
  active = false,
  children,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      // Não pega foco: espaço num botão focado tocaria/pausaria duas vezes.
      tabIndex={-1}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/15",
        active && "text-amber-400",
      )}
    >
      {children}
    </button>
  );
}

/**
 * O navegador deixa começar som sem gesto nesta janela? Firefox responde direto;
 * no Chrome/Edge um AudioContext só chega a "running" sem gesto quando o
 * autoplay com som está liberado para o site.
 */
async function canAutoplayWithSound(): Promise<boolean> {
  const nav = navigator as Navigator & { getAutoplayPolicy?: (type: "mediaelement") => string };
  if (typeof nav.getAutoplayPolicy === "function") {
    try {
      return nav.getAutoplayPolicy("mediaelement") === "allowed";
    } catch {
      // Segue para o teste com AudioContext.
    }
  }
  if (typeof AudioContext === "undefined") return false;
  const context = new AudioContext();
  try {
    await Promise.race([context.resume(), new Promise((resolve) => setTimeout(resolve, 500))]);
    return context.state === "running";
  } catch {
    return false;
  } finally {
    void context.close();
  }
}

/** Na janela, o tamanho em rem configurado; embutida, proporcional ao quadro (1rem ≈ 1/80 da largura de um projetor). */
const passageSize = (rem: number, embedded: boolean) => (embedded ? `${rem * 1.25}cqw` : `${rem}rem`);

const ROLL_MS = 1800;

/** Resultado do sorteio em tela cheia, depois de uma "roleta" rápida de valores. */
function DrawScreen({
  draw,
  background,
  text,
  accent,
}: {
  draw: LiveDraw;
  background: string;
  text: string;
  accent: string;
}) {
  const [shown, setShown] = useState(draw.value);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const candidate = () =>
      draw.kind === "number"
        ? String(draw.min + randomIndex(draw.max - draw.min + 1))
        : draw.names[randomIndex(draw.names.length)];

    setRolling(true);
    const started = performance.now();
    let timer = 0;
    // Começa rápido e vai desacelerando até parar no resultado.
    const tick = () => {
      const elapsed = performance.now() - started;
      if (elapsed >= ROLL_MS) {
        setShown(draw.value);
        setRolling(false);
        return;
      }
      setShown(candidate());
      timer = window.setTimeout(tick, 50 + (elapsed / ROLL_MS) ** 2 * 250);
    };
    tick();
    return () => clearTimeout(timer);
    // O nonce muda a cada sorteio; o resto do objeto vem junto.
  }, [draw.nonce]);

  const long = draw.kind === "name" && shown.length > 14;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[3cqh] px-[5cqw] text-center"
      style={{ background }}
    >
      <p
        className="text-[min(5cqh,3cqw)] font-semibold tracking-[0.3em] uppercase opacity-60"
        style={{ color: text }}
      >
        Sorteio
      </p>
      <p
        key={rolling ? "rolling" : `result-${draw.nonce}`}
        className={`max-w-full font-bold break-words tabular-nums ${rolling ? "opacity-70" : "animate-[draw-pop_450ms_ease-out]"}`}
        style={{
          color: accent,
          fontSize: draw.kind === "number" ? "min(40cqh, 30cqw)" : long ? "min(14cqh, 8cqw)" : "min(22cqh, 12cqw)",
          lineHeight: 1.05,
        }}
      >
        {shown}
      </p>
    </div>
  );
}

/** Contagem regressiva grande até o horário final, com o relógio atual pequeno embaixo. */
function CountdownScreen({
  countdown,
  background,
  text: textColor,
  accent,
}: {
  countdown: LiveCountdown;
  background: string;
  text: string;
  accent: string;
}) {
  const now = useNow();
  const remaining = countdown.endsAt - now.getTime();
  const finished = remaining <= 0;
  const text = formatRemaining(remaining);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[2cqh] px-[5cqw] text-center"
      style={{ background }}
    >
      {countdown.label && (
        <p
          className="max-w-full text-[min(6cqh,4cqw)] font-semibold break-words opacity-75"
          style={{ color: textColor }}
        >
          {countdown.label}
        </p>
      )}
      <p
        className={`font-bold tabular-nums ${finished ? "animate-pulse" : ""}`}
        style={{
          color: accent,
          fontSize: text.length > 5 ? "min(30cqh, 17cqw)" : "min(38cqh, 24cqw)",
          lineHeight: 1,
        }}
      >
        {text}
      </p>
      <p className="text-[min(5cqh,3cqw)] font-medium tabular-nums opacity-55" style={{ color: textColor }}>
        {formatClock(now)}
      </p>
    </div>
  );
}
