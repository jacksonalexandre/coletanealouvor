#!/usr/bin/env node
/**
 * Importador de acervo (uso em tempo de desenvolvimento).
 *
 * Baixa os JSONs públicos do LouvorJA e grava um dataset normalizado em
 * public/data. O app em produção lê apenas esses arquivos locais — nunca a API
 * de terceiros em runtime.
 *
 * As letras são obra de terceiros. Use este script apenas se você tem direito
 * de distribuir o conteúdo resultante.
 *
 *   node scripts/import-louvorja.mjs [--lang pt]
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

async function getJson(file) {
  const res = await fetch(`${API}/${file}`, { headers: { "Api-Token": TOKEN } });
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return res.json();
}

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const seconds = (duration) => {
  if (typeof duration !== "string") return null;
  const parts = duration.split(":").map(Number);
  if (parts.some(Number.isNaN)) return null;
  return parts.reduce((total, part) => total * 60 + part, 0);
};

const config = await getJson("config");
const [musics, hymnal, categories] = await Promise.all([
  getJson(`${lang}_musics`),
  getJson(`${lang}_hymnal`),
  getJson(`${lang}_categories`),
]);

const albums = new Map();
for (const category of categories) {
  for (const album of category.albums ?? []) {
    albums.set(album.id_album, {
      id: album.id_album,
      name: album.name,
      subtitle: album.subtitle ?? null,
      color: album.color ?? null,
      cover: album.url_image ?? null,
      order: album.order ?? 0,
      categoryId: category.id_category,
    });
  }
}

const songs = new Map();
const lyrics = {};

for (const music of musics) {
  const albumRefs = (music.albums ?? []).map((album) => {
    if (!albums.has(album.id_album)) {
      albums.set(album.id_album, {
        id: album.id_album,
        name: album.name,
        subtitle: null,
        color: null,
        cover: null,
        order: album.order ?? 0,
        categoryId: null,
      });
    }
    return { albumId: album.id_album, track: album.pivot?.track ?? null };
  });

  songs.set(music.id_music, {
    id: music.id_music,
    title: music.name,
    search: slugify(`${music.name} ${music.albums_names ?? ""}`),
    duration: seconds(music.duration),
    instrumental: music.has_instrumental_music === 1,
    hymnNumber: null,
    albums: albumRefs,
  });
  lyrics[music.id_music] = music.lyric ?? "";
}

for (const hymn of hymnal) {
  const existing = songs.get(hymn.id_music);
  const song = existing ?? {
    id: hymn.id_music,
    title: hymn.name,
    search: slugify(hymn.name),
    duration: seconds(hymn.duration),
    instrumental: hymn.has_instrumental_music === 1,
    hymnNumber: null,
    albums: [],
  };
  song.hymnNumber = hymn.track ?? null;
  song.search = slugify(`${song.title} hino ${song.hymnNumber ?? ""}`);
  songs.set(song.id, song);
  if (!lyrics[song.id]) lyrics[song.id] = hymn.lyric ?? "";
}

const catalog = {
  version: config?.version_number ?? 0,
  generatedAt: new Date().toISOString(),
  language: lang,
  categories: categories.map((category) => ({
    id: category.id_category,
    name: category.name,
    slug: category.slug,
    order: category.order ?? 0,
    albumIds: (category.albums ?? []).map((album) => album.id_album),
  })),
  albums: [...albums.values()].sort((a, b) => a.order - b.order),
  songs: [...songs.values()].sort((a, b) => a.title.localeCompare(b.title, "pt-BR")),
};

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "catalog.json"), JSON.stringify(catalog));
await writeFile(path.join(outDir, "lyrics.json"), JSON.stringify(lyrics));

console.log(
  `ok: ${catalog.songs.length} músicas (${hymnal.length} do hinário), ` +
    `${catalog.albums.length} álbuns, ${catalog.categories.length} categorias`,
);
