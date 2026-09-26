import type { BibleBook, PassageRef } from "@/lib/types";
import { normalize } from './utils';

export function moveVerse(books: BibleBook[], ref: PassageRef, delta: number): PassageRef | null {
  let bookIndex = books.findIndex(book => book.abbrev === ref.book);
  if (bookIndex < 0) return null;
  let chapter = ref.chapter - 1;
  let verse = ref.verseStart - 1 + delta;
  if (!books[bookIndex].chapters[chapter]) return null;
  while (verse >= books[bookIndex].chapters[chapter].length) {
    verse -= books[bookIndex].chapters[chapter].length;
    chapter++;
    if (chapter >= books[bookIndex].chapters.length) { bookIndex++; chapter = 0; }
    if (bookIndex >= books.length) return null;
  }
  while (verse < 0) {
    chapter--;
    if (chapter < 0) { bookIndex--; if (bookIndex < 0) return null; chapter = books[bookIndex].chapters.length - 1; }
    verse += books[bookIndex].chapters[chapter].length;
  }
  return { book: books[bookIndex].abbrev, chapter: chapter + 1, verseStart: verse + 1, verseEnd: verse + 1 };
}

export function parseReference(books: BibleBook[], input: string): PassageRef | null {
  const match = normalize(input).trim().match(/^(.+?)\s+(\d+)\s*[:.]\s*(\d+)(?:\s*[-–]\s*(\d+))?$/);
  if (!match) return null;
  const book = books.find(b => [normalize(b.name), normalize(b.abbrev)].includes(match[1].trim()));
  const chapter = Number(match[2]), verseStart = Number(match[3]), verseEnd = Number(match[4] ?? match[3]);
  if (!book || !book.chapters[chapter - 1] || verseStart < 1 || verseEnd < verseStart || verseEnd > book.chapters[chapter - 1].length) return null;
  return { book: book.abbrev, chapter, verseStart, verseEnd };
}

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
