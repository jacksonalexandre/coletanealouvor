import { useMemo, useState } from "react";
import { musicCollections, musicTracks, musicSearchText, trackContent } from "@/lib/music";
import { normalize } from "@/lib/utils";
import { thumbnailUrl } from "@/lib/youtube";
import { ContentRow } from "./Library";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const groups = [["youth", "CDs Jovens"], ["collections", "Coletâneas"], ["children", "Adoração Infantil"], ["offering", "Ofertas / Doxologia"], ["other", "Outras"]];
export function MusicCatalog() {
  const [group, setGroup] = useState("youth");
  const [album, setAlbum] = useState("");
  const [term, setTerm] = useState("");
  const [limit, setLimit] = useState(60);
  const query = normalize(term).trim().split(/\s+/).filter(Boolean);
  const found = useMemo(() => musicTracks.filter(t => query.length
    ? query.every(q => normalize(musicSearchText(t)).includes(q))
    : album ? t.collectionId === album
    : group === "offering" ? t.tags.includes("Ofertas / Doxologia") : false)
    .sort((a,b) => a.collectionId.localeCompare(b.collectionId) || (a.track ?? 999) - (b.track ?? 999)), [term, album, group]);
  const selected = musicCollections.find(c => c.id === album);
  const albums = musicCollections.filter(c => c.group === group).sort((a,b) => (a.year ?? 9999) - (b.year ?? 9999) || a.title.localeCompare(b.title));
  return <section className="music-catalog">
    <Input aria-label="Buscar no catálogo musical" placeholder="Música, álbum, ano ou categoria…" value={term} onChange={e => {setTerm(e.target.value);setLimit(60);}} />
    <nav className="music-categories" aria-label="Categorias de músicas">
      {groups.map(([value,label]) => <button key={value} aria-pressed={group===value && !term} onClick={() => {setGroup(value);setAlbum("");setTerm("");setLimit(60);}}>{label}</button>)}
    </nav>
    {!!album && !term && <Button variant="ghost" onClick={() => setAlbum("")}>← Voltar às coleções</Button>}
    {selected && !term && <h3 className="my-2 text-sm">{selected.title}</h3>}
    {query.length || album || group === "offering" ? <>
      <p className="hint my-2">{found.length} faixas · {found.filter(t=>t.videoId).length} com vídeo. Selecionar apenas prepara.</p>
      {found.slice(0,limit).map(t => { const content = trackContent(t); return <div key={t.id} className="catalog-track">
        <div className="catalog-track-meta" title={t.verification ? `${t.verification.title} · ${t.verification.publisher}` : undefined}>{t.track ? `Faixa ${String(t.track).padStart(2,"0")} · ` : ""}{t.videoId ? t.lyrics ? "Com letra · indicação do vídeo" : "Vídeo · letra não confirmada" : "Sem vídeo verificado"}</div>
        {content ? <ContentRow item={content} /> : <div className="content-row unavailable-track"><span>{t.title}<small>{musicCollections.find(c=>c.id===t.collectionId)?.title}</small></span><span className="hint">Indisponível</span></div>}
        {t.recordingNote && <p className="hint pb-2">{t.recordingNote}</p>}
      </div>; })}
      {!found.length && <p className="hint my-4">Nenhuma faixa encontrada. Tente o título, ano ou nome da coletânea.</p>}
      {found.length>limit && <Button variant="secondary" onClick={() => setLimit(limit+60)}>Mostrar mais faixas</Button>}
    </> : <div className="music-albums">{albums.map(c => {
      const tracks=musicTracks.filter(t=>t.collectionId===c.id),video=tracks.find(t=>t.videoId);
      return <button key={c.id} className="music-album" onClick={() => {setAlbum(c.id);setLimit(60);}}>
        {video?.videoId ? <img loading="lazy" src={thumbnailUrl(video.videoId)} alt="" /> : <span className="album-placeholder">♪</span>}
        <span>{c.title}<small>{tracks.length} faixas · {tracks.filter(t=>t.videoId).length} vídeos</small></span>
      </button>;
    })}</div>}
    <p className="hint mt-4">Vídeos externos do YouTube; requer internet. “Com letra” é indicado pelo título do vídeo. Confira a versão antes do culto. Faixas sem vídeo permanecem no inventário.</p>
  </section>;
}
