export type YTPlayer = {
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
  mute: () => void;
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
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
  };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Carrega a IFrame Player API uma única vez por janela. */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) return resolve(window.YT);

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    const timer = window.setTimeout(() => {
      apiPromise = null;
      script.remove();
      reject(new Error("O player do YouTube demorou demais para responder."));
    }, 10_000);
    script.onerror = () => {
      window.clearTimeout(timer);
      apiPromise = null;
      reject(new Error("Não foi possível carregar o player do YouTube."));
    };
    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timer);
      resolve(window.YT!);
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}
