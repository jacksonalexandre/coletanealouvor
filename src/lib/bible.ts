import type { BibleBook, PassageRef } from "@/lib/types";

export function findBook(books: BibleBook[], abbrev: string): BibleBook | null {
  return books.find((book) => book.abbrev === abbrev) ?? null;
}

/** Limita o recorte às fronteiras reais do capítulo (livro/capítulo podem ter mudado de versão). */
export function clampPassage(books: BibleBook[], ref: PassageRef): PassageRef | null {
  const book = findBook(books, ref.book);
  const chapter = book?.chapters[ref.chapter - 1];
  if (!book || !chapter) return null;
  const verseStart = Math.min(Math.max(ref.verseStart, 1), chapter.length);
  const verseEnd = Math.min(Math.max(ref.verseEnd, verseStart), chapter.length);
  return { ...ref, verseStart, verseEnd };
}

export function passageVerses(books: BibleBook[], ref: PassageRef) {
  const clamped = clampPassage(books, ref);
  if (!clamped) return [];
  const chapter = findBook(books, clamped.book)!.chapters[clamped.chapter - 1];
  const verses = [];
  for (let number = clamped.verseStart; number <= clamped.verseEnd; number++) {
    verses.push({ number, text: chapter[number - 1] });
  }
  return verses;
}

export function passageReference(books: BibleBook[], ref: PassageRef): string {
  const book = findBook(books, ref.book);
  if (!book) return "";
  const range = ref.verseStart === ref.verseEnd ? `${ref.verseStart}` : `${ref.verseStart}-${ref.verseEnd}`;
  return `${book.name} ${ref.chapter}:${range}`;
}
