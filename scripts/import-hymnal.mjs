#!/usr/bin/env node
/**
 * Gera o índice do Hinário Adventista atual em public/data/hymnal.json.
 *
 * Grava só número e título de cada hino — o que a busca precisa. Nada de letra
 * ou áudio: a projeção toca o vídeo do YouTube.
 *
 *   node scripts/import-hymnal.mjs [--lang pt]
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const API = process.env.LOUVORJA_API ?? "https://api.louvorja.com.br/json_db";
const TOKEN = process.env.LOUVORJA_TOKEN ?? "02@v2nFB2Dc";
const lang = argValue("--lang") ?? "pt";
const outDir = path.resolve("public", "data");

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? undefined : process.argv[i + 1];
}

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const response = await fetch(`${API}/${lang}_hymnal`, { headers: { "Api-Token": TOKEN } });
if (!response.ok) throw new Error(`${lang}_hymnal: HTTP ${response.status}`);
const raw = await response.json();

const hymns = raw
  .map((hymn) => ({
    // O número se repete nas variações A/B; o id do acervo é a chave estável.
    id: hymn.id_music,
    number: hymn.track,
    title: hymn.name,
    search: slugify(hymn.name),
  }))
  .sort((a, b) => a.number - b.number || a.title.localeCompare(b.title, "pt-BR"));

await mkdir(outDir, { recursive: true });
await writeFile(
  path.join(outDir, "hymnal.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), language: lang, hymns }),
);

console.log(`ok: ${hymns.length} hinos (${hymns[0].number} a ${hymns[hymns.length - 1].number})`);
