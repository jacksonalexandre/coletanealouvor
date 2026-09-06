import { create } from "zustand";
import { buildSlides, defaultStyle, type SlideMode } from "@/lib/slides";
import { loadCatalog, loadLyrics, local } from "@/lib/storage";
import type { Catalog, SetlistItem, SlideStyle, Song } from "@/lib/types";

type State = {
  catalog: Catalog | null;
  lyrics: Record<string, string>;
  loading: boolean;
  error: string | null;

  setlist: SetlistItem[];
  activeUid: string | null;

  songId: number | null;
  slides: string[];
  slideIndex: number;
  blank: boolean;
  live: boolean;

  maxLines: number;
  slideMode: SlideMode;
  style: SlideStyle;
  screenKey: string | null;
  displayOpen: boolean;
};

type Actions = {
  boot: () => Promise<void>;
  song: (id: number | null) => Song | null;
  lyricOf: (id: number) => string;

  openSong: (id: number, uid?: string | null) => void;
  addToSetlist: (id: number) => void;
  removeFromSetlist: (uid: string) => void;
  reorderSetlist: (items: SetlistItem[]) => void;
  clearSetlist: () => void;
  stepSong: (delta: number) => void;

  goTo: (index: number) => void;
  step: (delta: number) => void;
  setBlank: (blank: boolean) => void;
  setLive: (live: boolean) => void;
  setStyle: (patch: Partial<SlideStyle>) => void;
  setMaxLines: (lines: number) => void;
  setSlideMode: (mode: SlideMode) => void;
  setScreenKey: (key: string | null) => void;
  setDisplayOpen: (open: boolean) => void;
  rebuild: () => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const useApp = create<State & Actions>((set, get) => ({
  catalog: null,
  lyrics: {},
  loading: true,
  error: null,

  setlist: local.get<SetlistItem[]>("setlist", []),
  activeUid: null,

  songId: null,
  slides: [],
  slideIndex: 0,
  blank: false,
  live: false,

  maxLines: local.get("maxLines", 4),
  slideMode: local.get<SlideMode>("slideMode", "phrase"),
  style: { ...defaultStyle, ...local.get<Partial<SlideStyle>>("style", {}) },
  screenKey: local.get<string | null>("screenKey", null),
  displayOpen: false,

  async boot() {
    try {
      const [catalog, lyrics] = await Promise.all([
        loadCatalog((fresh) => set({ catalog: fresh })),
        loadLyrics(),
      ]);
      set({ catalog, lyrics, loading: false });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : "Falha ao carregar o acervo" });
    }
  },

  song(id) {
    if (id == null) return null;
    return get().catalog?.songs.find((song) => song.id === id) ?? null;
  },

  lyricOf(id) {
    return get().lyrics[String(id)] ?? "";
  },

  openSong(id, itemUid = null) {
    const slides = buildSlides(get().lyricOf(id), {
      maxLines: get().maxLines,
      mode: get().slideMode,
    });
    set({ songId: id, slides, slideIndex: 0, blank: false, activeUid: itemUid });
  },

  addToSetlist(id) {
    const setlist = [...get().setlist, { uid: uid(), songId: id }];
    local.set("setlist", setlist);
    set({ setlist });
  },

  removeFromSetlist(itemUid) {
    const setlist = get().setlist.filter((item) => item.uid !== itemUid);
    local.set("setlist", setlist);
    set({ setlist, activeUid: get().activeUid === itemUid ? null : get().activeUid });
  },

  reorderSetlist(items) {
    local.set("setlist", items);
    set({ setlist: items });
  },

  clearSetlist() {
    local.set("setlist", []);
    set({ setlist: [], activeUid: null });
  },

  stepSong(delta) {
    const { setlist, activeUid } = get();
    if (setlist.length === 0) return;
    const current = setlist.findIndex((item) => item.uid === activeUid);
    const next = setlist[Math.min(Math.max(current + delta, 0), setlist.length - 1)];
    if (!next || next.uid === activeUid) return;
    get().openSong(next.songId, next.uid);
  },

  goTo(index) {
    const { slides } = get();
    set({ slideIndex: Math.min(Math.max(index, 0), Math.max(slides.length - 1, 0)), blank: false });
  },

  step(delta) {
    const { slideIndex, slides, setlist, activeUid } = get();
    const target = slideIndex + delta;
    if (target >= 0 && target < slides.length) {
      set({ slideIndex: target, blank: false });
      return;
    }
    // Passou do fim (ou do início): encadeia com a música vizinha do roteiro.
    if (setlist.length === 0 || activeUid == null) return;
    const current = setlist.findIndex((item) => item.uid === activeUid);
    const neighbour = setlist[current + Math.sign(delta)];
    if (!neighbour) return;
    get().openSong(neighbour.songId, neighbour.uid);
    if (delta < 0) {
      const slidesOfPrevious = get().slides;
      set({ slideIndex: Math.max(slidesOfPrevious.length - 1, 0) });
    }
  },

  setBlank(blank) {
    set({ blank });
  },

  setLive(live) {
    set({ live });
  },

  setStyle(patch) {
    const style = { ...get().style, ...patch };
    local.set("style", style);
    set({ style });
  },

  setMaxLines(lines) {
    local.set("maxLines", lines);
    set({ maxLines: lines });
    get().rebuild();
  },

  setSlideMode(mode) {
    local.set("slideMode", mode);
    set({ slideMode: mode });
    get().rebuild();
  },

  /** Recalcula os slides da música aberta mantendo a posição aproximada. */
  rebuild() {
    const { songId, maxLines, slideMode, slideIndex } = get();
    if (songId == null) return;
    const slides = buildSlides(get().lyricOf(songId), { maxLines, mode: slideMode });
    set({ slides, slideIndex: Math.min(slideIndex, slides.length - 1) });
  },

  setScreenKey(key) {
    local.set("screenKey", key);
    set({ screenKey: key });
  },

  setDisplayOpen(open) {
    set({ displayOpen: open });
  },
}));
