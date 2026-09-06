export type Hymn = {
  /** Identificador estável; o número se repete nas variações A/B. */
  id: number;
  number: number;
  title: string;
  /** Título sem acento e em minúsculas, para a busca. */
  search: string;
};

export type Hymnal = {
  generatedAt: string;
  language: string;
  hymns: Hymn[];
};

/** Mapa id do hino -> id do vídeo no YouTube. */
export type VideoMap = Record<string, string>;

/** Um item do roteiro do culto. */
export type SetlistItem = {
  /** Identificador local do item; o mesmo hino pode entrar duas vezes. */
  uid: string;
  hymnId: number;
};

/** O que o controle manda para a janela de projeção. */
export type LiveState = {
  videoId: string | null;
  title: string;
  /** Tela preta por cima do vídeo, sem parar a reprodução. */
  blank: boolean;
  /** Reprodução desejada pelo operador. */
  playing: boolean;
  volume: number;
  /** Pedido de busca na linha do tempo; o nonce faz repetir o mesmo segundo. */
  seek: { time: number; nonce: number } | null;
  updatedAt: number;
};

/** O que a janela de projeção responde sobre o player. */
export type PlayerState = {
  /** O player do YouTube carregou. */
  ready: boolean;
  /** O operador já liberou o som com um clique na janela de projeção. */
  activated: boolean;
  playing: boolean;
  buffering: boolean;
  ended: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
  updatedAt: number;
};
