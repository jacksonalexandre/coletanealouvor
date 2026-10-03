import { BookOpen, ChevronDown, ChevronUp, Columns3, ListMusic, Radio, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { gridColumns, LOCKED_PANELS, type PanelId, type PanelSize } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";

export const PANEL_META: Record<PanelId, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  hinos: { label: "Hinos", icon: Search },
  biblia: { label: "Bíblia", icon: BookOpen },
  roteiro: { label: "Programação", icon: ListMusic },
  "ao-vivo": { label: "Ao vivo", icon: Radio },
};

const SIZES: { id: PanelSize; label: string }[] = [
  { id: "estreita", label: "Estreita" },
  { id: "media", label: "Média" },
  { id: "larga", label: "Larga" },
];

/** Botão do topo: escolhe quais colunas aparecem, a ordem e a largura de cada uma. */
export function LayoutSettings() {
  const layout = useApp((state) => state.layout);
  const setLayout = useApp((state) => state.setLayout);
  const resetLayout = useApp((state) => state.resetLayout);
  const visible = layout.filter((panel) => panel.visible);

  const update = (id: PanelId, patch: { visible?: boolean; size?: PanelSize }) =>
    setLayout(layout.map((panel) => (panel.id === id ? { ...panel, ...patch } : panel)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= layout.length) return;
    const next = [...layout];
    [next[index], next[target]] = [next[target], next[index]];
    setLayout(next);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Organizar colunas">
          <Columns3 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Organizar colunas"
        description="Escolha o que aparece, em que ordem e com que largura. No celular, vale para as abas."
      >
        {/* Prévia: as colunas como vão ficar no computador. */}
        <div
          className="mb-4 grid h-16 gap-1 rounded-lg border border-ink-700 bg-ink-950 p-1"
          style={{ gridTemplateColumns: gridColumns(visible) }}
        >
          {visible.map((panel) => {
            const { label, icon: Icon } = PANEL_META[panel.id];
            return (
              <div
                key={panel.id}
                className="flex min-w-0 flex-col items-center justify-center gap-1 rounded bg-ink-800 text-ink-400"
              >
                <Icon className="size-4 shrink-0" />
                <span className="w-full truncate px-1 text-center text-[10px]">{label}</span>
              </div>
            );
          })}
        </div>

        <ul className="space-y-2">
          {layout.map((panel, index) => {
            const { label, icon: Icon } = PANEL_META[panel.id];
            const locked = LOCKED_PANELS.has(panel.id);
            return (
              <li
                key={panel.id}
                className={cn(
                  "rounded-lg border border-ink-700 bg-ink-800 p-2",
                  !panel.visible && "opacity-60",
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      title="Mover para a esquerda / acima"
                      className="rounded p-0.5 text-ink-400 hover:text-ink-200 disabled:opacity-30"
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === layout.length - 1}
                      title="Mover para a direita / abaixo"
                      className="rounded p-0.5 text-ink-400 hover:text-ink-200 disabled:opacity-30"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                  </div>
                  <Icon className="size-4 shrink-0 text-ink-400" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-ink-200">{label}</span>
                    {locked && <span className="block text-xs text-ink-400">Sempre visível: tem os comandos</span>}
                  </span>
                  <Switch
                    checked={panel.visible}
                    disabled={locked}
                    onCheckedChange={(checked) => update(panel.id, { visible: checked })}
                    title={panel.visible ? "Ocultar" : "Mostrar"}
                  />
                </div>

                {/* Largura só importa no computador, onde as colunas ficam lado a lado. */}
                {panel.visible && (
                  <div className="mt-2 hidden gap-1 pl-7 lg:flex">
                    {SIZES.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => update(panel.id, { size: size.id })}
                        className={cn(
                          "flex-1 rounded-md py-1 text-xs font-medium",
                          panel.size === size.id
                            ? "bg-brand-600 text-ink-950"
                            : "bg-ink-900 text-ink-400 hover:text-ink-200",
                        )}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-xs text-ink-400">
          Colunas largas dividem o espaço que sobra; estreita e média têm tamanho fixo.
        </p>

        <Button variant="ghost" size="sm" className="mt-3 self-start" onClick={resetLayout}>
          Restaurar colunas padrão
        </Button>
      </DialogContent>
    </Dialog>
  );
}
