import type { Content } from "./content";
import catalog from "@/data/music/catalog.json";

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
];
export const musicSearchText = (track: MusicTrack) => [track.title, collections.get(track.collectionId)?.title, collections.get(track.collectionId)?.year, track.track?.toString().padStart(2,"0"), ...(track.alternateTitles??[]), ...track.tags].join(" ");
