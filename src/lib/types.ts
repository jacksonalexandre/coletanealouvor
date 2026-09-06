export type AlbumRef = { albumId: number; track: number | null };

export type Song = {
  id: number;
  title: string;
  search: string;
  duration: number | null;
  instrumental: boolean;
  hymnNumber: number | null;
  albums: AlbumRef[];
};

export type Album = {
  id: number;
  name: string;
  subtitle: string | null;
  color: string | null;
  cover: string | null;
  order: number;
  categoryId: number | null;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  order: number;
  albumIds: number[];
};

export type Catalog = {
  version: number;
  generatedAt: string;
  language: string;
  categories: Category[];
  albums: Album[];
  songs: Song[];
};

/** Um item do roteiro do culto. */
export type SetlistItem = {
  /** Identificador local do item; a mesma música pode entrar duas vezes. */
  uid: string;
  songId: number;
};

export type SlideStyle = {
  fontScale: number;
  uppercase: boolean;
  align: "center" | "left";
  showTitle: boolean;
  background: "black" | "deep" | "gradient";
};

/** Estado espelhado do controle para a tela de projeção. */
export type LiveState = {
  songId: number | null;
  title: string;
  slides: string[];
  slideIndex: number;
  blank: boolean;
  style: SlideStyle;
  message: string | null;
  clock: boolean;
  updatedAt: number;
};
