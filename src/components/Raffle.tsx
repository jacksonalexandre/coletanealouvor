import { useMemo, useState } from "react";
import { Dices, Hash, MonitorX, RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { drawName, drawNumber, parseNames } from "@/lib/draw";
import { local } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";
import type { DrawResult } from "@/lib/types";

type Mode = "numero" | "nome";

type RaffleConfig = {
  mode: Mode;
  min: number;
  max: number;
  names: string;
  noRepeat: boolean;
  project: boolean;
};

const DEFAULT_CONFIG: RaffleConfig = { mode: "numero", min: 1, max: 50, names: "", noRepeat: true, project: true };

/** Sorteio de número (intervalo) ou de nome (uma linha por nome), com opção de projetar. */
export function Raffle() {
  const draw = useApp((state) => state.draw);
  const closeDraw = useApp((state) => state.closeDraw);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={draw ? "secondary" : "ghost"} size="icon" title="Sorteio">
          <Dices className={cn("size-4", draw && "text-brand-400")} />
        </Button>
      </DialogTrigger>
      <DialogContent title="Sorteio" description="Número em um intervalo ou nome de uma lista.">
        <RaffleForm />
        {draw && (
          <Button variant="outline" size="sm" className="mt-3" onClick={closeDraw}>
            <MonitorX className="size-4" />
            Tirar sorteio da projeção
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RaffleForm() {
  const showDraw = useApp((state) => state.showDraw);
  const closeDraw = useApp((state) => state.closeDraw);
  const [config, setConfigState] = useState<RaffleConfig>(() => ({
    ...DEFAULT_CONFIG,
    ...local.get<Partial<RaffleConfig>>("raffle", {}),
  }));
  // Já sorteados, por modo; zera ao mudar o intervalo/lista ou em "Recomeçar".
  const [drawn, setDrawn] = useState<Record<Mode, string[]>>({ numero: [], nome: [] });
  const [result, setResult] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const setConfig = (patch: Partial<RaffleConfig>) => {
    const next = { ...config, ...patch };
    local.set("raffle", next);
    setConfigState(next);
    setMessage(null);
  };

  const names = useMemo(() => parseNames(config.names), [config.names]);
  const history = drawn[config.mode];
  const rangeValid = Number.isInteger(config.min) && Number.isInteger(config.max) && config.min <= config.max;

  const resetDrawn = (mode: Mode = config.mode) => {
    setDrawn((current) => ({ ...current, [mode]: [] }));
    setResult(null);
    setMessage(null);
  };

  const run = () => {
    const exclude = new Set(config.noRepeat ? history : []);
    let outcome: DrawResult | null = null;

    if (config.mode === "numero") {
      if (!rangeValid) return setMessage("O número final precisa ser maior ou igual ao inicial.");
      const value = drawNumber(config.min, config.max, exclude);
      if (value === null) return setMessage("Todos os números do intervalo já foram sorteados.");
      outcome = { kind: "number", value: String(value), min: config.min, max: config.max };
    } else {
      if (!names.length) return setMessage("Digite pelo menos um nome (um por linha).");
      const value = drawName(names, exclude);
      if (value === null) return setMessage("Todos os nomes já foram sorteados.");
      outcome = { kind: "name", value, names };
    }

    setMessage(null);
    setResult(outcome.value);
    setDrawn((current) => ({ ...current, [config.mode]: [...current[config.mode], outcome.value] }));
    if (config.project) void showDraw(outcome);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        <ModeButton
          icon={<Hash className="size-3.5" />}
          label="Número"
          active={config.mode === "numero"}
          onClick={() => {
            setConfig({ mode: "numero" });
            setResult(null);
          }}
        />
        <ModeButton
          icon={<Users className="size-3.5" />}
          label="Nome"
          active={config.mode === "nome"}
          onClick={() => {
            setConfig({ mode: "nome" });
            setResult(null);
          }}
        />
      </div>

      {config.mode === "numero" ? (
        <div className="flex gap-3">
          <NumberField
            label="Número inicial"
            value={config.min}
            onChange={(min) => {
              setConfig({ min });
              resetDrawn("numero");
            }}
          />
          <NumberField
            label="Número final"
            value={config.max}
            onChange={(max) => {
              setConfig({ max });
              resetDrawn("numero");
            }}
          />
        </div>
      ) : (
        <div>
          <label className="mb-1 flex justify-between text-xs text-ink-400">
            <span>Nomes (um por linha)</span>
            <span className="tabular-nums">{names.length}</span>
          </label>
          <textarea
            value={config.names}
            onChange={(event) => {
              setConfig({ names: event.target.value });
              resetDrawn("nome");
            }}
            rows={6}
            placeholder={"Maria\nJoão\nAna"}
            className="w-full resize-y rounded-lg border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-200 placeholder:text-ink-400 focus-visible:border-brand-600 focus-visible:outline-none"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="flex items-center justify-between gap-3 text-sm text-ink-200">
          Não repetir
          <Switch checked={config.noRepeat} onCheckedChange={(noRepeat) => setConfig({ noRepeat })} />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm text-ink-200">
          Mostrar na projeção
          <Switch
            checked={config.project}
            onCheckedChange={(project) => {
              setConfig({ project });
              if (!project) closeDraw();
            }}
          />
        </label>
      </div>

      <Button size="lg" className="w-full" onClick={run}>
        <Dices className="size-5" />
        Sortear
      </Button>

      {message && <p className="text-xs text-amber-400">{message}</p>}

      {result && (
        <div className="rounded-lg border border-ink-700 bg-ink-800 p-4 text-center">
          <p className="text-xs tracking-widest text-ink-400 uppercase">Sorteado</p>
          <p className="mt-1 text-4xl font-bold break-words text-brand-400 tabular-nums">{result}</p>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-ink-400">
            <span>Já sorteados ({history.length})</span>
            <button onClick={() => resetDrawn()} className="flex items-center gap-1 hover:text-ink-200">
              <RotateCcw className="size-3" />
              Recomeçar
            </button>
          </div>
          <p className="text-sm break-words text-ink-200">{history.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="flex-1">
      <span className="mb-1 block text-xs text-ink-400">{label}</span>
      <Input
        type="number"
        inputMode="numeric"
        step={1}
        value={Number.isFinite(value) ? value : ""}
        onChange={(event) => onChange(event.target.value === "" ? NaN : Math.trunc(Number(event.target.value)))}
      />
    </label>
  );
}

function ModeButton({
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
        "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium",
        active ? "bg-ink-700 text-ink-200" : "bg-ink-800 text-ink-400 hover:text-ink-200",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
