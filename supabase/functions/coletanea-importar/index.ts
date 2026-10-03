/**
 * Importa o acervo da Coletânea para as tabelas coletanea_* (substitui os
 * antigos scripts/import-*.mjs, que geravam JSON em public/data).
 *
 *   POST { "alvo": "hinario" | "biblia" | "videos" | "canais" | "tudo", "versoes"?: ["ara", ...] }
 *
 * hinario/videos: coleção HASD (LouvorJá + playlists). canais: coleções do tipo
 * "canal" (ex: Menos Um), em que cada vídeo do canal vira um item da busca.
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

type Alvo = "hinario" | "biblia" | "videos" | "canais" | "tudo";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
    colecao: "hasd",
    chave: String(hymn.id_music),
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
  const raw = JSON.parse((await response.text()).replace(/^\uFEFF/, "")) as { chapters: string[][] }[];
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

/** Token da próxima página (playlist e aba de vídeos do canal carregam ~30-100 por vez). */
function findContinuation(data: unknown): string | null {
  let token: string | null = null;
  // deno-lint-ignore no-explicit-any
  const walk = (node: any) => {
    if (token || !node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    const command = node.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
    if (typeof command === "string") {
      token = command;
      return;
    }
    for (const value of Object.values(node)) walk(value);
  };
  walk(data);
  return token;
}

/** Lê uma página do YouTube (playlist ou aba de vídeos de canal) inteira, seguindo as continuações. */
async function fetchAllVideos(url: string, maxPages = 60) {
  const response = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "pt-BR,pt;q=0.9" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const marker = html.indexOf("ytInitialData = ");
  if (marker === -1) throw new Error("página sem ytInitialData (mudança no YouTube ou bloqueio)");
  const name = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(" - YouTube", "") ?? url;
  const apiKey = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1];
  const clientVersion = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1] ?? "2.20250101.00.00";

  let data: unknown = JSON.parse(sliceJson(html, marker));
  const videos = collectVideos(data);
  for (let page = 1; page < maxPages; page += 1) {
    const token = findContinuation(data);
    if (!token) break;
    const next = await fetch(
      `https://www.youtube.com/youtubei/v1/browse?prettyPrint=false${apiKey ? `&key=${apiKey}` : ""}`,
      {
        method: "POST",
        headers: { "User-Agent": UA, "Content-Type": "application/json" },
        body: JSON.stringify({
          context: { client: { clientName: "WEB", clientVersion, hl: "pt", gl: "BR" } },
          continuation: token,
        }),
      },
    );
    if (!next.ok) break;
    data = await next.json();
    for (const [id, title] of collectVideos(data)) if (!videos.has(id)) videos.set(id, title);
  }
  return { name, videos };
}

async function fetchPlaylist(input: string) {
  const list = new URL(input).searchParams.get("list");
  if (!list) throw new Error("link sem parâmetro list=");
  return fetchAllVideos(`https://www.youtube.com/playlist?list=${list}`);
}

async function importarVideos(log: string[]) {
  const playlists = check(
    await db.from("coletanea_playlists").select("url").eq("colecao", "hasd").order("ordem"),
    "playlists",
  ) as { url: string }[];
  const hymns = check(
    await db.from("coletanea_hinos").select("id, numero, titulo").eq("colecao", "hasd"),
    "hinos",
  ) as { id: number; numero: number; titulo: string }[];
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

// ── Canais (cada vídeo vira um item da busca) ──────────────────────────────

/** Referência ao hinário antigo no título ("Hinário Adventista / Hino IASD 33"). */
const OLD_HYMNAL = /\s*hin[aá]rio adventista\s*\/?\s*hino\s*iasd\s*(\d{1,3})\b|\s*hino\s*iasd\s*(\d{1,3})\b/i;

const SMALL_WORDS = new Set(["a", "o", "as", "os", "e", "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas", "por", "para", "com", "ao", "à"]);

/** Palavras todas em maiúsculas viram "Castelo Forte"; o resto fica como veio. */
function titleCase(value: string) {
  return value
    .split(/(\s+)/)
    .map((word, index) => {
      if (word.length < 2 || word !== word.toLocaleUpperCase("pt-BR") || !/\p{L}/u.test(word)) return word;
      const lower = word.toLocaleLowerCase("pt-BR");
      return index > 0 && SMALL_WORDS.has(lower) ? lower : lower.charAt(0).toLocaleUpperCase("pt-BR") + lower.slice(1);
    })
    .join("");
}

/** Versões do mesmo vídeo: viram detalhe, nunca título. */
const VARIANT = /^(?:playback|karaok[eê]|instrumental|legendado|em libras|com libras|libras|(?:versão|vers[aã]o) .*)$/i;

/** Versão citada dentro do título ("Coisas tão Pequenas (KARAOKÊ)", "Elias COM LIBRAS"). */
// Sem \b: em JavaScript ele não trata "Ê" como letra, e "KARAOKÊ)" não fecharia a palavra.
const INLINE_VARIANT = /\s*\(?(?<![\p{L}\d])(karaok[eê]|playback|instrumental)(?![\p{L}\d])\)?|\s+((?:em|com)\s+libras)(?![\p{L}\d])/giu;

/** Ruído de título que não ajuda a achar o hino. */
const TITLE_NOISE = /\((?:clipe |v[ií]deo )?oficial\)|\[(?:clipe |v[ií]deo )?oficial\]|\(hd\)|\bclipe oficial\b/gi;

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Separa título e detalhe de um vídeo de canal:
 *   "CASTELO FORTE | Hinário Adventista / Hino IASD 33 | MENOS UM" -> "Castelo Forte", antigo 33
 *   "EU SOU TEU | PLAYBACK | MENOS UM"                               -> "Eu Sou Teu" · PLAYBACK
 *   "Bom Samaritano - Playback"                                      -> "Bom Samaritano" · Playback
 *   "Minha Vida É Uma Viagem - Playback" (canal com o nome da música) -> título mantido
 * O número do hinário ATUAL vem depois, pelo título (ver importarCanais).
 */
function parseChannelTitle(raw: string, channelNames: string[]) {
  const oldMatch = raw.match(OLD_HYMNAL);
  const antigo = oldMatch ? Number(oldMatch[1] ?? oldMatch[2]) : null;
  const channelKeys = new Set(channelNames.filter(Boolean).map((name) => slugify(name)));
  const channelNoise = channelNames
    .filter(Boolean)
    .map((name) => new RegExp(`\\s*${escapeRegex(name)}\\s*`, "giu"));

  const clean = (part: string) =>
    part
      .replace(new RegExp(OLD_HYMNAL.source, "gi"), " ")
      .replace(TITLE_NOISE, " ")
      .replace(/\s+/g, " ")
      .replace(/^[\s\-–·:]+|[\s\-–·:]+$/g, "")
      .trim();

  const segments = raw
    .replace(/\p{Extended_Pictographic}/gu, " ")
    .split(/\s*\|\s*|\s+[-–]\s+/)
    .map(clean)
    .filter(Boolean);

  // O 1º segmento é o título, a não ser que seja só o nome do canal seguido de outro título.
  let [first = raw.trim(), ...rest] = segments;
  if (channelKeys.has(slugify(first)) && rest.length > 0 && !VARIANT.test(rest[0])) {
    [first, ...rest] = rest;
  }
  // "Karaokê - MUDA TUDO": a versão veio antes do nome da música.
  const leading: string[] = [];
  if (VARIANT.test(first) && rest.length > 0) {
    leading.push(first);
    [first, ...rest] = rest;
  }
  // Nome do canal no meio do título, sem separador: o que vem depois vira detalhe.
  for (const noise of channelNoise) {
    const at = first.search(new RegExp(noise.source, "iu"));
    if (at > 0) {
      const after = first.slice(at).replace(new RegExp(noise.source, "iu"), " ").trim();
      first = first.slice(0, at).trim();
      if (after) rest.unshift(after);
    }
  }
  // "(KARAOKÊ)", "COM LIBRAS" dentro do título: saem do título e vão para o detalhe.
  first = first
    .replace(INLINE_VARIANT, (_match, word?: string, libras?: string) => {
      leading.push((word ?? libras ?? "").trim());
      return " ";
    })
    .replace(/\s+/g, " ")
    .trim();
  rest = [...leading.filter(Boolean), ...rest];

  const details = rest
    .map((part) => channelNoise.reduce((text, noise) => text.replace(noise, " "), part).replace(/\s+/g, " ").trim())
    .filter((part) => part && !channelKeys.has(slugify(part)));

  return { titulo: titleCase(first), antigo, detalhe: details.join(" · ") || null };
}

/** Chave para casar títulos entre coleções: sem acento, sem o que vem entre parênteses. */
const titleKey = (title: string) => slugify(title.replace(/\(.*?\)/g, " "));

async function importarCanais(log: string[]) {
  const canais = check(
    await db
      .from("coletanea_colecoes")
      .select("id, sigla, nome, fonte_url, filtro_titulo, excluir_titulo")
      .eq("tipo", "canal")
      .order("ordem"),
    "coleções",
  ) as {
    id: string;
    sigla: string;
    nome: string;
    fonte_url: string | null;
    filtro_titulo: string | null;
    excluir_titulo: string | null;
  }[];

  for (const canal of canais) {
    if (!canal.fonte_url) continue;
    const { videos: all } = await fetchAllVideos(canal.fonte_url);
    if (all.size === 0) throw new Error(`${canal.sigla}: nenhum vídeo encontrado; nada gravado`);
    // Só o que é hino: o canal também tem flash mob, coletâneas, volumes completos…
    const include = canal.filtro_titulo ? new RegExp(canal.filtro_titulo, "i") : null;
    const exclude = canal.excluir_titulo ? new RegExp(canal.excluir_titulo, "i") : null;
    const videos = new Map(
      [...all].filter(([, title]) => (!include || include.test(title)) && !(exclude && exclude.test(title))),
    );
    // Nomes do canal que aparecem nos títulos e não são parte do nome da música.
    const channelNames = [canal.filtro_titulo ?? "", canal.sigla];

    // Mantém o id de quem já existe: programações salvas continuam apontando para o mesmo item.
    const existing = check(
      await db.from("coletanea_hinos").select("id, chave").eq("colecao", canal.id),
      `${canal.sigla}: existentes`,
    ) as { id: number; chave: string }[];
    const idByKey = new Map(existing.map((row) => [row.chave, row.id]));

    // Número do hinário ATUAL pelo título: o "Hino IASD 33" do vídeo é do hinário antigo
    // (no novo, o 33 é outro hino). Título repetido no HASD (variações A/B) fica sem número.
    const hasd = check(
      await db.from("coletanea_hinos").select("numero, titulo").eq("colecao", "hasd"),
      "HASD",
    ) as { numero: number; titulo: string }[];
    const numberByTitle = new Map<string, number | null>();
    for (const hymn of hasd) {
      const key = titleKey(hymn.titulo);
      numberByTitle.set(key, numberByTitle.has(key) ? null : hymn.numero);
    }

    const row = (videoId: string, title: string) => {
      const { titulo, antigo, detalhe } = parseChannelTitle(title, channelNames);
      const numero = numberByTitle.get(titleKey(titulo)) ?? null;
      // Sem par no hinário atual, o número antigo ainda ajuda quem o conhece de cor.
      const extra = numero == null && antigo != null ? `Hinário antigo nº ${antigo}` : null;
      const fullDetail = [detalhe, extra].filter(Boolean).join(" · ") || null;
      return {
        colecao: canal.id,
        chave: videoId,
        titulo,
        titulo_original: title,
        numero,
        detalhe: fullDetail,
        busca: slugify(`${titulo} ${fullDetail ?? ""}`),
        oculto: false,
      };
    };
    const updates = [...videos]
      .filter(([videoId]) => idByKey.has(videoId))
      .map(([videoId, title]) => ({ id: idByKey.get(videoId)!, ...row(videoId, title) }));
    const inserts = [...videos].filter(([videoId]) => !idByKey.has(videoId)).map(([videoId, title]) => row(videoId, title));

    await insertChunks("coletanea_hinos", updates);
    for (let i = 0; i < inserts.length; i += 500) {
      const created = check(
        await db.from("coletanea_hinos").insert(inserts.slice(i, i + 500), { defaultToNull: false }).select("id, chave"),
        `${canal.sigla}: novos`,
      ) as { id: number; chave: string }[];
      for (const item of created) idByKey.set(item.chave, item.id);
    }

    // Já importados que não passam mais no filtro: some da busca, mas não é apagado
    // (pode estar numa programação salva).
    const hidden = existing.filter((item) => !videos.has(item.chave)).map((item) => item.chave);
    for (let i = 0; i < hidden.length; i += 200) {
      check(
        await db.from("coletanea_hinos").update({ oculto: true }).eq("colecao", canal.id).in("chave", hidden.slice(i, i + 200)),
        `${canal.sigla}: ocultar`,
      );
    }

    const now = new Date().toISOString();
    await insertChunks(
      "coletanea_videos",
      [...videos.keys()].map((videoId) => ({ hino_id: idByKey.get(videoId)!, video_id: videoId, atualizado_em: now })),
    );
    log.push(
      `${canal.sigla}: ${videos.size} vídeos de hino (${inserts.length} novos, ${updates.length} atualizados; ${all.size - videos.size} fora do filtro, ${hidden.length} ocultos)`,
    );
  }

  await touch("hinario");
  await touch("videos");
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
    if (alvo === "canais" || alvo === "tudo") await importarCanais(log);
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
