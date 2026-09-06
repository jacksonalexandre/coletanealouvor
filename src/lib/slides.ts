import type { SlideStyle } from "@/lib/types";

/** Como o texto bruto do acervo vira linhas de slide. */
export type SlideMode = "phrase" | "original";

/**
 * As letras do acervo vêm com quebra de linha física (\r\n) e usam espaço duplo
 * como separador de estrofe. Normalizamos para blocos separados por linha vazia.
 */
export function toStanzas(raw: string): string[] {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]{2,}/g, "\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .split(/\n\s*\n/)
    .map((stanza) =>
      stanza
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n"),
    )
    .filter(Boolean);
}

/** Fim de frase explícito. */
const SENTENCE_END = /(?<=[.!?…])\s+/g;

/**
 * Maiúscula depois de palavra minúscula. No acervo original as maiúsculas
 * marcam o começo do verso — a quebra de linha física veio de um wrap de
 * largura fixa do app desktop e não corresponde à frase cantada.
 */
const VERSE_START = /(?<=[a-záàâãéêíóôõúüçñ,])\s+(?=[A-ZÁÀÂÃÉÊÍÓÔÕÚÜÇÑ])/g;

/** Quebra uma linha comprida em pedaços de no máximo `width` caracteres. */
function wrap(line: string, width: number): string[] {
  if (line.length <= width) return [line];
  const out: string[] = [];
  let current = "";
  for (const word of line.split(" ")) {
    if (current && `${current} ${word}`.length > width) {
      out.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) out.push(current);
  return out;
}

/** Menor tamanho aceitável de verso, em caracteres. */
const MIN_VERSE = 12;

/**
 * Junta fragmentos curtos ao verso seguinte. Em letras com muita inicial
 * maiúscula ("Grande Luz Nosso Sol é Jesus") a regra de maiúscula quebraria
 * palavra por palavra; aqui isso volta a virar um verso só.
 */
function mergeShort(segments: string[], width: number): string[] {
  const out: string[] = [];
  let current = "";

  for (const segment of segments) {
    if (!current) {
      current = segment;
      continue;
    }
    const joined = `${current} ${segment}`;
    const short = current.length < MIN_VERSE || segment.length < MIN_VERSE;
    if (short && joined.length <= width) {
      current = joined;
      continue;
    }
    out.push(current);
    current = segment;
  }

  if (current) {
    // Sobra curta no fim gruda no verso anterior, se couber.
    const last = out[out.length - 1];
    if (last && current.length < MIN_VERSE && `${last} ${current}`.length <= width) {
      out[out.length - 1] = `${last} ${current}`;
    } else {
      out.push(current);
    }
  }

  return out;
}

/** Reconstrói os versos de uma estrofe a partir do texto corrido. */
export function toVerses(stanza: string, width: number): string[] {
  const segments = stanza
    .split("\n")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(SENTENCE_END, "\n")
    .replace(VERSE_START, "\n")
    .split("\n")
    .map((verse) => verse.trim())
    .filter(Boolean);

  return mergeShort(segments, width).flatMap((verse) => wrap(verse, width));
}

export type SlideOptions = {
  maxLines?: number;
  mode?: SlideMode;
  /** Largura alvo da linha, em caracteres. */
  width?: number;
};

/** Quebra a letra em slides com no máximo `maxLines` linhas. */
export function buildSlides(raw: string, options: SlideOptions = {}): string[] {
  const { maxLines = 4, mode = "phrase", width = 46 } = options;
  const slides: string[] = [];

  for (const stanza of toStanzas(raw)) {
    const lines =
      mode === "phrase"
        ? toVerses(stanza, width)
        : stanza.split("\n").flatMap((line) => wrap(line, width));

    if (lines.length <= maxLines) {
      slides.push(lines.join("\n"));
      continue;
    }
    // Distribui em partes equilibradas em vez de deixar uma linha solta no fim.
    const parts = Math.ceil(lines.length / maxLines);
    const size = Math.ceil(lines.length / parts);
    for (let i = 0; i < lines.length; i += size) {
      slides.push(lines.slice(i, i + size).join("\n"));
    }
  }

  return slides.length > 0 ? slides : [""];
}

export const defaultStyle: SlideStyle = {
  fontScale: 1,
  uppercase: false,
  align: "center",
  showTitle: true,
  background: "deep",
};
