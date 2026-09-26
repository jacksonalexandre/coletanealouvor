import type { Content } from "./content";
import catalog from "@/data/music/catalog.json";

// Metadata and embedded playback checked on 2026-09-26 (UTC).
// Only remote references; no audio, video, lyrics or album artwork is redistributed.
const legacyMusic: (Extract<Content, { kind: "youtube" }> & {
  publisher: string;
  source: string;
})[] = [
  {
    kind: "youtube",
    videoId: "RvXJGbnJ6jc",
    title: "Estou Aqui (Letra)",
    collection: "Adoradores 4",
    publisher: "Gravadora Novo Tempo",
    source: "https://www.youtube.com/watch?v=RvXJGbnJ6jc",
  },
  {
    kind: "youtube",
    videoId: "JD35iiN8N20",
    title: "Seja o Centro (Letra)",
    collection: "Adoradores 4",
    publisher: "Gravadora Novo Tempo",
    source: "https://www.youtube.com/watch?v=JD35iiN8N20",
  },
  {
    kind: "youtube",
    videoId: "FDlaXCsCP9U",
    title: "Levanto a Cruz (Letra)",
    collection: "Adoradores 4",
    publisher: "Gravadora Novo Tempo",
    source: "https://www.youtube.com/watch?v=FDlaXCsCP9U",
  },
  {
    kind: "youtube",
    videoId: "GsJR4rRldgo",
    title: "O Melhor Lugar do Mundo (Ao Vivo)",
    collection: "Novo Tom · seleção oficial",
    publisher: "Rede Novo Tempo de Comunicação",
    source: "https://www.youtube.com/watch?v=GsJR4rRldgo",
  },
  {
    kind: "youtube",
    videoId: "fOR2BvQGCTw",
    title: "Jader Santos · 3 horas de piano",
    collection: "Instrumentais",
    category: "Fundo / prelúdio",
    publisher: "Gravadora Novo Tempo",
    source: "https://www.youtube.com/watch?v=fOR2BvQGCTw",
  },
  {
    kind: "youtube",
    videoId: "9sJxWBf6w-s",
    title: "1 hora instrumental piano · A sós com Deus",
    collection: "Instrumentais",
    category: "Oração / reflexão",
    publisher: "Matheus Rizzo",
    source: "https://www.youtube.com/watch?v=9sJxWBf6w-s",
  },
];

export type MusicCollection = { id: string; title: string; year?: number; group: string; source: string; orderKnown: boolean };
export type MusicTrack = { id: string; title: string; collectionId: string; track?: number; tags: string[]; videoId?: string; lyrics?: boolean; availability?: string; source: string; alternateTitles?: string[]; recordingNote?: string; verification?: {title: string; publisher: string} };
export const musicCollections: MusicCollection[] = catalog.collections;
export const musicTracks: MusicTrack[] = catalog.tracks;
const collections = new Map(musicCollections.map(c => [c.id, c]));
export const trackContent = (track: MusicTrack): Extract<Content, { kind: "youtube" }> | null => track.videoId ? ({
  kind: "youtube", title: track.title, videoId: track.videoId, catalogId: track.id,
  collection: collections.get(track.collectionId)?.title,
  category: track.tags.join(" · "), track: track.track,
}) : null;
export const musicLibrary = [
  ...musicTracks.flatMap(track => { const content = trackContent(track); return content ? [content] : []; }),
  ...legacyMusic.filter(item => !musicTracks.some(t => t.videoId === item.videoId)),
];
export const musicSearchText = (track: MusicTrack) => [track.title, collections.get(track.collectionId)?.title, collections.get(track.collectionId)?.year, track.track?.toString().padStart(2,"0"), ...(track.alternateTitles??[]), ...track.tags].join(" ");
