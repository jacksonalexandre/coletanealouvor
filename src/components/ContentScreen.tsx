import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { type Frame, timerSeconds } from '@/lib/content';
import { readAsset } from '@/lib/media';
import { thumbnailUrl } from '@/lib/youtube';

export function AssetImage({ id, title = '' }: { id: string; title?: string }) {
  const [image, setImage] = useState<{ id: string; url: string } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    setFailed(false);
    void readAsset(id).then(blob => {
      if (cancelled) return;
      if (!blob) { setFailed(true); return; }
      url = URL.createObjectURL(blob); setImage({ id, url });
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, [id]);
  if (failed) return <div className="screen-message">Arquivo indisponível neste navegador. Importe-o novamente.</div>;
  if (!image || image.id !== id) return <div className="screen-message">Carregando…</div>;
  return <img src={image.url} alt={title} className="h-full w-full object-contain" />;
}

export function TimerValue({ timer }: { timer: Extract<Frame, { kind: 'timer' }> }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (timer.endsAt === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [timer.endsAt]);
  const seconds = timerSeconds(timer, now);
  return <span className="tabular-nums">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</span>;
}

// A single 1280 × 720 stage scales identically in the console and the projector.
export function ContentScreen({ frame, blank = false }: { frame: Frame | null; blank?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => setScale(Math.min(entry.contentRect.width / 1280, entry.contentRect.height / 720)));
    resize.observe(element);
    return () => resize.disconnect();
  }, []);
  useLayoutEffect(() => {
    const element = text.current;
    if (!element) return;
    let font = frame?.kind === 'passage' ? frame.style.fontSize * 20 : 48;
    element.style.fontSize = `${font}px`;
    while (element.scrollHeight > 490 && font > 18) { font -= 2; element.style.fontSize = `${font}px`; }
  }, [frame]);

  return <div ref={container} className="content-screen" data-testid="content-screen">
    <div className="content-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
      {!frame ? <div className="screen-message">Prepare um conteúdo para começar</div> : frame.kind === 'media' ? <AssetImage id={frame.assetId} title={frame.title} /> : frame.kind === 'video' ?
        frame.videoId ? <img className="h-full w-full object-contain" src={thumbnailUrl(frame.videoId)} alt={frame.title} /> : <div className="screen-message">Adicione o link do vídeo deste hino</div> :
        <div className="text-stage" style={frame.kind === 'passage' ? { background: frame.style.background, color: frame.style.color } : undefined}>
          <h2>{frame.title}</h2>
          <div ref={text} className="stage-body">
            {frame.kind === 'passage' && frame.verses.map(v => <p key={v.number}><sup>{v.number}</sup> {v.text}</p>)}
            {frame.kind === 'text' && frame.body}
            {frame.kind === 'draw' && <div className="draw-results">{frame.results.map((r, i) => <span key={i}>{r}</span>)}</div>}
            {frame.kind === 'timer' && <div className="stage-timer"><TimerValue timer={frame} /></div>}
          </div>
        </div>}
    </div>
    {blank && <div className="absolute inset-0 bg-black" data-testid="blackout" />}
  </div>;
}
