import { create } from "zustand";
import {
  type Appearance,
  applyAppearance,
  DEFAULT_APPEARANCE,
  defaultsFor,
  normalizeAppearance,
  type Theme,
  THEME_COLORS,
} from "@/lib/appearance";
import { clampPassage, findBook } from "@/lib/bible";
import { type BibleVersionId, DEFAULT_BIBLE_VERSION, isBibleVersion } from "@/lib/bibleVersions";
import { DEFAULT_PASSAGE_STYLE, type PassageStyle } from "@/lib/passageStyle";
import { openDisplayWindow } from "@/lib/screens";
import { loadBible, loadHymnal, loadVideoMap, local } from "@/lib/storage";
import { parseVideoId } from "@/lib/youtube";
import type {
  BibleBook,
  DrawResult,
  Hymn,
  LiveCountdown,
  LiveDraw,
  LiveLink,
  PassageRef,
  PlayerState,
  SetlistItem,
  SetlistTemplate,
  VideoMap,
} from "@/lib/types";

const emptyPlayer: PlayerState = {
  ready: false,
  activated: false,
  playing: false,
  buffering: false,
  ended: false,
  currentTime: 0,
  duration: 0,
  error: null,
  updatedAt: 0,
};

type State = {
  hymns: Hymn[];
  loading: boolean;
  error: string | null;

  videos: VideoMap;

  bible: BibleBook[];
  bibleVersion: BibleVersionId;
  bibleLoading: boolean;

  setlist: SetlistItem[];
  /** Uid do item do roteiro em cartaz na projeção agora (hino ou passagem). */
  activeUid: string | null;
  /** Hino selecionado no painel (busca/roteiro) — só o que está em cartaz de verdade. */
  hymnId: number | null;
  /** Uid do item do roteiro correspondente ao hino selecionado, se veio de lá. */
  hymnUid: string | null;
  /** Hino em cartaz na projeção agora; só muda com uma ação explícita (Tocar, duplo clique, próximo/anterior). */
  liveHymnId: number | null;
  /** Vídeo avulso (link colado) em cartaz; excludente com o hino e a passagem. */
  liveLink: LiveLink | null;
  /** Passagem em cartaz na projeção; excludente com o vídeo do hino. */
  passage: PassageRef | null;
  /** Aparência da passagem na projeção (fonte, fundo, cor da letra). */
  passageStyle: PassageStyle;
  /** Cores globais do app e da projeção. */
  appearance: Appearance;
  /** Sorteio em cartaz na projeção. */
  draw: LiveDraw | null;
  /** Cronômetro regressivo em cartaz na projeção. */
  countdown: LiveCountdown | null;

  /** O que o operador quer que aconteça na projeção. */
  playing: boolean;
  blank: boolean;
  volume: number;
  seek: { time: number; nonce: number } | null;

  /** O que a janela de projeção informa de volta. */
  player: PlayerState;
  displayOpen: boolean;
  /** Referência à janela de projeção aberta por nós; null se nunca abrimos ou se já fechou. */
  displayWindow: Window | null;
  screenKey: string | null;
  /**
   * Tocar no próprio aparelho: a projeção fica embutida na aba "Ao vivo" em vez
   * de abrir outra janela. Padrão no celular/tablet, onde não há segunda tela.
   */
  inlinePlayer: boolean;
};

type Actions = {
  boot: () => Promise<void>;
  hymn: (id: number | null) => Hymn | null;
  videoOf: (id: number | null) => string | null;
  book: (abbrev: string) => BibleBook | null;
  setBibleVersion: (version: BibleVersionId) => Promise<void>;

  openHymn: (id: number, uid?: string | null) => void;
  /** Põe no ar o hino selecionado agora (sem tocar); usado por Tocar/duplo clique/próximo. */
  commitLive: () => void;
  stepHymn: (delta: number) => void;
  /** Põe um vídeo avulso no ar, parado (como commitLive faz com o hino). */
  commitLink: (link: LiveLink, uid?: string | null) => void;
  /** Põe um vídeo avulso no ar e já toca, abrindo a projeção se preciso. */
  playLink: (link: LiveLink, uid?: string | null) => Promise<void>;
  closeLink: () => void;
  addVideoToSetlist: (link: LiveLink) => void;

  openPassage: (ref: PassageRef, uid?: string | null) => void;
  closePassage: () => void;
  movePassageVerses: (delta: number) => void;
  setPassageStyle: (patch: Partial<PassageStyle>) => void;
  setAppearance: (patch: Partial<Appearance>) => void;
  /** Troca o tema; fundo e fonte do app voltam para os do tema escolhido. */
  setTheme: (theme: Theme) => void;
  resetAppearance: () => void;
  showDraw: (draw: DrawResult) => Promise<void>;
  closeDraw: () => void;
  showCountdown: (countdown: LiveCountdown) => Promise<void>;
  closeCountdown: () => void;

  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
  resumeLink: () => Promise<void>;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setBlank: (blank: boolean) => void;

  setVideo: (hymnId: number, input: string) => boolean;
  clearVideo: (hymnId: number) => void;
  exportVideos: () => void;

  addToSetlist: (id: number) => void;
  addPassageToSetlist: (ref: PassageRef) => void;
  addLabelToSetlist: (text: string) => void;
  renameSetlistLabel: (uid: string, text: string) => void;
  loadSetlistTemplate: (template: SetlistTemplate) => void;
  removeFromSetlist: (uid: string) => void;
  reorderSetlist: (items: SetlistItem[]) => void;
  clearSetlist: () => void;

  setPlayer: (state: PlayerState) => void;
  setDisplayOpen: (open: boolean) => void;
  /** Abre a janela de projeção (ou reaproveita a já aberta). false se o navegador bloqueou. */
  openDisplay: () => Promise<boolean>;
  closeDisplay: () => void;
  setScreenKey: (key: string | null) => void;
  setInlinePlayer: (inline: boolean) => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

/** Formato antigo do roteiro guardava só hinos, sem o campo "type". */
function normalizeSetlist(raw: unknown): SetlistItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item): SetlistItem[] => {
    if (!item || typeof item !== "object" || typeof item.uid !== "string") return [];
    if (item.type === "hymn" && typeof item.hymnId === "number") return [item as SetlistItem];
    if (item.type === "label" && typeof item.text === "string") return [item as SetlistItem];
    if (item.type === "video" && typeof item.videoId === "string" && typeof item.title === "string") {
      return [item as SetlistItem];
    }
    if (
      item.type === "passage" &&
      typeof item.book === "string" &&
      typeof item.chapter === "number" &&
      typeof item.verseStart === "number" &&
      typeof item.verseEnd === "number"
    ) {
      return [item as SetlistItem];
    }
    if (item.type == null && typeof item.hymnId === "number") {
      return [{ uid: item.uid, type: "hymn", hymnId: item.hymnId }];
    }
    return [];
  });
}

/** Celular/tablet: toque como entrada principal, sem mouse. */
function isTouchDevice() {
  return typeof matchMedia !== "undefined" && matchMedia("(hover: none) and (pointer: coarse)").matches;
}

// Aplica as cores antes do primeiro render, para não piscar o tema padrão.
const initialAppearance = normalizeAppearance(local.get<unknown>("appearance", DEFAULT_APPEARANCE));
if (typeof document !== "undefined") applyAppearance(initialAppearance);

export const useApp = create<State & Actions>((set, get) => ({
  hymns: [],
  loading: true,
  error: null,

  videos: {},

  bible: [],
  bibleVersion: (() => {
    const stored = local.get("bibleVersion", DEFAULT_BIBLE_VERSION);
    return isBibleVersion(stored) ? stored : DEFAULT_BIBLE_VERSION;
  })(),
  bibleLoading: false,

  setlist: normalizeSetlist(local.get<unknown[]>("setlist", [])),
  activeUid: null,
  hymnId: null,
  hymnUid: null,
  liveHymnId: null,
  liveLink: null,
  passage: null,
  passageStyle: local.get("passageStyle", DEFAULT_PASSAGE_STYLE),
  appearance: initialAppearance,
  draw: null,
  countdown: null,

  playing: false,
  blank: false,
  volume: local.get("volume", 1),
  seek: null,

  player: emptyPlayer,
  displayOpen: false,
  displayWindow: null,
  screenKey: local.get<string | null>("screenKey", null),
  inlinePlayer: local.get("inlinePlayer", isTouchDevice()),

  async boot() {
    try {
      const [hymnal, videos] = await Promise.all([
        loadHymnal((fresh) => set({ hymns: fresh.hymns })),
        loadVideoMap(),
      ]);
      set({ hymns: hymnal.hymns, videos, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Falha ao carregar o hinário",
      });
      return;
    }

    // A Bíblia é um recurso à parte: sem ela a busca de passagens some, mas o
    // hinário continua funcionando normalmente.
    await get().setBibleVersion(get().bibleVersion);
  },

  hymn(id) {
    if (id == null) return null;
    return get().hymns.find((hymn) => hymn.id === id) ?? null;
  },

  videoOf(id) {
    if (id == null) return null;
    return get().videos[String(id)] ?? null;
  },

  book(abbrev) {
    return findBook(get().bible, abbrev);
  },

  async setBibleVersion(version) {
    local.set("bibleVersion", version);
    set({ bibleVersion: version, bibleLoading: true });
    try {
      const bible = await loadBible(version, (fresh) => {
        if (get().bibleVersion === version) set({ bible: fresh.books });
      });
      if (get().bibleVersion === version) set({ bible: bible.books, bibleLoading: false });
    } catch {
      // Sem public/data/biblia-<versão>.json (ex: `npm run import:bible` não rodou ainda).
      if (get().bibleVersion === version) set({ bibleLoading: false });
    }
  },

  openHymn(id, itemUid = null) {
    // Só seleciona (busca/roteiro): olhar um hino não pode mexer no que já está no ar.
    // O ar só muda com commitLive (Tocar, duplo clique, próximo/anterior).
    set({ hymnId: id, hymnUid: itemUid });
  },

  commitLive() {
    // Põe no ar o hino selecionado agora; começa parado, o operador decide quando toca.
    set({
      liveHymnId: get().hymnId,
      activeUid: get().hymnUid,
      liveLink: null,
      passage: null,
      draw: null,
      countdown: null,
      playing: false,
      blank: false,
      seek: null,
      player: { ...emptyPlayer, activated: get().player.activated },
    });
  },

  stepHymn(delta) {
    // Etapas da programação sem hino (ex: "Oração") não têm o que projetar, então
    // navegar pelo teclado pula direto para o próximo/anterior hino da lista, sempre no ar
    // (é um controle de show, não uma busca).
    // Vídeos avulsos contam como hinos: também têm o que tocar.
    const hymnItems = get().setlist.filter(
      (item): item is Extract<SetlistItem, { type: "hymn" | "video" }> =>
        item.type === "hymn" || item.type === "video",
    );
    if (hymnItems.length === 0) return;
    const { activeUid } = get();
    const current = hymnItems.findIndex((item) => item.uid === activeUid);
    const next = hymnItems[Math.min(Math.max(current + delta, 0), hymnItems.length - 1)];
    if (!next || next.uid === activeUid) return;
    if (next.type === "video") {
      get().commitLink({ videoId: next.videoId, title: next.title }, next.uid);
      return;
    }
    get().openHymn(next.hymnId, next.uid);
    get().commitLive();
  },

  commitLink(link, itemUid = null) {
    // O hino selecionado sai da seleção: assim "Tocar" retoma o link, e clicar
    // num hino volta a ter o hino como alvo.
    set({
      liveLink: link,
      liveHymnId: null,
      hymnId: null,
      hymnUid: null,
      activeUid: itemUid,
      passage: null,
      draw: null,
      countdown: null,
      playing: false,
      blank: false,
      seek: null,
      player: { ...emptyPlayer, activated: get().player.activated },
    });
  },

  async playLink(link, itemUid = null) {
    get().commitLink(link, itemUid);
    if (!get().displayOpen) await get().openDisplay();
    set({ playing: true });
  },

  closeLink() {
    set({ liveLink: null, playing: false, activeUid: null });
  },

  addVideoToSetlist(link) {
    const setlist: SetlistItem[] = [...get().setlist, { uid: uid(), type: "video", ...link }];
    local.set("setlist", setlist);
    set({ setlist });
  },

  openPassage(ref, itemUid = null) {
    // Passagem substitui o vídeo na tela; o hino fica pausado até o operador voltar a ele.
    // Já é uma ação explícita de "botar no ar" (botão Projetar / duplo clique no roteiro).
    set({
      passage: clampPassage(get().bible, ref) ?? ref,
      activeUid: itemUid,
      liveHymnId: null,
      liveLink: null,
      draw: null,
      countdown: null,
      playing: false,
      blank: false,
    });
  },

  closePassage() {
    set({ passage: null, activeUid: null });
  },

  movePassageVerses(delta) {
    const { passage, bible } = get();
    if (!passage) return;
    const chapter = findBook(bible, passage.book)?.chapters[passage.chapter - 1];
    if (!chapter) return;
    const span = passage.verseEnd - passage.verseStart;
    const verseStart = Math.min(Math.max(passage.verseStart + delta, 1), chapter.length - span);
    set({ passage: { ...passage, verseStart, verseEnd: verseStart + span } });
  },

  setPassageStyle(patch) {
    const passageStyle = { ...get().passageStyle, ...patch };
    local.set("passageStyle", passageStyle);
    set({ passageStyle });
  },

  setAppearance(patch) {
    const appearance = { ...get().appearance, ...patch };
    local.set("appearance", appearance);
    applyAppearance(appearance);
    set({ appearance });
  },

  setTheme(theme) {
    get().setAppearance({ theme, ...THEME_COLORS[theme] });
  },

  resetAppearance() {
    // Restaura as cores do tema atual, sem trocar de tema.
    const appearance = defaultsFor(get().appearance.theme);
    local.set("appearance", appearance);
    applyAppearance(appearance);
    set({ appearance });
  },

  async showDraw(draw) {
    set({ draw: { ...draw, nonce: Date.now() }, countdown: null, blank: false });
    // Sortear é um gesto do operador, então dá para abrir a projeção se estiver fechada.
    if (!get().displayOpen) await get().openDisplay();
  },

  closeDraw() {
    set({ draw: null });
  },

  async showCountdown(countdown) {
    set({ countdown, draw: null, blank: false });
    if (!get().displayOpen) await get().openDisplay();
  },

  closeCountdown() {
    set({ countdown: null });
  },

  async play() {
    if (!get().videoOf(get().hymnId)) return;
    get().commitLive();
    // Tocar sem projeção aberta não mostra nada; abrimos por conta do operador.
    if (!get().displayOpen) await get().openDisplay();
    set({ playing: true, blank: false });
  },

  pause() {
    set({ playing: false });
  },

  toggle() {
    if (get().playing) get().pause();
    // Link no ar e nenhum hino selecionado depois dele: retoma o link.
    else if (get().liveLink && get().hymnId == null) void get().resumeLink();
    else void get().play();
  },

  async resumeLink() {
    if (!get().displayOpen) await get().openDisplay();
    set({ playing: true, blank: false });
  },

  seekTo(time) {
    set({ seek: { time: Math.max(0, time), nonce: Date.now() } });
  },

  setVolume(volume) {
    local.set("volume", volume);
    set({ volume });
  },

  setBlank(blank) {
    set({ blank });
  },

  setVideo(hymnId, input) {
    const videoId = parseVideoId(input);
    if (!videoId) return false;
    const videos = { ...get().videos, [String(hymnId)]: videoId };
    local.set("videos", { ...local.get<VideoMap>("videos", {}), [String(hymnId)]: videoId });
    set({ videos });
    return true;
  },

  clearVideo(hymnId) {
    const videos = { ...get().videos };
    delete videos[String(hymnId)];
    const stored = { ...local.get<VideoMap>("videos", {}) };
    delete stored[String(hymnId)];
    local.set("videos", stored);
    // Só para a projeção se o hino editado for o que está no ar; mexer no link de
    // outro hino não pode interromper o que já está tocando.
    set({ videos, playing: hymnId === get().liveHymnId ? false : get().playing });
  },

  /** Baixa o mapa completo para virar public/data/videos.json no projeto. */
  exportVideos() {
    const blob = new Blob([JSON.stringify(get().videos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "videos.json";
    link.click();
    URL.revokeObjectURL(url);
  },

  addToSetlist(id) {
    const setlist: SetlistItem[] = [...get().setlist, { uid: uid(), type: "hymn", hymnId: id }];
    local.set("setlist", setlist);
    set({ setlist });
  },

  addPassageToSetlist(ref) {
    const setlist: SetlistItem[] = [...get().setlist, { uid: uid(), type: "passage", ...ref }];
    local.set("setlist", setlist);
    set({ setlist });
  },

  addLabelToSetlist(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const setlist: SetlistItem[] = [...get().setlist, { uid: uid(), type: "label", text: trimmed }];
    local.set("setlist", setlist);
    set({ setlist });
  },

  renameSetlistLabel(itemUid, text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const setlist = get().setlist.map((item): SetlistItem =>
      item.uid === itemUid && item.type === "label" ? { ...item, text: trimmed } : item,
    );
    local.set("setlist", setlist);
    set({ setlist });
  },

  /** Acrescenta as etapas do modelo (culto de sábado, escola sabatina, ...) ao roteiro atual. */
  loadSetlistTemplate(template) {
    const items: SetlistItem[] = template.items.map((text) => ({ uid: uid(), type: "label", text }));
    const setlist = [...get().setlist, ...items];
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

  setPlayer(state) {
    // O fim do vídeo volta o botão para "tocar", sem mexer na tela.
    set({ player: state, playing: state.ended ? false : get().playing });
  },

  setDisplayOpen(open) {
    // Só o sinalizador do canal; a referência da janela é responsabilidade de
    // openDisplay/closeDisplay (o canal pode soltar "fechou" sem a janela ter fechado
    // de verdade — remontagem em StrictMode, por exemplo).
    set({ displayOpen: open, player: open ? get().player : emptyPlayer });
  },

  async openDisplay() {
    // Tocando no aparelho, a projeção embutida já está montada; não há janela para abrir.
    if (get().inlinePlayer) return true;
    // A permissão de gerenciamento de janelas só é concedida dentro de um gesto
    // do usuário, por isso isto só deve rodar a partir de um clique/tecla real.
    const opened = await openDisplayWindow(get().screenKey);
    if (!opened) return false;
    set({ displayWindow: opened.window, displayOpen: true });
    return true;
  },

  closeDisplay() {
    get().displayWindow?.close();
    set({ displayWindow: null, displayOpen: false, player: emptyPlayer });
  },

  setScreenKey(key) {
    local.set("screenKey", key);
    set({ screenKey: key });
  },

  setInlinePlayer(inline) {
    local.set("inlinePlayer", inline);
    // Uma projeção só por vez: a janela separada fecha ao passar para o aparelho.
    if (inline) get().closeDisplay();
    set({ inlinePlayer: inline });
  },
}));
