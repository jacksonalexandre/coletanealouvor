import { useEffect, useRef, useState } from 'react';
import { loadYouTubeApi, type YTPlayer } from '@/lib/youtubePlayer';
import { useApp } from '@/store/useApp';
import { thumbnailUrl } from '@/lib/youtube';

// One muted operator monitor. YouTube is independently streamed; sync is approximate.
export function VideoMonitor({ videoId, blank }: { videoId: string; blank: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setReady(false); setFailed(false);
    const element = document.createElement('div');
    host.current?.append(element);
    void loadYouTubeApi().then(YT => {
      if (cancelled) return;
      player.current = new YT.Player(element, {
        host: 'https://www.youtube-nocookie.com', videoId,
        playerVars: { controls: 0, disablekb: 1, mute: 1, autoplay: 0, playsinline: 1, rel: 0 },
        events: {
          onReady: () => { player.current?.mute(); setReady(true); },
          onStateChange: () => {},
          onError: () => setFailed(true),
        },
      });
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; player.current?.destroy(); player.current = null; element.remove(); };
  }, [videoId]);
  useEffect(() => {
    if (!ready) return;
    const sync = () => {
      const s = useApp.getState();
      const p = player.current;
      if (!p) return;
      p.mute();
      if (Math.abs(p.getCurrentTime() - s.player.currentTime) > 1.5) p.seekTo(s.player.currentTime, true);
      if (s.player.playing) p.playVideo(); else p.pauseVideo();
    };
    sync(); const id = window.setInterval(sync, 1000); return () => clearInterval(id);
  }, [ready]);
  return <div className="relative h-full w-full bg-black">
    <div ref={host} className="absolute inset-0 pointer-events-none [&>iframe]:size-full" />
    {(!ready || failed) && <img src={thumbnailUrl(videoId)} alt="Capa do vídeo" className="absolute inset-0 h-full w-full object-contain" />}
    {failed && <span className="absolute bottom-1 left-2 text-[10px] bg-black/70">Monitor indisponível · confira a projeção</span>}
    {blank && <div className="absolute inset-0 bg-black" />}
  </div>;
}
