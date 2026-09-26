/** Configuração global de cores: destaque, fundo do app (controle) e fundo da projeção. */
export type Appearance = {
  /** Cor de destaque (botões, seleção, "no ar"). */
  accent: string;
  /** Fundo da tela de controle. */
  appBackground: string;
  /** Fundo da projeção quando não há vídeo/passagem, tela apagada e sorteio. */
  displayBackground: string;
};

export const DEFAULT_APPEARANCE: Appearance = {
  accent: "#2dd4bf",
  appBackground: "#06080f",
  displayBackground: "#000000",
};

const HEX = /^#[0-9a-f]{6}$/i;

export function normalizeAppearance(raw: unknown): Appearance {
  const value = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pick = (key: keyof Appearance) =>
    typeof value[key] === "string" && HEX.test(value[key]) ? value[key] : DEFAULT_APPEARANCE[key];
  return {
    accent: pick("accent"),
    appBackground: pick("appBackground"),
    displayBackground: pick("displayBackground"),
  };
}

/**
 * Sobrescreve as variáveis do tema Tailwind (--color-brand-*, --color-ink-9xx) no
 * <html>. Com o valor padrão, removemos a sobrescrita e vale o tema original.
 */
export function applyAppearance(appearance: Appearance, root = document.documentElement) {
  const set = (name: string, value: string | null) =>
    value ? root.style.setProperty(name, value) : root.style.removeProperty(name);

  const accent = appearance.accent.toLowerCase() === DEFAULT_APPEARANCE.accent ? null : appearance.accent;
  set("--color-brand-500", accent);
  set("--color-brand-400", accent && `color-mix(in oklab, ${accent} 75%, white)`);
  set("--color-brand-600", accent && `color-mix(in oklab, ${accent} 85%, black)`);

  const background =
    appearance.appBackground.toLowerCase() === DEFAULT_APPEARANCE.appBackground ? null : appearance.appBackground;
  set("--color-ink-950", background);
  // Cabeçalho, campos, bordas e botões acompanham o fundo, em tons mais claros.
  set("--color-ink-900", background && `color-mix(in oklab, ${background} 96%, white)`);
  set("--color-ink-800", background && `color-mix(in oklab, ${background} 92%, white)`);
  set("--color-ink-700", background && `color-mix(in oklab, ${background} 86%, white)`);
  set("--color-ink-600", background && `color-mix(in oklab, ${background} 78%, white)`);

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", background ?? "#0b0f19");
}
