export type PassageStyle = {
  /** Tamanho do corpo do versículo na projeção, em rem. */
  fontSize: number;
  background: string;
  color: string;
};

export const DEFAULT_PASSAGE_STYLE: PassageStyle = {
  fontSize: 2.25,
  background: "#000000",
  color: "#f8fafc",
};
