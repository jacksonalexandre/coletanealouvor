#!/usr/bin/env node
/**
 * Gera o texto da Bíblia em public/data/biblia-<versão>.json a partir dos
 * releases de https://github.com/damarals/biblias (formato JSON do Zefania).
 *
 *   node scripts/import-bible.mjs [--only ara,arc]
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const RELEASE = "https://github.com/damarals/biblias/releases/latest/download";
const outDir = path.resolve("public", "data");

export const BIBLE_VERSIONS = [
  { id: "ara", asset: "ARA", name: "Almeida Revista e Atualizada" },
  { id: "arc", asset: "ARC", name: "Almeida Revista e Corrigida" },
  { id: "ntlh", asset: "NTLH", name: "Nova Tradução na Linguagem de Hoje" },
  { id: "nvi", asset: "NVI", name: "Nova Versão Internacional" },
];

// Ordem canônica dos 66 livros e o número de capítulos esperado de cada um;
// a fonte segue a mesma ordem, mas às vezes traz capítulos-fantasma por causa
// de nota de rodapé mal separada na origem (ex: NTLH 2 Samuel). O que passar
// do esperado é descartado.
const BOOKS = [
  ["gn", "Gênesis", "at", 50], ["ex", "Êxodo", "at", 40], ["lv", "Levítico", "at", 27],
  ["nm", "Números", "at", 36], ["dt", "Deuteronômio", "at", 34], ["js", "Josué", "at", 24],
  ["jz", "Juízes", "at", 21], ["rt", "Rute", "at", 4], ["1sm", "1 Samuel", "at", 31],
  ["2sm", "2 Samuel", "at", 24], ["1rs", "1 Reis", "at", 22], ["2rs", "2 Reis", "at", 25],
  ["1cr", "1 Crônicas", "at", 29], ["2cr", "2 Crônicas", "at", 36], ["ed", "Esdras", "at", 10],
  ["ne", "Neemias", "at", 13], ["et", "Ester", "at", 10], ["jó", "Jó", "at", 42],
  ["sl", "Salmos", "at", 150], ["pv", "Provérbios", "at", 31], ["ec", "Eclesiastes", "at", 12],
  ["ct", "Cantares", "at", 8], ["is", "Isaías", "at", 66], ["jr", "Jeremias", "at", 52],
  ["lm", "Lamentações", "at", 5], ["ez", "Ezequiel", "at", 48], ["dn", "Daniel", "at", 12],
  ["os", "Oséias", "at", 14], ["jl", "Joel", "at", 3], ["am", "Amós", "at", 9],
  ["ob", "Obadias", "at", 1], ["jn", "Jonas", "at", 4], ["mq", "Miquéias", "at", 7],
  ["na", "Naum", "at", 3], ["hc", "Habacuque", "at", 3], ["sf", "Sofonias", "at", 3],
  ["ag", "Ageu", "at", 2], ["zc", "Zacarias", "at", 14], ["ml", "Malaquias", "at", 4],
  ["mt", "Mateus", "nt", 28], ["mc", "Marcos", "nt", 16], ["lc", "Lucas", "nt", 24],
  ["jo", "João", "nt", 21], ["atos", "Atos", "nt", 28], ["rm", "Romanos", "nt", 16],
  ["1co", "1 Coríntios", "nt", 16], ["2co", "2 Coríntios", "nt", 13], ["gl", "Gálatas", "nt", 6],
  ["ef", "Efésios", "nt", 6], ["fp", "Filipenses", "nt", 4], ["cl", "Colossenses", "nt", 4],
  ["1ts", "1 Tessalonicenses", "nt", 5], ["2ts", "2 Tessalonicenses", "nt", 3],
  ["1tm", "1 Timóteo", "nt", 6], ["2tm", "2 Timóteo", "nt", 4], ["tt", "Tito", "nt", 3],
  ["fm", "Filemom", "nt", 1], ["hb", "Hebreus", "nt", 13], ["tg", "Tiago", "nt", 5],
  ["1pe", "1 Pedro", "nt", 5], ["2pe", "2 Pedro", "nt", 3], ["1jo", "1 João", "nt", 5],
  ["2jo", "2 João", "nt", 1], ["3jo", "3 João", "nt", 1], ["jd", "Judas", "nt", 1],
  ["ap", "Apocalipse", "nt", 22],
];

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const only = argValue("--only")?.split(",");
function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

const versions = only ? BIBLE_VERSIONS.filter((v) => only.includes(v.id)) : BIBLE_VERSIONS;
if (versions.length === 0) throw new Error(`--only não bateu com nenhuma versão (${only})`);

await mkdir(outDir, { recursive: true });

for (const version of versions) {
  const response = await fetch(`${RELEASE}/${version.asset}.json`);
  if (!response.ok) throw new Error(`${version.asset}: HTTP ${response.status}`);
  const raw = JSON.parse((await response.text()).replace(/^﻿/, ""));

  if (raw.length !== BOOKS.length) {
    throw new Error(`${version.asset}: esperava ${BOOKS.length} livros, veio ${raw.length}`);
  }

  const books = raw.map((entry, index) => {
    const [abbrev, name, testament, expectedChapters] = BOOKS[index];
    let chapters = entry.chapters;
    if (chapters.length > expectedChapters) {
      console.warn(
        `${version.asset}: ${abbrev} trouxe ${chapters.length} capítulos, esperava ${expectedChapters} — descartando o excedente (nota de rodapé mal separada na origem, provavelmente).`,
      );
      chapters = chapters.slice(0, expectedChapters);
    } else if (chapters.length < expectedChapters) {
      throw new Error(
        `${version.asset}: ${abbrev} só trouxe ${chapters.length} capítulos, esperava ${expectedChapters}`,
      );
    }
    return { abbrev, name, search: slugify(name), testament, chapters };
  });

  await writeFile(
    path.join(outDir, `biblia-${version.id}.json`),
    JSON.stringify({ generatedAt: new Date().toISOString(), version: version.id, name: version.name, books }),
  );
  console.log(`ok: ${version.id} (${version.name}) — ${books.length} livros`);
}
