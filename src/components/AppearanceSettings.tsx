import { Moon, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import type { Appearance, Theme } from "@/lib/appearance";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";

type ColorKey = Exclude<keyof Appearance, "theme">;
type Field = { key: ColorKey; label: string; hint: string };

const APP_FIELDS: Field[] = [
  { key: "accent", label: "Cor de destaque", hint: "Botões, seleção e indicadores" },
  { key: "appBackground", label: "Fundo do app", hint: "Tela de controle" },
  { key: "textColor", label: "Cor da fonte", hint: "Textos do app; os tons mais fracos saem dela" },
];

const DISPLAY_FIELDS: Field[] = [
  { key: "displayBackground", label: "Fundo da projeção", hint: "Sem vídeo, tela apagada, sorteio e cronômetro" },
  { key: "displayText", label: "Fonte da projeção", hint: "Textos do sorteio e do cronômetro, e o relógio" },
];

const THEMES: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: "escuro", label: "Escuro", icon: <Moon className="size-4" /> },
  { id: "claro", label: "Claro", icon: <Sun className="size-4" /> },
];

/** Engrenagem do topo: onde tocar e cores globais do app e da projeção, salvas no navegador. */
export function AppearanceSettings() {
  const appearance = useApp((state) => state.appearance);
  const setAppearance = useApp((state) => state.setAppearance);
  const resetAppearance = useApp((state) => state.resetAppearance);
  const setTheme = useApp((state) => state.setTheme);
  const inlinePlayer = useApp((state) => state.inlinePlayer);
  const setInlinePlayer = useApp((state) => state.setInlinePlayer);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Configurações gerais">
          <Settings className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent title="Configurações gerais" description="Reprodução e cores. Ficam salvas neste navegador.">
        <label className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-ink-700 bg-ink-800 p-3">
          <span className="min-w-0">
            <span className="block text-sm text-ink-200">Tocar neste aparelho</span>
            <span className="block text-xs text-ink-400">
              Sem janela de projeção: o vídeo toca na aba Ao vivo. Já vem ligado no celular.
            </span>
          </span>
          <Switch checked={inlinePlayer} onCheckedChange={setInlinePlayer} />
        </label>

        <Section title="Tema">
          <div className="flex gap-1">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium",
                  appearance.theme === theme.id
                    ? "bg-brand-600 text-ink-950"
                    : "bg-ink-800 text-ink-400 hover:text-ink-200",
                )}
              >
                {theme.icon}
                {theme.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="App">
          <ColorFields fields={APP_FIELDS} appearance={appearance} onChange={setAppearance} />
        </Section>

        <Section title="Projeção">
          <ColorFields fields={DISPLAY_FIELDS} appearance={appearance} onChange={setAppearance} />
        </Section>

        <p className="text-xs text-ink-400">
          A cor e o tamanho da letra das passagens bíblicas ficam na engrenagem da coluna Bíblia. Trocar o tema
          volta o fundo e a fonte do app para os do tema.
        </p>

        <Button variant="ghost" size="sm" className="mt-3 self-start" onClick={resetAppearance}>
          Restaurar cores padrão
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="mb-2 text-xs font-semibold tracking-wider text-ink-400 uppercase">{title}</h3>
      {children}
    </section>
  );
}

function ColorFields({
  fields,
  appearance,
  onChange,
}: {
  fields: Field[];
  appearance: Appearance;
  onChange: (patch: Partial<Appearance>) => void;
}) {
  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <label key={field.key} className="flex items-center gap-3">
          <input
            type="color"
            value={appearance[field.key]}
            onChange={(event) => onChange({ [field.key]: event.target.value })}
            className="h-10 w-14 shrink-0 cursor-pointer rounded border border-ink-700 bg-transparent"
          />
          <span className="min-w-0">
            <span className="block text-sm text-ink-200">{field.label}</span>
            <span className="block text-xs text-ink-400">{field.hint}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
