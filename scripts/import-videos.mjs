#!/usr/bin/env node
/**
 * Monta public/data/videos.json a partir das playlists do YouTube.
 *
 * As playlists ficam em scripts/playlists.json. O número do hino sai do título
 * do vídeo ("... Hino 12 ..."), e o número vira o id do hino pelo hymnal.json.
 *
 *   node scripts/import-videos.mjs [--check]
 *
 * --check só relata, não grava.
 *
 * Isto lê a página pública da playlist. Se o YouTube mudar o HTML, o script
 * avisa em vez de gravar um mapa vazio.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const check = process.argv.includes("--check");
const playlistsFile = path.resolve("scripts", "playlists.json");
const hymnalFile = path.resolve("public", "data", "hymnal.json");
const outFile = path.resolve("public", "data", "videos.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Recorta o objeto JSON que começa no primeiro `{` depois de `from`. */
function sliceJson(html, from) {
  let index = html.indexOf("{", from);
  const start = index;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (; index < html.length; index += 1) {
    const char = html[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return html.slice(start, index + 1);
    }
  }
  throw new Error("JSON da página incompleto");
}

/** Percorre o ytInitialData juntando id e título de cada vídeo. */
function collectVideos(data) {
  const found = new Map();

  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;

    // Formato antigo.
    if (node.videoId && !found.has(node.videoId)) {
      const title = node.title?.simpleText ?? node.title?.runs?.[0]?.text;
      if (title) found.set(node.videoId, title);
    }
    // Formato novo: id e título em ramos diferentes do mesmo lockup.
    const lockup = node.lockupViewModel;
    if (lockup?.contentId) {
      const title = lockup.metadata?.lockupMetadataViewModel?.title?.content;
      if (title) found.set(lockup.contentId, title);
    }
    for (const value of Object.values(node)) walk(value);
  };

  walk(data);
  return found;
}

/** Aceita link de playlist ou link de vídeo com `list=`. */
function playlistUrl(input) {
  const list = new URL(input).searchParams.get("list");
  if (!list) throw new Error("link sem parâmetro list=");
  return `https://www.youtube.com/playlist?list=${list}`;
}

async function fetchPlaylist(input) {
  const url = playlistUrl(input);
  const response = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "pt-BR,pt;q=0.9" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();

  const marker = html.indexOf("ytInitialData = ");
  if (marker === -1) throw new Error("página sem ytInitialData (mudança no YouTube ou bloqueio)");

  const videos = collectVideos(JSON.parse(sliceJson(html, marker)));
  const name = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(" - YouTube", "") ?? url;
  return { name, videos };
}

const playlists = JSON.parse(await readFile(playlistsFile, "utf8"));
const hymnal = JSON.parse(await readFile(hymnalFile, "utf8"));

// número -> hinos (o 587 tem as variações A e B)
const byNumber = new Map();
for (const hymn of hymnal.hymns) {
  const list = byNumber.get(hymn.number) ?? [];
  list.push(hymn);
  byNumber.set(hymn.number, list);
}

const videos = {};
const problems = [];
let matched = 0;

for (const entry of playlists) {
  const url = typeof entry === "string" ? entry : entry.url;
  let playlist;
  try {
    playlist = await fetchPlaylist(url);
  } catch (error) {
    problems.push(`playlist ${url}: ${error.message}`);
    continue;
  }

  let inPlaylist = 0;
  for (const [videoId, title] of playlist.videos) {
    // "Novo Hinário Adventista • Hino 12 • Título • (Lyrics)"
    const match = title.match(/hino\s*(\d{1,3})\b/i);
    if (!match) {
      problems.push(`sem número no título: "${title}" (${videoId})`);
      continue;
    }

    const number = Number(match[1]);
    // A variação fica no fim do título do hino: "… ao Senhor - B • (Lyrics)".
    const variant = title.match(/[-–]\s*([AB])\s*(?:[•|]|$)/i)?.[1]?.toUpperCase() ?? null;
    const candidates = byNumber.get(number);
    if (!candidates) {
      problems.push(`hino ${number} não existe no hinário: "${title}"`);
      continue;
    }

    let hymn = candidates[0];
    if (candidates.length > 1) {
      const wanted = variant
        ? candidates.find((option) => option.title.trim().toUpperCase().endsWith(`- ${variant}`))
        : null;
      if (wanted) {
        hymn = wanted;
      } else {
        // Sem letra no título, fica com a primeira variação ainda sem vídeo.
        const free = candidates.find((option) => !videos[String(option.id)]);
        if (!free) {
          problems.push(`hino ${number}: variações já mapeadas, sobrou "${title}"`);
          continue;
        }
        hymn = free;
        problems.push(`hino ${number} tem ${candidates.length} variações; usei "${hymn.title}"`);
      }
    }

    const already = videos[String(hymn.id)];
    if (already && already !== videoId) {
      problems.push(`hino ${number} recebeu dois vídeos; fiquei com ${already}`);
      continue;
    }

    // Conferência: o título do vídeo deve conter o título do hino.
    const videoWords = normalize(title);
    const hymnWords = normalize(hymn.title.replace(/\s*-\s*[AB]$/i, ""));
    if (hymnWords && !videoWords.includes(hymnWords)) {
      problems.push(`título diferente no hino ${number}: hinário "${hymn.title}" / vídeo "${title}"`);
    }

    videos[String(hymn.id)] = videoId;
    matched += 1;
    inPlaylist += 1;
  }

  console.log(`${playlist.name}: ${inPlaylist} de ${playlist.videos.size} vídeos mapeados`);
}

const missing = hymnal.hymns.filter((hymn) => !videos[String(hymn.id)]);

console.log(`\ntotal: ${matched} vídeos mapeados, ${missing.length} hinos sem vídeo`);
if (missing.length > 0) {
  const numbers = [...new Set(missing.map((hymn) => hymn.number))].sort((a, b) => a - b);
  console.log(`faltando: ${ranges(numbers)}`);
}
if (problems.length > 0) {
  console.log(`\n${problems.length} avisos:`);
  for (const problem of problems.slice(0, 30)) console.log(`  - ${problem}`);
  if (problems.length > 30) console.log(`  ... e mais ${problems.length - 30}`);
}

if (check) {
  console.log("\n--check: nada gravado.");
} else {
  await writeFile(outFile, JSON.stringify(videos, null, 2));
  console.log(`\ngravado: ${path.relative(process.cwd(), outFile)}`);
}

/** 1,2,3,7,8 -> "1-3, 7-8" */
function ranges(numbers) {
  const parts = [];
  let start = numbers[0];
  let previous = numbers[0];

  for (const number of numbers.slice(1)) {
    if (number === previous + 1) {
      previous = number;
      continue;
    }
    parts.push(start === previous ? `${start}` : `${start}-${previous}`);
    start = number;
    previous = number;
  }
  parts.push(start === previous ? `${start}` : `${start}-${previous}`);
  return parts.join(", ");
}
