// Explicit corrections to source typos/duplicate aliases; preserves verified mappings.
import { readFile, writeFile } from 'node:fs/promises';
import { norm } from './research-music.mjs';
const path=new URL('../src/data/music/catalog.json',import.meta.url);
const d=JSON.parse(await readFile(path,'utf8'));
const corrections={
 'acustico-novo-tempo-3':'Firme nas promessas','adoradores-2-8':'Verei Jesus','adoradores-3-9':'Nas mãos do oleiro',
 'daniel-ludtke-minha-vida-e-uma-viagem-15':'Ressuscitou','ministerio-da-mulher-5':'Bela aos olhos de Deus',
 'jovem-1994-4':'Mais semelhante a Jesus','jovem-1999-2':'Oh, que esperança',
 'jovem-2001-2':'Medley: Quão Bom / Satisfação / O Amor Sem Deus É Passageiro',
 'jovem-2001-12':'Medley: Bendita Segurança / Tu És Fiel','jovem-2003-8':'Medley: Estou Seguindo / Jesus É Melhor',
 'jovem-2007-9':'Descobrindo Amigos','jovem-2010-13':'Tua Graça Cantarei','jovem-2013-3':'Vem Espírito Santo',
 'jovem-2018-4':'Nunca Mais Lágrimas','jovem-2019-9':'Mensagem da Cruz','jovem-2004-extra-5':'Nossa Inspiração',
 'jovem-2012-extra-12':'Santo És Senhor','jovem-2011-extra-5':'Amigos da Esperança','jovem-2011-extra-14':'Amigo de Verdade',
 'jovem-2010-extra-10':'Jovem com Poder','jovem-a-diferenca-e-cristo-vol-ii-1996-extra-2':'Em Pé na Congregação',
};
for(const t of d.tracks)if(corrections[t.id])t.title=corrections[t.id];
// The two 1996 sources describe the same album, not two releases.
for(const t of d.tracks)if(t.collectionId==='jovem-a-diferenca-e-cristo-vol-ii-1996')t.collectionId='jovem-1996';
d.collections=d.collections.filter(c=>c.id!=='jovem-a-diferenca-e-cristo-vol-ii-1996');
const pairs=[
 ['jovem-1993-3','jovem-1993-extra-3'],['jovem-1994-3','jovem-1994-extra-3'],['jovem-1995-7','jovem-1995-extra-7'],
 ['jovem-1997-9','jovem-1997-extra-3'],['jovem-1999-9','jovem-1999-extra-3'],['jovem-1999-8','jovem-1999-extra-5'],
 ['jovem-2000-11','jovem-2000-extra-4'],['jovem-2004-5','jovem-2004-extra-6'],['jovem-2007-5','jovem-2007-extra-6'],
 ['jovem-2011-10','jovem-2011-extra-9'],['jovem-2011-11','jovem-2011-extra-10'],['jovem-2012-9','jovem-2012-extra-9'],
 ['jovem-2013-7','jovem-2013-extra-9'],['jovem-2015-1','jovem-2015-extra-3'],
 ['jovem-1996-4','jovem-a-diferenca-e-cristo-vol-ii-1996-extra-1'],
];
function merge(a,b) {
 if(!a||!b||a===b)return;
 if((!a.videoId&&b.videoId)||(!a.lyrics&&b.lyrics)){a.videoId=b.videoId;a.lyrics=b.lyrics;a.verification=b.verification;a.availability=b.availability;}
 a.track??=b.track;a.candidateId??=b.candidateId;
 a.alternateTitles=[...new Set([...(a.alternateTitles??[]),b.title])].filter(s=>s!==a.title);
 d.tracks=d.tracks.filter(t=>t!==b);
}
for(const [a,b] of pairs)merge(d.tracks.find(t=>t.id===a),d.tracks.find(t=>t.id===b));
for(const c of d.collections) {
 const seen=new Map(),videos=new Map();
 for(const t of d.tracks.filter(t=>t.collectionId===c.id)) {
   const same=seen.get(norm(t.title)) || (t.videoId && videos.get(t.videoId));
   if(same)merge(same,t); else {seen.set(norm(t.title),t);if(t.videoId)videos.set(t.videoId,t);}
 }
 if(c.id==='daniel-ludtke-filhos-de-israel'||c.id==='daniel-ludtke-jesus-luz-do-mundo') {
   c.group='collections';for(const t of d.tracks.filter(t=>t.collectionId===c.id))t.tags=t.tags.filter(tag=>tag!=='Adoração Infantil');
 }
 // A church's selection is not evidence that these are complete releases.
 c.inventoryScope=/^(jovem-\d{4}|adoradores|celebra|acustico|daniel-ludtke-(?!minha)|momentos|ministerio-de-louvor|tia-ceceu|turma-do)/.test(c.id)?'identified-tracklist':'selection';
 if(c.id==='jovem-2020'||c.id==='jovem-2021'||c.id==='jovem-2022'||c.id==='jovem-2026')c.inventoryScope='annual-selection';
}
await writeFile(path,JSON.stringify(d,null,2)+'\n');
console.log('CURATED',d.collections.length,d.tracks.length);
