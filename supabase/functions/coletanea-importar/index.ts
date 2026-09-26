/**
 * Importa o acervo da Coletânea para as tabelas coletanea_* (substitui os
 * antigos scripts/import-*.mjs, que geravam JSON em public/data).
 *
 *   POST { "alvo": "hinario" | "biblia" | "videos" | "tudo", "versoes"?: ["ara", ...] }
 *   header x-importar-token: <token da tabela coletanea_importar_tokens>
 *
 * Quem chama normalmente é o próprio banco: `select public.coletanea_importar('videos')`
 * (via pg_net), que conhece o token. O resultado de cada execução fica em
 * coletanea_importacoes.
 */
import { createClient } from "npm:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const LOUVORJA_API = "https://api.louvorja.com.br/json_db";
const LOUVORJA_TOKEN = "02@v2nFB2Dc";
const BIBLE_RELEASE = "https://github.com/damarals/biblias/releases/latest/download";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

type Alvo = "hinario" | "biblia" | "videos" | "tudo";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function check<T>(result: { data: T; error: { message: string } | null }, what: string): T {
  if (result.error) throw new Error(`${what}: ${result.error.message}`);
  return result.data;
}

async function touch(chave: string) {
  check(
    await db.from("coletanea_revisoes").upsert({ chave, atualizado_em: new Date().toISOString() }),
    `revisão ${chave}`,
  );
}

async function insertChunks(table: string, rows: Record<string, unknown>[], size = 1000) {
  for (let i = 0; i < rows.length; i += size) {
    check(await db.from(table).upsert(rows.slice(i, i + size)), `${table} (${i})`);
  }
}

// ── Hinário ────────────────────────────────────────────────────────────────

async function importarHinario(log: string[]) {
  const response = await fetch(`${LOUVORJA_API}/pt_hymnal`, { headers: { "Api-Token": LOUVORJA_TOKEN } });
  if (!response.ok) throw new Error(`pt_hymnal: HTTP ${response.status}`);
  const raw = (await response.json()) as { id_music: number; track: number; name: string }[];

  const rows = raw.map((hymn) => ({
    // O número se repete nas variações A/B; o id do acervo é a chave estável.
    id: hymn.id_music,
    numero: hymn.track,
    titulo: hymn.name,
    busca: slugify(hymn.name),
  }));
  if (rows.length < 500) throw new Error(`hinário veio com só ${rows.length} hinos; nada gravado`);

  await insertChunks("coletanea_hinos", rows);
  await touch("hinario");
  log.push(`hinário: ${rows.length} hinos`);
}

// ── Bíblia ─────────────────────────────────────────────────────────────────

async function importarBiblia(versao: string, log: string[]) {
  const { data: version } = await db.from("coletanea_biblia_versoes").select("id, sigla").eq("id", versao).single();
  if (!version) throw new Error(`versão ${versao} não cadastrada`);
  const livros = check(
    await db.from("coletanea_biblia_livros").select("abrev, capitulos").order("ordem"),
    "livros",
  ) as { abrev: string; capitulos: number }[];

  const response = await fetch(`${BIBLE_RELEASE}/${version.sigla}.json`);
  if (!response.ok) throw new Error(`${version.sigla}: HTTP ${response.status}`);
  const raw = JSON.parse((await response.text()).replace(/^﻿/, "")) as { chapters: string[][] }[];
  if (raw.length !== livros.length) {
    throw new Error(`${version.sigla}: esperava ${livros.length} livros, veio ${raw.length}`);
  }

  const rows: Record<string, unknown>[] = [];
  raw.forEach((entry, index) => {
    const { abrev, capitulos } = livros[index];
    let chapters = entry.chapters;
    // A fonte às vezes traz capítulos-fantasma (nota de rodapé mal separada na origem).
    if (chapters.length > capitulos) {
      log.push(`${version.sigla}: ${abrev} trouxe ${chapters.length} capítulos, esperava ${capitulos}; descartei o excedente`);
      chapters = chapters.slice(0, capitulos);
    } else if (chapters.length < capitulos) {
      throw new Error(`${version.sigla}: ${abrev} só trouxe ${chapters.length} capítulos, esperava ${capitulos}`);
    }
    chapters.forEach((verses, c) =>
      verses.forEach((texto, v) => rows.push({ versao, livro: abrev, capitulo: c + 1, versiculo: v + 1, texto })),
    );
  });

  // Troca a versão inteira: versículos que sumiram da fonte não ficam para trás.
  check(await db.from("coletanea_versiculos").delete().eq("versao", versao), `limpar ${versao}`);
  await insertChunks("coletanea_versiculos", rows);
  await touch(`biblia:${versao}`);
  log.push(`bíblia ${versao}: ${rows.length} versículos`);
}

// ── Vídeos (playlists do YouTube) ──────────────────────────────────────────

/** Recorta o objeto JSON que começa no primeiro `{` depois de `from`. */
function sliceJson(html: string, from: number) {
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
function collectVideos(data: unknown) {
  const found = new Map<string, string>();
  // deno-lint-ignore no-explicit-any
  const walk = (node: any) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    if (node.videoId && !found.has(node.videoId)) {
      const title = node.title?.simpleText ?? node.title?.runs?.[0]?.text;
      if (title) found.set(node.videoId, title);
    }
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

async function fetchPlaylist(input: string) {
  const list = new URL(input).searchParams.get("list");
  if (!list) throw new Error("link sem parâmetro list=");
  const response = await fetch(`https://www.youtube.com/playlist?list=${list}`, {
    headers: { "User-Agent": UA, "Accept-Language": "pt-BR,pt;q=0.9" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const marker = html.indexOf("ytInitialData = ");
  if (marker === -1) throw new Error("página sem ytInitialData (mudança no YouTube ou bloqueio)");
  const name = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(" - YouTube", "") ?? input;
  return { name, videos: collectVideos(JSON.parse(sliceJson(html, marker))) };
}

async function importarVideos(log: string[]) {
  const playlists = check(await db.from("coletanea_playlists").select("url").order("ordem"), "playlists") as {
    url: string;
  }[];
  const hymns = check(await db.from("coletanea_hinos").select("id, numero, titulo"), "hinos") as {
    id: number;
    numero: number;
    titulo: string;
  }[];
  if (hymns.length === 0) throw new Error("importe o hinário antes dos vídeos");

  // número -> hinos (o 587 tem as variações A e B)
  const byNumber = new Map<number, typeof hymns>();
  for (const hymn of hymns) byNumber.set(hymn.numero, [...(byNumber.get(hymn.numero) ?? []), hymn]);

  const videos = new Map<number, string>();
  const problems: string[] = [];

  for (const { url } of playlists) {
    let playlist;
    try {
      playlist = await fetchPlaylist(url);
    } catch (error) {
      problems.push(`playlist ${url}: ${(error as Error).message}`);
      continue;
    }

    let inPlaylist = 0;
    for (const [videoId, title] of playlist.videos) {
      // "Novo Hinário Adventista • Hino 12 • Título • (Lyrics)"
      const match = title.match(/hino\s*(\d{1,3})\b/i);
      if (!match) continue;
      const number = Number(match[1]);
      const variant = title.match(/[-–]\s*([AB])\s*(?:[•|]|$)/i)?.[1]?.toUpperCase() ?? null;
      const candidates = byNumber.get(number);
      if (!candidates) {
        problems.push(`hino ${number} não existe no hinário: "${title}"`);
        continue;
      }

      let hymn = candidates[0];
      if (candidates.length > 1) {
        const wanted = variant
          ? candidates.find((option) => option.titulo.trim().toUpperCase().endsWith(`- ${variant}`))
          : null;
        const free = candidates.find((option) => !videos.has(option.id));
        if (wanted) hymn = wanted;
        else if (free) hymn = free;
        else continue;
      }

      const already = videos.get(hymn.id);
      if (already && already !== videoId) {
        problems.push(`hino ${number} recebeu dois vídeos; fiquei com ${already}`);
        continue;
      }
      videos.set(hymn.id, videoId);
      inPlaylist += 1;
    }
    log.push(`${playlist.name}: ${inPlaylist} de ${playlist.videos.size} vídeos mapeados`);
  }

  if (videos.size === 0) {
    // Não apaga o que já existe: provavelmente o YouTube bloqueou a leitura.
    throw new Error(`nenhum vídeo encontrado; nada gravado. ${problems.slice(0, 5).join(" | ")}`);
  }

  const now = new Date().toISOString();
  await insertChunks(
    "coletanea_videos",
    [...videos].map(([hino_id, video_id]) => ({ hino_id, video_id, atualizado_em: now })),
  );
  await touch("videos");
  log.push(`vídeos: ${videos.size} mapeados, ${hymns.length - videos.size} hinos sem vídeo`);
  if (problems.length) log.push(`${problems.length} avisos: ${problems.slice(0, 15).join(" | ")}`);
}

// ── Entrada ────────────────────────────────────────────────────────────────

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ erro: "use POST" }, 405);

  const token = request.headers.get("x-importar-token") ?? "";
  const { data: valid } = await db.from("coletanea_importar_tokens").select("token").eq("token", token).maybeSingle();
  if (!token || !valid) return json({ erro: "não autorizado" }, 401);

  const body = (await request.json().catch(() => ({}))) as { alvo?: Alvo; versoes?: string[] };
  const alvo: Alvo = body.alvo ?? "tudo";
  const log: string[] = [];
  const { data: run } = await db.from("coletanea_importacoes").insert({ alvo }).select("id").single();

  let ok = true;
  let erro: string | null = null;
  try {
    if (alvo === "hinario" || alvo === "tudo") await importarHinario(log);
    if (alvo === "biblia" || alvo === "tudo") {
      const versoes = body.versoes?.length ? body.versoes : ["ara", "arc", "ntlh", "nvi"];
      for (const versao of versoes) await importarBiblia(versao, log);
    }
    if (alvo === "videos" || alvo === "tudo") await importarVideos(log);
  } catch (error) {
    ok = false;
    erro = (error as Error).message;
  }

  if (run) {
    await db
      .from("coletanea_importacoes")
      .update({ ok, erro, log, terminado_em: new Date().toISOString() })
      .eq("id", run.id);
  }
  return json({ ok, alvo, log, erro }, ok ? 200 : 500);
});
