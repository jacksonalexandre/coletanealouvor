import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Appearance } from "@/lib/appearance";
import { useApp } from "@/store/useApp";

const FIELDS: { key: keyof Appearance; label: string; hint: string }[] = [
  { key: "accent", label: "Cor de destaque", hint: "Botões, seleção e indicadores" },
  { key: "appBackground", label: "Fundo do app", hint: "Tela de controle" },
  { key: "displayBackground", label: "Fundo da projeção", hint: "Tela sem vídeo, tela apagada e sorteio" },
];

/** Engrenagem do topo: cores globais do app e da projeção, salvas no navegador. */
export function AppearanceSettings() {
  const appearance = useApp((state) => state.appearance);
  const setAppearance = useApp((state) => state.setAppearance);
  const resetAppearance = useApp((state) => state.resetAppearance);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Configurações gerais">
          <Settings className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent title="Configurações gerais" description="Cores do app e da projeção. Ficam salvas neste navegador.">
        <div className="space-y-3">
          {FIELDS.map((field) => (
            <label key={field.key} className="flex items-center gap-3">
              <input
                type="color"
                value={appearance[field.key]}
                onChange={(event) => setAppearance({ [field.key]: event.target.value })}
                className="h-10 w-14 shrink-0 cursor-pointer rounded border border-ink-700 bg-transparent"
              />
              <span className="min-w-0">
                <span className="block text-sm text-ink-200">{field.label}</span>
                <span className="block text-xs text-ink-400">{field.hint}</span>
              </span>
            </label>
          ))}
        </div>

        <p className="mt-4 text-xs text-ink-400">
          A cor e o tamanho da letra das passagens bíblicas ficam na engrenagem da coluna Bíblia.
        </p>

        <Button variant="ghost" size="sm" className="mt-3 self-start" onClick={resetAppearance}>
          Restaurar cores padrão
        </Button>
      </DialogContent>
    </Dialog>
  );
}
