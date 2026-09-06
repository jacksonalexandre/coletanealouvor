import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";
import type { SlideStyle } from "@/lib/types";

const backgrounds: { value: SlideStyle["background"]; label: string }[] = [
  { value: "black", label: "Preto" },
  { value: "deep", label: "Escuro" },
  { value: "gradient", label: "Degradê" },
];

export function StylePanel() {
  const style = useApp((state) => state.style);
  const setStyle = useApp((state) => state.setStyle);
  const maxLines = useApp((state) => state.maxLines);
  const setMaxLines = useApp((state) => state.setMaxLines);
  const slideMode = useApp((state) => state.slideMode);
  const setSlideMode = useApp((state) => state.setSlideMode);

  return (
    <div className="space-y-5 border-t border-ink-800 bg-ink-900 p-4 text-sm">
      <Field label={`Tamanho do texto · ${Math.round(style.fontScale * 100)}%`}>
        <Slider
          value={[style.fontScale]}
          min={0.5}
          max={1.5}
          step={0.05}
          onValueChange={([value]) => setStyle({ fontScale: value })}
        />
      </Field>

      <Field label={`Linhas por slide · ${maxLines}`}>
        <Slider
          value={[maxLines]}
          min={2}
          max={8}
          step={1}
          onValueChange={([value]) => setMaxLines(value)}
        />
      </Field>

      <Field label="Quebra das linhas">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={slideMode === "phrase" ? "secondary" : "outline"}
            onClick={() => setSlideMode("phrase")}
          >
            Por frase
          </Button>
          <Button
            size="sm"
            variant={slideMode === "original" ? "secondary" : "outline"}
            onClick={() => setSlideMode("original")}
          >
            Original
          </Button>
        </div>
        <p className="text-xs text-ink-400">
          &ldquo;Por frase&rdquo; reagrupa os versos do acervo, que vêm quebrados na largura da tela
          antiga.
        </p>
      </Field>

      <Field label="Fundo">
        <div className="flex gap-2">
          {backgrounds.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={style.background === option.value ? "secondary" : "outline"}
              onClick={() => setStyle({ background: option.value })}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Field>

      <Field label="Alinhamento">
        <div className="flex gap-2">
          {(["center", "left"] as const).map((align) => (
            <Button
              key={align}
              size="sm"
              variant={style.align === align ? "secondary" : "outline"}
              onClick={() => setStyle({ align })}
            >
              {align === "center" ? "Centro" : "Esquerda"}
            </Button>
          ))}
        </div>
      </Field>

      <Toggle
        label="Tudo em maiúsculas"
        checked={style.uppercase}
        onChange={(uppercase) => setStyle({ uppercase })}
      />
      <Toggle
        label="Mostrar título no rodapé"
        checked={style.showTitle}
        onChange={(showTitle) => setStyle({ showTitle })}
      />

      <p className="pt-1 text-xs leading-relaxed text-ink-400">
        Atalhos: <Key>→</Key> / <Key>espaço</Key> avança, <Key>←</Key> volta, <Key>B</Key> apaga a tela,{" "}
        <Key>L</Key> coloca no ar, <Key>N</Key> / <Key>P</Key> troca de música.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs tracking-wide text-ink-400 uppercase">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-200">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className={cn("rounded border border-ink-700 bg-ink-800 px-1 text-[10px] text-ink-200")}>
      {children}
    </kbd>
  );
}
