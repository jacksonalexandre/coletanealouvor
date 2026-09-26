// Build-time metadata research only. Never downloads audio, video, artwork or lyrics.
// Run: node scripts/research-music.mjs inventory|map|report
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const cache = new URL('.music-research/', root);
const output = new URL('src/data/music/catalog.json', root);
await mkdir(cache, { recursive: true });
await mkdir(new URL('src/data/music/', root), { recursive: true });
export const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const slug = s => norm(s).replaceAll(' ', '-');
const date = new Date().toISOString().slice(0,10);
async function request(url) {
  let response;
  for(let attempt=0;attempt<3;attempt++) {
    try { response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'Accept-Language': 'pt-BR,pt;q=0.9', Connection:'close' } }); break; }
    catch(error) { if(attempt===2)throw new Error(`${error.message}: ${error.cause?.code??''}`); await new Promise(r=>setTimeout(r,500)); }
  }
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}
async function cached(key, run) {
  const path = new URL(createHash('sha256').update(key).digest('hex')+'.json', cache);
  try { return JSON.parse(await readFile(path,'utf8')); } catch {}
  const value = await run();
  await writeFile(path, JSON.stringify(value));
  return value;
}
const decode = s => s.replaceAll('&quot;','"').replaceAll('&#039;',"'").replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>');
async function church(url) {
  return cached(url, async () => JSON.parse(decode((await (await request(url)).text()).match(/data-page="([^"]+)"/)[1])).props);
}
async function discography(artist) {
  const url = `https://www.cifraclub.com/${artist}/discografia.html`;
  return cached(url, async () => {
    const html = await (await request(url)).text();
    const chunks = [...html.matchAll(/self\.__next_f\.push\((\[.*?\])\)<\/script>/gs)].map(m=>{try{return JSON.parse(m[1])[1]||''}catch{return ''}}).join('');
    const start = chunks.indexOf('"albums":');
    if(start<0) return [];
    const input = chunks.slice(start+9); let depth=0, quoted=false, escaped=false;
    for(let i=0;i<input.length;i++) {
      const c=input[i];
      if(escaped){escaped=false;continue;} if(c==='\\'&&quoted){escaped=true;continue;} if(c==='"'){quoted=!quoted;continue;} if(quoted)continue;
      if(c==='[')depth++; if(c===']'&&--depth===0) {
        return JSON.parse(input.slice(0,i+1)).map(a=>({ title:a.title, year:a.releaseYear, source:url,
          tracks:a.discs.flatMap(d=>d.songs.map(t=>({ title:t.name, track:t.order }))) }));
      }
    }
    throw new Error('Album metadata changed');
  });
}
export async function search(query) {
  return cached('search:'+query, async()=>{
    const html = await(await request('https://www.youtube.com/results?search_query='+encodeURIComponent(query))).text();
    const data = JSON.parse(html.match(/var ytInitialData = (.*?);<\/script>/s)[1]);
    const videos=[];
    function visit(o){if(!o||typeof o!=='object')return;if(o.videoRenderer){const v=o.videoRenderer; videos.push({videoId:v.videoId,title:v.title?.runs?.map(r=>r.text).join('')||'',publisher:v.ownerText?.runs?.map(r=>r.text).join('')||'',duration:v.lengthText?.simpleText||''});}for(const v of Object.values(o))if(typeof v==='object')visit(v);}
    visit(data); return videos;
  });
}
export async function verify(videoId) {
  return cached('oembed:'+videoId,async()=>{
    try { const data=await(await request('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/watch?v='+videoId))).json();
      return {videoId,title:data.title,publisher:data.author_name,source:'https://www.youtube.com/watch?v='+videoId,checkedAt:date};
    } catch { return null; }
  });
}
const official = s => /gravadorant|gravadora novo tempo|feliz7play|adventistas|casa publicadora brasileira|nt kids|ministerio jovem|ministerio da musica|novo tom|daniel ludtke|tia ceceu|nosso amiguinho|arautos do rei|vocal livre/.test(norm(s));
const lyric = s => /\b(letra|letras|lyrics|lyric|legendado|legenda|multimidia)\b/.test(norm(s));
function match(title, videoTitle) {
  const a=norm(title).replace(/\b(medley|pt|part|vol|i|ii)\b/g,'').trim();
  const b=norm(videoTitle);
  if(b.includes(a) && a.length>2) return true;
  const words=a.split(' ').filter(w=>w.length>2);
  return words.length>=2 && words.every(w=>b.includes(w));
}
async function save(data) { await writeFile(output, JSON.stringify(data,null,2)+'\n'); }
const action = process.argv[2];
if(action==='inventory') {
  const data={researchedAt:date,collections:[],tracks:[]};
  const list=Object.values((await church('https://iasdermelinda.com.br/musicas/albuns')).list);
  const allowed=/Ministério (?:Jovem|JA|da Mulher|de louvor)|Adoradores|Celebra São Paulo|Momentos de louvor|Daniel Lüdtke|Acústico Novo Tempo|Semana Santa|Pôr do sol|Arautos do Rei|Prisma Brasil|Grupo Novo Tempo|Coral Jovem|Até que Ele venha|Na presença de Deus|Na trilha da conquista|Viva em Mim/;
  for(const a of list.filter(a=>allowed.test(a.name))) {
    const album=(await church(a.detail_url)).album;
    const year=Number(a.name.match(/(?:19|20)\d\d/)?.[0])||undefined;
    const group=/Ministério (?:Jovem|JA)/.test(a.name)?'youth':/Minha vida é uma viagem|Jesus, luz do mundo|Filhos de Israel/.test(a.name)?'children':'collections';
    const id=group==='youth'?`jovem-${year}`:slug(a.name);
    data.collections.push({id,title:a.name.replace('Ensima-me','Ensina-me'),year,group,source:a.detail_url,orderKnown:false});
    for(const [i,t] of album.songs.entries()) data.tracks.push({id:`${id}-${i+1}`,title:t.title.trim(),collectionId:id,tags:group==='youth'?['JA','Jovens']:group==='children'?['Adoração Infantil']:[],source:a.detail_url,candidateId:t.youtube_id||undefined});
    console.log(id,album.songs.length);
  }
  for(const album of await discography('ministerio-jovem')) {
    const main=data.collections.find(c=>c.group==='youth'&&c.year===album.year && (norm(c.title).includes(norm(album.title)) || album.year<2016 && !/II|Escolhido|Minha Entrega/.test(album.title)));
    const id=main?.id??`jovem-${slug(album.title)}-${album.year}`;
    if(!main) data.collections.push({id,title:`Ministério Jovem ${album.year} · ${album.title}`,year:album.year,group:'youth',source:album.source,orderKnown:true});
    else {main.additionalSource=album.source;main.orderKnown=true;}
    for(const t of album.tracks) {
      const existing=data.tracks.find(x=>x.collectionId===id && norm(x.title.replace(/\(.*?\)/g,''))===norm(t.title.replace(/\(.*?\)/g,'')));
      if(existing)existing.track=t.track;
      else data.tracks.push({id:`${id}-extra-${t.track}`,title:t.title,track:t.track,collectionId:id,tags:['JA','Jovens'],source:album.source});
    }
  }
  for(const artist of ['tia-ceceu','turma-do-nosso-amiguinho']) {
    for(const album of await discography(artist)) {
      if(/playback|instrumental/i.test(album.title))continue;
      const id=slug(artist+'-'+album.title);
      data.collections.push({id,title:`${artist==='tia-ceceu'?'Tia Cecéu':'Turma do Nosso Amiguinho'} · ${album.title}`,year:album.year,group:'children',source:album.source,orderKnown:true});
      for(const t of album.tracks)data.tracks.push({id:`${id}-${t.track}`,title:t.title,track:t.track,collectionId:id,tags:['Adoração Infantil'],source:album.source});
    }
  }
  await save(data); console.log('INVENTORY',data.collections.length,data.tracks.length);
}
if(action==='map') {
  const data=JSON.parse(await readFile(output,'utf8'));
  let done=0; const queue=data.tracks.filter(t=>!t.verification);
  async function worker(){while(queue.length){const t=queue.shift(),c=data.collections.find(c=>c.id===t.collectionId);
    try {
      const context=c.group==='youth'?`CD Jovem ${c.year}`:c.title;
      const hits=await search(`${t.title} ${context} letra`);
      if(t.candidateId){const v=await verify(t.candidateId);if(v)hits.push(v);}
      const candidates=hits.filter(v=>match(t.title,v.title)&&!/(?:playback|karaoke|tutorial|aula|completo|1 hora|3 horas|piano cover)/i.test(v.title))
        .filter(v=>official(v.publisher)||/jovem|adventista|adoradores|novo tempo|novo tom|ceceu|amiguinho|ludtke|arautos|prisma|coral|iasd|coletanea/i.test(norm(v.title+' '+v.publisher))||v.videoId===t.candidateId)
        .map(v=>({...v,score:(lyric(v.title)?100:0)+(official(v.publisher)?40:0)+(norm(v.title).includes(String(c.year))?15:0)+(v.videoId===t.candidateId?10:0)})).sort((a,b)=>b.score-a.score);
      for(const v of candidates.slice(0,4)) {const verified=await verify(v.videoId);if(!verified||!match(t.title,verified.title))continue;
        t.videoId=v.videoId;t.lyrics=lyric(verified.title);t.verification={...verified,method:'youtube-oembed',lyricEvidence:t.lyrics?'title':null};break;}
      t.availability=t.videoId?'verified':'unmapped';
    }catch(error){t.availability='unmapped';console.log('RETRY',t.id,error.message);}
    if(++done%20===0){await save(data);console.log('MAPPED',done,'/',data.tracks.length,'available',data.tracks.filter(t=>t.videoId).length);}
  }}
  await Promise.all([worker(),worker()]);await save(data);
}
