import { useEffect, useRef, useState } from "react";
import { BibleSearch } from "@/components/BibleSearch";
import { HymnSearch } from "@/components/HymnSearch";
import { InlinePlayer } from "@/components/InlinePlayer";
import { PANEL_META } from "@/components/LayoutSettings";
import { Setlist } from "@/components/Setlist";
import { TopBar } from "@/components/TopBar";
import { Transport } from "@/components/Transport";
import { gridColumns, type PanelId } from "@/lib/layout";
import { useControlLink } from "@/lib/useLive";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";
import { useAuth } from "@/store/useAuth";

export default function Control() {
  useControlLink();
  useShortcuts();

  const loading = useApp((state) => state.loading);
  const error = useApp((state) => state.error);
  const boot = useApp((state) => state.boot);
  const preferencesVersion = useApp((state) => state.preferencesVersion);
  const startSync = useAuth((state) => state.startSync);
  const layout = useApp((state) => state.layout);
  const panels = layout.filter((panel) => panel.visible);
  const [tab, setTab] = useState<PanelId>(() => panels[0]?.id ?? "ao-vivo");
  // Aba escolhida foi ocultada: cai na primeira que sobrou.
  const current = panels.some((panel) => panel.id === tab) ? tab : (panels[0]?.id ?? "ao-vivo");
  const inlinePlayer = useApp((state) => state.inlinePlayer);
  useFollowLive(inlinePlayer, () => setTab("ao-vivo"));

  useEffect(() => {
    void boot();
  }, [boot]);

  // Com login, as preferências vão e vêm da conta; o que chega é aplicado na hora.
  useEffect(() => {
    startSync(() => void useApp.getState().reloadPreferences());
  }, [startSync]);

  if (loading) return <Splash message="Carregando o hinário…" />;
  if (error) return <Splash message={`Não foi possível carregar o hinário: ${error}`} />;

  return (
    <div className="flex h-dvh flex-col bg-ink-950">
      <TopBar />

      {/* Desktop: colunas lado a lado, na ordem e largura escolhidas. Mobile: uma aba por vez. */}
      <main
        className="grid min-h-0 flex-1 lg:grid-cols-(--columns)"
        style={{ "--columns": gridColumns(panels) } as React.CSSProperties}
      >
        {panels.map((panel, index) => {
          const active = panel.id === current;
          const last = index === panels.length - 1;
          if (panel.id === "ao-vivo") {
            // A projeção embutida continua montada nas outras abas: o som não para ao trocar de aba.
            return (
              <section
                key={panel.id}
                className={cn(
                  "min-h-0 flex-col border-ink-800",
                  !last && "lg:border-r",
                  active ? "flex" : "hidden lg:flex",
                )}
              >
                {inlinePlayer && <InlinePlayer />}
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <Transport />
                </div>
              </section>
            );
          }
          return (
            <section
              key={panel.id}
              className={cn("min-h-0 border-ink-800", !last && "lg:border-r", active ? "block" : "hidden lg:block")}
            >
              {panel.id === "hinos" && <HymnSearch />}
              {/* A ordem dos livros é lida ao montar: remonta quando chegam preferências da conta. */}
              {panel.id === "biblia" && <BibleSearch key={preferencesVersion} />}
              {panel.id === "roteiro" && <Setlist />}
            </section>
          );
        })}
      </main>

      <nav className="flex border-t border-ink-800 bg-ink-900 lg:hidden">
        {panels.map((panel) => {
          const { label, icon: Icon } = PANEL_META[panel.id];
          return (
            <TabButton
              key={panel.id}
              icon={<Icon className="size-5" />}
              label={label}
              active={panel.id === current}
              onClick={() => setTab(panel.id)}
            />
          );
        })}
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

/**
 * Tocando no aparelho, o vídeo/passagem só aparece na aba "Ao vivo". Quando algo
 * entra no ar (Tocar, Projetar, sorteio, cronômetro), vai para ela sozinho.
 */
function useFollowLive(enabled: boolean, show: () => void) {
  const showRef = useRef(show);
  showRef.current = show;

  useEffect(() => {
    if (!enabled) return;
    return useApp.subscribe((state, previous) => {
      const started =
        (state.playing && !previous.playing) ||
        (state.passage !== null && state.passage !== previous.passage && !previous.passage) ||
        (state.draw !== null && state.draw !== previous.draw) ||
        (state.countdown !== null && state.countdown !== previous.countdown);
      if (started) showRef.current();
    });
  }, [enabled]);
}

function useShortcuts() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      // Com um diálogo aberto (sorteio, configurações), espaço/setas são dele.
      if (target?.closest('[role="dialog"]')) return;

      const store = useApp.getState();
      const key = event.key.toLowerCase();

      if (event.key === " ") {
        event.preventDefault();
        store.toggle();
      } else if (event.key === "ArrowRight" || event.key === "PageDown" || key === "n") {
        if (store.passage) store.movePassageVerses(1);
        else store.stepHymn(1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp" || key === "p") {
        if (store.passage) store.movePassageVerses(-1);
        else store.stepHymn(-1);
      } else if (key === "b") {
        store.setBlank(!store.blank);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
