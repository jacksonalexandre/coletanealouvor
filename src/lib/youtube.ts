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

export const thumbnailUrl = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

export const watchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;
