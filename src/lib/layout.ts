/**
 * Colunas da tela de controle: quais aparecem, em que ordem e com que largura.
 * No celular vira a ordem e a lista das abas de baixo.
 */
export type PanelId = "hinos" | "biblia" | "roteiro" | "ao-vivo";
export type PanelSize = "estreita" | "media" | "larga";
export type LayoutPanel = { id: PanelId; visible: boolean; size: PanelSize };
export type Layout = LayoutPanel[];

export const PANEL_IDS: PanelId[] = ["hinos", "biblia", "roteiro", "ao-vivo"];

/** "Ao vivo" tem os comandos e, tocando no aparelho, o próprio vídeo: não dá para ocultar. */
export const LOCKED_PANELS = new Set<PanelId>(["ao-vivo"]);

export const DEFAULT_LAYOUT: Layout = [
  { id: "hinos", visible: true, size: "larga" },
  { id: "biblia", visible: true, size: "larga" },
  { id: "roteiro", visible: true, size: "estreita" },
  { id: "ao-vivo", visible: true, size: "media" },
];

const SIZES: PanelSize[] = ["estreita", "media", "larga"];
const WIDTH: Record<Exclude<PanelSize, "larga">, number> = { estreita: 280, media: 360 };

/** Aceita o que estiver salvo, completando colunas que faltem e descartando lixo. */
export function normalizeLayout(raw: unknown): Layout {
  if (!Array.isArray(raw)) return DEFAULT_LAYOUT;
  const seen = new Set<PanelId>();
  const panels: Layout = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { id, visible, size } = item as Partial<LayoutPanel>;
    if (!id || !PANEL_IDS.includes(id) || seen.has(id)) continue;
    seen.add(id);
    panels.push({
      id,
      visible: LOCKED_PANELS.has(id) || visible !== false,
      size: size && SIZES.includes(size) ? size : DEFAULT_LAYOUT.find((panel) => panel.id === id)!.size,
    });
  }
  for (const panel of DEFAULT_LAYOUT) if (!seen.has(panel.id)) panels.push(panel);
  return panels;
}

/**
 * Colunas do grid no desktop. "Larga" divide o que sobra; as outras têm largura
 * fixa. Sem nenhuma larga visível, todas crescem na proporção das larguras, para
 * não sobrar espaço vazio.
 */
export function gridColumns(panels: LayoutPanel[]) {
  const hasWide = panels.some((panel) => panel.size === "larga");
  return panels
    .map((panel) => {
      if (panel.size === "larga") return "minmax(0,1fr)";
      const width = WIDTH[panel.size];
      return hasWide ? `${width}px` : `minmax(0,${width}fr)`;
    })
    .join(" ");
}
