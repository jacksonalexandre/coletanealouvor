import { useEffect, useState } from "react";
import { ListMusic, Radio, Search } from "lucide-react";
import { LivePanel } from "@/components/LivePanel";
import { Setlist } from "@/components/Setlist";
import { SlideStrip } from "@/components/SlideStrip";
import { SongBrowser } from "@/components/SongBrowser";
import { StylePanel } from "@/components/StylePanel";
import { TopBar } from "@/components/TopBar";
import { useLiveBroadcast } from "@/lib/useLive";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";

type Tab = "buscar" | "roteiro" | "ao-vivo";

export default function Control() {
  useLiveBroadcast();
  useShortcuts();

  const loading = useApp((state) => state.loading);
  const error = useApp((state) => state.error);
  const boot = useApp((state) => state.boot);
  const title = useApp((state) => state.song(state.songId)?.title);
  const [tab, setTab] = useState<Tab>("buscar");
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    void boot();
  }, [boot]);

  if (loading) return <Splash message="Carregando acervo…" />;
  if (error) return <Splash message={`Não foi possível carregar o acervo: ${error}`} />;

  return (
    <div className="flex h-dvh flex-col bg-ink-950">
      <TopBar settingsOpen={settings} onToggleSettings={() => setSettings((open) => !open)} />

      {/* Desktop: três colunas. Mobile: uma coluna por aba. */}
      <main className="grid min-h-0 flex-1 lg:grid-cols-[320px_1fr_360px]">
        <section
          className={cn(
            "min-h-0 flex-col border-ink-800 lg:flex lg:border-r",
            tab === "buscar" ? "flex" : "hidden",
          )}
        >
          <div className="min-h-0 flex-1 lg:h-1/2">
            <SongBrowser />
          </div>
          <div className="hidden min-h-0 border-t border-ink-800 lg:block lg:h-1/2">
            <Setlist />
          </div>
        </section>

        <section
          className={cn(
            "min-h-0 flex-col lg:flex",
            tab === "roteiro" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="hidden items-baseline gap-2 border-b border-ink-800 px-4 py-2 lg:flex">
            <h2 className="truncate text-sm text-ink-200">{title ?? "Nenhuma música aberta"}</h2>
          </div>
          {/* No mobile a aba "roteiro" mostra a ordem do culto; no desktop, os slides. */}
          <div className="min-h-0 flex-1 lg:hidden">
            <Setlist />
          </div>
          <div className="hidden min-h-0 flex-1 lg:block">
            <SlideStrip />
          </div>
        </section>

        <section
          className={cn(
            "min-h-0 border-ink-800 lg:block lg:border-l",
            tab === "ao-vivo" ? "block" : "hidden lg:block",
          )}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <LivePanel />
            </div>
            {settings && <StylePanel />}
          </div>
        </section>
      </main>

      <nav className="flex border-t border-ink-800 bg-ink-900 lg:hidden">
        <TabButton icon={<Search className="size-5" />} label="Buscar" active={tab === "buscar"} onClick={() => setTab("buscar")} />
        <TabButton icon={<ListMusic className="size-5" />} label="Roteiro" active={tab === "roteiro"} onClick={() => setTab("roteiro")} />
        <TabButton icon={<Radio className="size-5" />} label="Ao vivo" active={tab === "ao-vivo"} onClick={() => setTab("ao-vivo")} />
      </nav>
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]",
        active ? "text-brand-400" : "text-ink-400",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Splash({ message }: { message: string }) {
  return (
    <div className="flex h-dvh items-center justify-center px-6 text-center text-sm text-ink-400">
      {message}
    </div>
  );
}

function useShortcuts() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      const store = useApp.getState();
      const key = event.key.toLowerCase();

      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        store.step(1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        store.step(-1);
      } else if (key === "b") {
        store.setBlank(!store.blank);
      } else if (key === "l") {
        store.setLive(!store.live);
      } else if (key === "n") {
        store.stepSong(1);
      } else if (key === "p") {
        store.stepSong(-1);
      } else if (event.key === "Home") {
        store.goTo(0);
      } else if (event.key === "End") {
        store.goTo(store.slides.length - 1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
