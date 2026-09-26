// Additional curated research; stage separately so the main mapper can checkpoint safely.
import { readFile, writeFile } from 'node:fs/promises';
import { search, verify, lyric, norm } from './research-music.mjs';
const path=new URL('../.music-research/supplement.json',import.meta.url);
let data;try{data=JSON.parse(await readFile(path,'utf8'));}catch{data={collections:[],tracks:[]};}
const save=()=>writeFile(path,JSON.stringify(data,null,2)+'\n');
async function add(collection, videoId, title, tags=[], track) {
 if(data.tracks.some(t=>t.videoId===videoId))return;
 const v=await verify(videoId);if(!v)return;
 if(!data.collections.some(c=>c.id===collection.id))data.collections.push({...collection,source:v.source,orderKnown:false,inventoryScope:'selection'});
 data.tracks.push({id:`${collection.id}-${videoId}`,title:title??v.title,collectionId:collection.id,track,tags,source:v.source,videoId,lyrics:lyric(v.title),availability:'verified',verification:{...v,method:'youtube-oembed',lyricEvidence:lyric(v.title)?'title':null}});
 await save();console.log(collection.id,title??v.title);
}
const children={id:'infantil-cpb',title:'Adoração Infantil · Hinário Adventista (CPB)',group:'children'};
const offering={id:'ofertas-cpb',title:'Ofertas, gratidão e doxologia · CPB',group:'offering'};
for(const number of [...Array.from({length:47},(_,i)=>510+i),...Array.from({length:23},(_,i)=>564+i),587,305,310,326,346,347,348,349,351,391]) {
 if(data.tracks.some(t=>t.track===number&&t.collectionId===(number<=556&&number>=510||number===587?children.id:offering.id)))continue;
 const found=await search(`Novo Hinario Adventista Hino ${number} Lyrics Casa Publicadora Brasileira`);
 const hit=found.find(v=>norm(v.publisher)==='casa publicadora brasileira'&&new RegExp(`hino ${number}\\b`).test(norm(v.title))&&lyric(v.title));
 if(!hit)continue;
 const isChild=(number>=510&&number<=556)||number===587;
 const title=hit.title.split('•')[2]?.trim();
 if(title)await add(isChild?children:offering,hit.videoId,title,isChild?['Adoração Infantil','Escola Sabatina']:['Ofertas / Doxologia','Gratidão','Dedicação'],number);
}
for(const [year,query,expected] of [[2023,'EU VOU TEMA JA 2023 letra','eu vou'],[2024,'MARANATA TEMA JA 2024 letra','maranata'],[2025,'MARANATA TEMA JA 2025 letra','maranata']]) {
 const found=await search(query);
 const hits=found.filter(v=>norm(v.title).includes(String(year))&&norm(v.title).includes(expected)&&!norm(v.title).includes('playback')).sort((a,b)=>(Number(lyric(b.title))*10+Number(norm(b.publisher).includes('feliz7play'))*5)-(Number(lyric(a.title))*10+Number(norm(a.publisher).includes('feliz7play'))*5));
 if(hits[0])await add({id:`jovem-${year}`,title:`Tema JA ${year} · ${expected==='maranata'?'Maranata':'Eu Vou'}`,year,group:'youth'},hits[0].videoId,expected==='maranata'?'Maranata':'Eu Vou',['JA','Jovens','Missão']);
}
for(const query of ['Vocal Livre Video Lyric Letra Cifra','Vocal Livre letra Salmo Nova Cancao Autor Vida','Novo Tom video letra','Arautos do Rei video lyric letra','Adoracao Infantil entrada saida ARF']) {
 const hits=await search(query);
 for(const v of hits) {
  const publisher=norm(v.publisher);
  const vocal=publisher==='vocal livre';
  const tom=publisher==='novo tom';
  const arautos=publisher.includes('arautos do rei');
  const child=publisher==='adventistas rio fluminense'&&norm(v.title).includes('adoracao infantil');
  if((vocal||tom||arautos)&&lyric(v.title)&&!(/playback|karaoke|completo/i.test(v.title))) {
   const artist=vocal?'Vocal Livre':tom?'Novo Tom':'Arautos do Rei';
   await add({id:'selecao-'+norm(artist).replaceAll(' ','-'),title:artist+' · vídeos com letra',group:'other'},v.videoId,v.title,['Adoração','Apelo','Encerramento']);
  }else if(child)await add({id:'adoracao-infantil-arf',title:'Adoração Infantil · Entrada e saída (ARF)',group:'children'},v.videoId,v.title,['Adoração Infantil']);
 }
}
for(const [artist,videoId,title] of [
 ['Novo Tom','qBcVz65OXi0','O Melhor Lugar do Mundo'],
 ['Novo Tom','RgMw9wwUmLs','Cristo'],
 ['Novo Tom','RgsBFZpA76A','Tudo o Que Há'],
 ['Novo Tom','T_FEGlF_OQ4','Deus Tudo Pode'],
 ['Novo Tom','IJNEkmdD4r0','Na Presença do Rei'],
 ['Arautos do Rei','2iKc4KjrcS4','O Milagre do Amor'],
 ['Arautos do Rei','7CunimW9-yg','Maior Amor'],
]) await add({id:'selecao-'+norm(artist).replaceAll(' ','-'),title:artist+' · vídeos com letra',group:'other'},videoId,title,['Adoração','Apelo']);
for(const [id,title] of [['fOR2BvQGCTw','Jader Santos · 3 horas de piano'],['9sJxWBf6w-s','1 hora instrumental piano · A sós com Deus']])await add({id:'instrumentais',title:'Instrumentais',group:'instrumental'},id,title,['Oração','Prelúdio']);
await save();console.log('SUPPLEMENT',data.collections.length,data.tracks.length);
