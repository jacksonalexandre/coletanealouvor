/** Aceita link completo, link curto, link de playlist ou o id cru. */
export function parseVideoId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (/^[\w-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1);
      return /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && /^[\w-]{11}$/.test(fromQuery)) return fromQuery;
      const match = url.pathname.match(/\/(embed|shorts|live|v)\/([\w-]{11})/);
      if (match) return match[2];
    }
  } catch {
    // Não era URL; já tentamos o id cru acima.
  }
  return null;
}

/** Link parece ser do YouTube (para não confundir texto comum de 11 letras com um id). */
export const looksLikeYouTube = (input: string) => /youtu\.?be/i.test(input);

/**
 * Título do vídeo pelo oEmbed público do YouTube. Melhor esforço: offline ou
 * bloqueado, volta null e o operador digita o título.
 */
export async function fetchVideoTitle(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl(videoId))}`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { title?: unknown };
    return typeof data.title === "string" && data.title.trim() ? data.title.trim() : null;
  } catch {
    return null;
  }
}

export const DEFAULT_VIDEO_TITLE = "Vídeo do YouTube";

export const thumbnailUrl = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

export const watchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
