import type { BibleBook, Hymn, PassageRef, VideoMap } from "./types";
import type { PassageStyle } from "./passageStyle";
import { passageReference, passageVerses, moveVerse } from "./bible";

export type Content =
  | { kind: "hymn"; hymnId: number; title: string }
  | { kind: "passage"; title: string; ref: PassageRef }
  | {
      kind: "youtube";
      title: string;
      videoId: string;
      collection?: string;
      category?: string;
    }
  | { kind: "media"; title: string; assetIds: string[]; slide: number }
  | { kind: "text"; title: string; body: string }
  | {
      kind: "timer";
      title: string;
      duration: number;
      remaining: number;
      endsAt: number | null;
    }
  | { kind: "draw"; title: string; results: string[]; history?: string[];
      candidates?: string[]; animate?: boolean; startedAt?: number };

export type Frame =
  | { kind: "video"; title: string; videoId: string | null }
  | {
      kind: "passage";
      title: string;
      verses: { number: number; text: string }[];
      style: PassageStyle;
    }
  | { kind: "media"; title: string; assetId: string }
  | Extract<Content, { kind: "text" | "timer" | "draw" }>;

export const contentNames: Record<Content["kind"], string> = {
  hymn: "Hino",
  passage: "Bíblia",
  youtube: "YouTube",
  media: "Apresentação / imagem",
  text: "Texto",
  timer: "Contagem regressiva",
  draw: "Sorteio",
};

export function contentKey(item: Content): string {
  switch (item.kind) {
    case "hymn":
      return `hymn:${item.hymnId}`;
    case "passage":
      return `passage:${JSON.stringify(item.ref)}`;
    case "youtube":
      return `youtube:${item.videoId}`;
    case "media":
      return `media:${item.assetIds.join(",")}`;
    default:
      return `${item.kind}:${item.title}`;
  }
}

// Whitelist every field at the public boundary: private service notes cannot travel with a frame.
export function resolveContent(
  item: Content | null,
  books: BibleBook[],
  videos: VideoMap,
  style: PassageStyle,
): Frame | null {
  if (!item) return null;
  const title = item.title;
  switch (item.kind) {
    case "hymn":
      return {
        kind: "video",
        title,
        videoId: videos[String(item.hymnId)] ?? null,
      };
    case "youtube":
      return { kind: "video", title, videoId: item.videoId };
    case "passage":
      return {
        kind: "passage",
        title: passageReference(books, item.ref),
        verses: passageVerses(books, item.ref),
        style: { ...style },
      };
    case "media":
      return { kind: "media", title, assetId: item.assetIds[item.slide] };
    case "text":
      return { kind: "text", title, body: item.body };
    case "timer":
      return {
        kind: "timer",
        title,
        duration: item.duration,
        remaining: item.remaining,
        endsAt: item.endsAt,
      };
    case "draw":
      return { kind: "draw", title, results: [...item.results],
        history: [...(item.history ?? [])], candidates: [...(item.candidates ?? [])],
        animate: item.animate, startedAt: item.startedAt };
  }
}

export function adjacentContent(
  item: Content | null,
  delta: number,
  bible: BibleBook[],
): Content | null {
  if (item?.kind === "media") {
    const slide = item.slide + delta;
    return slide >= 0 && slide < item.assetIds.length
      ? { ...item, slide }
      : null;
  }
  if (item?.kind === "passage") {
    const ref = moveVerse(bible, item.ref, delta);
    return ref ? { ...item, ref, title: passageReference(bible, ref) } : null;
  }
  return null;
}

export const hymnContent = (hymn: Hymn): Content => ({
  kind: "hymn",
  hymnId: hymn.id,
  title: `${String(hymn.number).padStart(3, "0")} · ${hymn.title}`,
});
export const timerSeconds = (
  timer: Extract<Content, { kind: "timer" }>,
  now = Date.now(),
) =>
  timer.endsAt === null
    ? timer.remaining
    : Math.max(0, Math.ceil((timer.endsAt - now) / 1000));

export function isContent(value: unknown): value is Content {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.title !== "string") return false;
  switch (v.kind) {
    case "hymn":
      return Number.isInteger(v.hymnId);
    case "passage": {
      const ref = v.ref as PassageRef | undefined;
      return (
        !!ref &&
        typeof ref.book === "string" &&
        [ref.chapter, ref.verseStart, ref.verseEnd].every(
          (n) => Number.isInteger(n) && n > 0,
        )
      );
    }
    case "youtube":
      return typeof v.videoId === "string" && /^[\w-]{11}$/.test(v.videoId);
    case "media":
      return (
        Array.isArray(v.assetIds) &&
        v.assetIds.length > 0 &&
        v.assetIds.every((id) => typeof id === "string") &&
        Number.isInteger(v.slide) &&
        Number(v.slide) >= 0 &&
        Number(v.slide) < v.assetIds.length
      );
    case "text":
      return typeof v.body === "string";
    case "draw":
      return (
        Array.isArray(v.results) &&
        v.results.every((s) => typeof s === "string") &&
        [v.history, v.candidates].every(a => a === undefined || (Array.isArray(a) && a.every(s => typeof s === "string"))) &&
        (v.startedAt === undefined || (typeof v.startedAt === "number" && Number.isFinite(v.startedAt))) &&
        (v.animate === undefined || typeof v.animate === "boolean")
      );
    case "timer":
      return (
        typeof v.duration === "number" &&
        Number.isFinite(v.duration) &&
        v.duration > 0 &&
        typeof v.remaining === "number" &&
        Number.isFinite(v.remaining) &&
        v.remaining >= 0 &&
        (v.endsAt === null ||
          (typeof v.endsAt === "number" && Number.isFinite(v.endsAt)))
      );
    default:
      return false;
  }
}
