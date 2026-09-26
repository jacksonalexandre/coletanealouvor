import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { church, norm, verify, lyric, contextMatches, titleMatches } from './research-music.mjs';
const path=new URL('../src/data/music/catalog.json',import.meta.url);
const d=JSON.parse(await readFile(path,'utf8'));
if(process.argv[2]==='recover-candidates') {
 const corrections={'jovem-1993-3':'Com Jesus em Meu Caminho','jovem-2001-8':'Estende a Tua Mão','jovem-2007-5':'Quando Eu Olho Pra Você','jovem-2011-10':'Não Há Nada Comparado','jovem-2015-9':'Hoje é Dia de Louvar'};
 for(const t of d.tracks)if(corrections[t.id]){t.alternateTitles=[...new Set([...(t.alternateTitles??[]),t.title])];t.title=corrections[t.id];}
 for(const c of d.collections.filter(c=>c.source.includes('iasdermelinda'))) {
  const original=(await church(c.source)).album;
  for(const t of d.tracks.filter(t=>t.collectionId===c.id&&!t.candidateId)) {
   const source=original.songs.find(s=>[t.title,...(t.alternateTitles??[])].some(a=>norm(a)===norm(s.title)));
   if(source?.youtube_id)t.candidateId=source.youtube_id;
  }
 }
 // Keep a proven lyric video in preference to a new non-lyric fallback, when the
 // exact song and collection context agree. No speculative cross-album restores.
 const previous=JSON.parse(spawnSync('git',['show','fbe2232:src/data/music/catalog.json'],{encoding:'utf8',maxBuffer:8e6}).stdout);
 for(const t of d.tracks.filter(t=>!t.lyrics)) {
  const old=previous.tracks.find(o=>o.id===t.id&&o.lyrics);
  const c=d.collections.find(c=>c.id===t.collectionId);
  if(old&&titleMatches(t.title,old.verification.title)&&contextMatches(t,c,old.verification)) {
   t.videoId=old.videoId;t.lyrics=true;t.verification=old.verification;t.availability='verified';
  }
 }
 const hymnVersions=new Set(['jovem-1992-2','jovem-1994-5','jovem-1994-6','jovem-1995-6','jovem-1996-7','jovem-1998-11','jovem-1999-3','jovem-1999-8','jovem-2000-6','jovem-2001-1','jovem-2001-3','jovem-2002-5','jovem-2002-10','jovem-2003-1','jovem-2004-1','jovem-2005-6','jovem-2006-3','jovem-2006-5','jovem-2006-7','jovem-2007-6','jovem-2007-3','jovem-2008-1','jovem-2008-6','jovem-2009-1','jovem-2009-4','jovem-2010-14','jovem-2011-5','jovem-2014-5','jovem-2014-6','jovem-2015-2']);
 for(const t of d.tracks.filter(t=>hymnVersions.has(t.id)&&!t.lyrics)) {
  const old=previous.tracks.find(o=>o.id===t.id&&o.lyrics&&o.verification.publisher==='Casa Publicadora Brasileira');
  if(old){t.videoId=old.videoId;t.lyrics=true;t.verification=old.verification;t.availability='verified';t.recordingNote='Versão com letra do Hinário Adventista (CPB), não a gravação original deste CD.';}
 }
} else if(process.argv[2]==='merge') {
 const supplement=JSON.parse(await readFile(new URL('../.music-research/supplement.json',import.meta.url),'utf8'));
 for(const c of supplement.collections)if(!d.collections.some(x=>x.id===c.id))d.collections.push(c);
 for(const t of supplement.tracks) {
   t.title=t.title.replace(/\s*\(Lyrics\)\s*$/i,'');
   if(!d.tracks.some(x=>x.id===t.id))d.tracks.push(t);
 }
 // A distinct extended recording was collapsed by the first source importer.
 if(!d.tracks.some(t=>t.id==='jovem-me-ama-2023-extended')) {
  const v=await verify('_gJUFjXxwvs');
  if(v)d.tracks.push({id:'jovem-me-ama-2023-extended',collectionId:'jovem-me-ama-2023',title:'Me Ama (Versão Extendida)',track:12,tags:['JA','Jovens'],source:'https://www.cifraclub.com/ministerio-jovem/discografia.html',videoId:v.videoId,lyrics:false,availability:'verified',verification:{...v,method:'youtube-oembed',lyricEvidence:null}});
 }
 for(const t of d.tracks) {
  if(t.id==='jovem-me-ama-2023-extra-2')t.track=2;
  t.availability=t.videoId?'verified':'unmapped';
  const c=d.collections.find(c=>c.id===t.collectionId);
  if(t.videoId&&lyric(t.verification.title)){t.lyrics=true;t.verification.lyricEvidence??='title';}
  if(/doxologia|ofertorio|entrego a ti|tudo entregarei|te agradeco|eu me ofereco/.test(norm(t.title)))t.tags=[...new Set([...t.tags,'Ofertas / Doxologia'])];
  if(c.id==='jovem-1996'){c.orderKnown=true;c.additionalSource='https://www.cifraclub.com/ministerio-jovem/discografia.html';}
  if(t.collectionId==='turma-do-nosso-amiguinho-cante-com-a-gente-vol-3'&&norm(t.title)==='eu gosto de goiaba')t.alternateTrackNumbers=[7];
 }
 d.researchedAt=new Date().toISOString().slice(0,10);
}
await writeFile(path,JSON.stringify(d,null,2)+'\n');
console.log(process.argv[2],d.collections.length,d.tracks.length);
