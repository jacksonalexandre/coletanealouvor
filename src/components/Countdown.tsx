import { useState } from "react";
import { MonitorX, Play, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatClock, formatRemaining, nextOccurrence, toTimeInput, useNow } from "@/lib/countdown";
import { local } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";

const PRESETS = [5, 10, 15, 30];

/** Cronômetro regressivo até um horário final, projetado com o relógio pequeno embaixo. */
export function Countdown() {
  const countdown = useApp((state) => state.countdown);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={countdown ? "secondary" : "ghost"} size="icon" title="Cronômetro">
          <Timer className={cn("size-4", countdown && "text-brand-400")} />
        </Button>
      </DialogTrigger>
      <DialogContent title="Cronômetro" description="Contagem regressiva até um horário, com o relógio embaixo.">
        <CountdownForm />
      </DialogContent>
    </Dialog>
  );
}

function CountdownForm() {
  const countdown = useApp((state) => state.countdown);
  const showCountdown = useApp((state) => state.showCountdown);
  const closeCountdown = useApp((state) => state.closeCountdown);
  const now = useNow();

  const [label, setLabelState] = useState(() => local.get("countdownLabel", ""));
  // Horário final exato: os atalhos (+5 min…) guardam os segundos; o campo mostra só HH:MM.
  const [endsAt, setEndsAt] = useState<number | null>(() => {
    if (countdown) return countdown.endsAt;
    const saved = nextOccurrence(local.get("countdownTime", ""));
    return (saved ?? new Date(Date.now() + 10 * 60_000)).getTime();
  });

  const setLabel = (value: string) => {
    setLabelState(value);
    local.set("countdownLabel", value);
  };

  const setTime = (value: string) => {
    local.set("countdownTime", value);
    setEndsAt(nextOccurrence(value)?.getTime() ?? null);
  };

  const addMinutes = (minutes: number) => {
    const target = Date.now() + minutes * 60_000;
    local.set("countdownTime", toTimeInput(new Date(target)));
    setEndsAt(target);
  };

  const remaining = endsAt === null ? null : endsAt - now.getTime();
  const tomorrow = endsAt !== null && new Date(endsAt).getDate() !== now.getDate();
  const live = countdown !== null;
  const liveChanged = live && (countdown.endsAt !== endsAt || countdown.label !== label.trim());

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-ink-400" htmlFor="countdown-time">
          Horário final
        </label>
        <Input
          id="countdown-time"
          type="time"
          value={endsAt === null ? "" : toTimeInput(new Date(endsAt))}
          onChange={(event) => setTime(event.target.value)}
          className="text-lg tabular-nums"
        />
        <div className="mt-2 flex gap-1">
          {PRESETS.map((minutes) => (
            <button
              key={minutes}
              onClick={() => addMinutes(minutes)}
              className="flex-1 rounded-lg bg-ink-800 py-1.5 text-xs font-medium text-ink-400 hover:text-ink-200"
            >
              +{minutes} min
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-ink-400" htmlFor="countdown-label">
          Texto acima do contador (opcional)
        </label>
        <Input
          id="countdown-label"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Ex: O culto começa em"
        />
      </div>

      <div className="rounded-lg border border-ink-700 bg-ink-800 p-4 text-center">
        <p className="text-xs tracking-widest text-ink-400 uppercase">
          {live && !liveChanged ? "No ar" : "Faltam"}
          {tomorrow && " · amanhã"}
        </p>
        <p className="mt-1 text-4xl font-bold text-brand-400 tabular-nums">
          {remaining === null ? "--:--" : formatRemaining(remaining)}
        </p>
        <p className="mt-1 text-xs text-ink-400 tabular-nums">Agora {formatClock(now)}</p>
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={endsAt === null || (live && !liveChanged)}
        onClick={() => endsAt !== null && void showCountdown({ endsAt, label: label.trim() })}
      >
        <Play className="size-5" />
        {live ? "Atualizar na projeção" : "Iniciar na projeção"}
      </Button>

      {live && (
        <Button variant="outline" size="sm" className="w-full" onClick={closeCountdown}>
          <MonitorX className="size-4" />
          Tirar cronômetro da projeção
        </Button>
      )}
    </div>
  );
}
