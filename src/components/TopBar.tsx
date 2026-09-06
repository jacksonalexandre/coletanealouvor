import { useEffect, useState } from "react";
import { MonitorPlay, MonitorX, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listScreens, openDisplayWindow, supportsScreenPlacement, type ScreenInfo } from "@/lib/screens";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";

type Props = { onToggleSettings: () => void; settingsOpen: boolean };

export function TopBar({ onToggleSettings, settingsOpen }: Props) {
  const displayOpen = useApp((state) => state.displayOpen);
  const setDisplayOpen = useApp((state) => state.setDisplayOpen);
  const screenKey = useApp((state) => state.screenKey);
  const setScreenKey = useApp((state) => state.setScreenKey);
  const [screens, setScreens] = useState<ScreenInfo[]>([]);
  const [child, setChild] = useState<Window | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!child) return;
    const timer = window.setInterval(() => {
      if (child.closed) {
        setChild(null);
        setDisplayOpen(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [child, setDisplayOpen]);

  const open = async () => {
    // A permissão de gerenciamento de janelas só é concedida dentro de um gesto
    // do usuário, por isso pedimos as telas aqui e não na carga da página.
    if (supportsScreenPlacement()) setScreens(await listScreens());
    const opened = await openDisplayWindow(screenKey);
    if (!opened) {
      setHint("O navegador bloqueou a janela. Libere pop-ups para este site.");
      return;
    }
    setHint(null);
    setChild(opened.window);
    setDisplayOpen(true);
  };

  const close = () => {
    child?.close();
    setChild(null);
    setDisplayOpen(false);
  };

  return (
    <header className="flex flex-wrap items-center gap-2 border-b border-ink-800 bg-ink-900 px-3 py-2">
      <h1 className="mr-auto text-sm font-semibold text-ink-200">
        Coletânea <span className="text-brand-400">de Louvor</span>
      </h1>

      {screens.length > 1 && (
        <select
          value={screenKey ?? ""}
          onChange={(event) => setScreenKey(event.target.value || null)}
          className="h-9 rounded-lg border border-ink-700 bg-ink-800 px-2 text-xs text-ink-200"
        >
          <option value="">Tela automática</option>
          {screens.map((screen) => (
            <option key={screen.key} value={screen.key}>
              {screen.label} · {screen.width}×{screen.height}
            </option>
          ))}
        </select>
      )}

      <span
        className={cn(
          "hidden items-center gap-1.5 text-xs sm:flex",
          displayOpen ? "text-brand-400" : "text-ink-400",
        )}
      >
        <span
          className={cn("size-2 rounded-full", displayOpen ? "bg-brand-500" : "bg-ink-600")}
        />
        {displayOpen ? "Projeção conectada" : "Projeção fechada"}
      </span>

      {displayOpen && child ? (
        <Button variant="outline" onClick={close}>
          <MonitorX className="size-4" />
          Fechar projeção
        </Button>
      ) : (
        <Button onClick={open}>
          <MonitorPlay className="size-4" />
          Abrir projeção
        </Button>
      )}

      <Button
        variant={settingsOpen ? "secondary" : "ghost"}
        size="icon"
        onClick={onToggleSettings}
        aria-label="Ajustes de exibição"
      >
        <Settings2 className="size-4" />
      </Button>

      {hint && <p className="w-full text-xs text-amber-400">{hint}</p>}
    </header>
  );
}
