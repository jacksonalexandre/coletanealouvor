export type Theme = "escuro" | "claro";

/** Configuração global de cores do app (controle) e da projeção. */
export type Appearance = {
  theme: Theme;
  /** Cor de destaque (botões, seleção, "no ar"). */
  accent: string;
  /** Fundo da tela de controle. */
  appBackground: string;
  /** Cor da fonte da tela de controle; os tons secundários saem dela. */
  textColor: string;
  /** Fundo da projeção quando não há vídeo/passagem, tela apagada, sorteio e cronômetro. */
  displayBackground: string;
  /** Fonte da projeção: textos do sorteio/cronômetro e o relógio. */
  displayText: string;
};

/** Fundo e fonte de cada tema; trocar o tema volta para estes dois. */
export const THEME_COLORS: Record<Theme, Pick<Appearance, "appBackground" | "textColor">> = {
  escuro: { appBackground: "#06080f", textColor: "#c7cedb" },
  claro: { appBackground: "#f8fafc", textColor: "#1e293b" },
};

export const DEFAULT_APPEARANCE: Appearance = {
  theme: "escuro",
  accent: "#2dd4bf",
  ...THEME_COLORS.escuro,
  displayBackground: "#000000",
  displayText: "#ffffff",
};

/** Cores padrão de um tema, mantendo o que não depende dele (destaque, projeção). */
export function defaultsFor(theme: Theme): Appearance {
  return { ...DEFAULT_APPEARANCE, theme, ...THEME_COLORS[theme] };
}

const HEX = /^#[0-9a-f]{6}$/i;

export function normalizeAppearance(raw: unknown): Appearance {
  const value = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const theme: Theme = value.theme === "claro" ? "claro" : "escuro";
  const base = defaultsFor(theme);
  const pick = (key: Exclude<keyof Appearance, "theme">) =>
    typeof value[key] === "string" && HEX.test(value[key]) ? value[key] : base[key];
  return {
    theme,
    accent: pick("accent"),
    appBackground: pick("appBackground"),
    textColor: pick("textColor"),
    displayBackground: pick("displayBackground"),
    displayText: pick("displayText"),
  };
}

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** Mistura `from` com `amount`% de `to`. */
const mix = (from: string, to: string, amount: number) => `color-mix(in oklab, ${from}, ${to} ${amount}%)`;

/**
 * Sobrescreve as variáveis do tema Tailwind (--color-brand-*, --color-ink-*) no
 * <html>. A escala "ink" vai do fundo (950) até a fonte (200/100), então serve
 * para os dois temas: cada tom é o fundo com um pouco mais da cor da fonte. No
 * tema escuro com as cores padrão, removemos tudo e vale a paleta original.
 */
export function applyAppearance(appearance: Appearance, root = document.documentElement) {
  const set = (name: string, value: string | null) =>
    value ? root.style.setProperty(name, value) : root.style.removeProperty(name);

  const light = appearance.theme === "claro";
  const { accent, appBackground: bg, textColor: text } = appearance;

  // No claro, o tom "400" (texto em destaque) precisa ser mais escuro para ter contraste.
  const customAccent = light || !same(accent, DEFAULT_APPEARANCE.accent);
  set("--color-brand-500", customAccent ? accent : null);
  set("--color-brand-400", customAccent ? (light ? mix(accent, "black", 30) : mix(accent, "white", 25)) : null);
  set("--color-brand-600", customAccent ? mix(accent, "black", 15) : null);

  const original = !light && same(bg, THEME_COLORS.escuro.appBackground) && same(text, THEME_COLORS.escuro.textColor);
  const shades: [string, number][] = [
    ["900", 4],
    ["800", 8],
    ["700", 14],
    ["600", 24],
    ["500", 42],
    ["400", 58],
    ["300", 80],
  ];
  set("--color-ink-950", original ? null : bg);
  for (const [shade, amount] of shades) set(`--color-ink-${shade}`, original ? null : mix(bg, text, amount));
  set("--color-ink-200", original ? null : text);
  set("--color-ink-100", original ? null : mix(text, light ? "black" : "white", 25));

  // Campos, barras de rolagem e o seletor de cor nativos acompanham o tema.
  root.style.colorScheme = light ? "light" : "dark";
  root.classList.toggle("dark", !light);

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", original ? "#0b0f19" : bg);
}
