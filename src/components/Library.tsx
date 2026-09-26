import { useDeferredValue, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Star, X } from 'lucide-react';
import { useApp } from '@/store/useApp';
import { useLibrary } from '@/store/useLibrary';
import { contentKey, contentNames, hymnContent, type Content } from '@/lib/content';
import { parseReference, passageReference } from '@/lib/bible';
import { normalize } from '@/lib/utils';
import { parseVideoId, thumbnailUrl } from '@/lib/youtube';
import { musicLibrary } from '@/lib/music';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { HymnSearch } from './HymnSearch';
import { BibleSearch } from './BibleSearch';
import { MediaLibrary } from './MediaLibrary';
import { WorshipTools } from './WorshipTools';

export function ContentRow({ item, onChoose }: { item: Content; onChoose?: () => void }) {
  const favorite = useApp(s => s.favorites.some(f => contentKey(f) === contentKey(item)));
  return <div className="content-row">
    {item.kind === 'youtube' && <img loading="lazy" src={thumbnailUrl(item.videoId)} alt="" className="h-10 w-16 object-cover" />}
    <button className="min-w-0 flex-1 text-left" onClick={() => { useApp.getState().prepare(item); onChoose?.(); }}>
      <span className="block truncate text-sm">{item.title}</span>
      <span className="hint">{item.kind === 'youtube' ? item.category ? `Instrumental · ${item.category}` : item.collection ?? 'Vídeo YouTube' : contentNames[item.kind]}</span>
    </button>
    <Button size="icon" variant="ghost" onClick={() => useApp.getState().toggleFavorite(item)} aria-label={favorite ? 'Remover dos favoritos' : 'Favoritar'}><Star size={15} fill={favorite ? 'currentColor' : 'none'} /></Button>
    <Button size="sm" variant="secondary" onClick={() => useApp.getState().addContent(item)} title="Adicionar ao roteiro">+</Button>
  </div>;
}

function MusicLibrary() {
  const [collection, setCollection] = useState('Adoradores 4');
  const [term, setTerm] = useState('');
  const custom = useLibrary(s => s.custom);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Vídeos adicionados');
  const [message, setMessage] = useState('');
  const music = [...musicLibrary, ...custom];
  const collections = [...new Set(music.map(i => i.kind === 'youtube' ? i.collection ?? 'Vídeos adicionados' : contentNames[i.kind]))];
  return <div className="library-scroll">
    <label className="field-label">Coletânea / biblioteca<select value={collection} onChange={e => setCollection(e.target.value)}>{collections.map(c => <option key={c}>{c}</option>)}</select></label>
    <Input placeholder="Buscar música ou instrumental" value={term} onChange={e => setTerm(e.target.value)} />
    <div className="my-3">{music.filter(i => i.kind === 'youtube' && (term ? normalize(i.title).includes(normalize(term)) : (i.collection ?? 'Vídeos adicionados') === collection)).map(i => <ContentRow key={contentKey(i)} item={i} />)}</div>
    <p className="hint">Seleções oficiais: Gravadora Novo Tempo e Novo Tom. Instrumentais: Gravadora Novo Tempo e Matheus Rizzo. Reprodução pelo YouTube; requer internet.</p>
    <details className="mt-5"><summary>Adicionar vídeo / instrumental por link</summary><div className="tools-panel">
      <label>Título<input value={title} onChange={e => setTitle(e.target.value)} /></label>
      <label>Link do YouTube<input value={url} onChange={e => setUrl(e.target.value)} /></label>
      <label>Biblioteca<select value={category} onChange={e => setCategory(e.target.value)}><option>Vídeos adicionados</option><option>Instrumentais</option></select></label>
      <Button disabled={!title.trim() || !parseVideoId(url)} onClick={() => {
        const videoId = parseVideoId(url); if (!videoId) return;
        const item: Content = { kind: 'youtube', title: title.trim(), videoId, collection: category, ...(category === 'Instrumentais' ? { category: 'Adicionado por você' } : {}) };
        useLibrary.getState().add(item); useApp.getState().prepare(item); setCollection(category); setUrl(''); setTitle(''); setMessage('Vídeo salvo na biblioteca.');
      }}>Salvar e preparar</Button>
      {message && <p role="status" className="hint">{message}</p>}
    </div></details>
  </div>;
}

export function Library() {
  const [tab, setTab] = useState('Hinário');
  const favorites = useApp(s => s.favorites), recent = useApp(s => s.recent);
  return <section className="library-panel">
    <div className="panel-heading">BIBLIOTECA</div>
    <nav className="library-tabs" aria-label="Tipos de conteúdo">{['Hinário', 'Bíblia', 'Músicas', 'Mídia', 'Ferramentas', 'Favoritos'].map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}</nav>
    <div className="min-h-0 flex-1">{tab === 'Hinário' && <HymnSearch />}{tab === 'Bíblia' && <BibleSearch />}{tab === 'Músicas' && <MusicLibrary />}{tab === 'Mídia' && <MediaLibrary />}
      <div className={tab === 'Ferramentas' ? 'h-full' : 'hidden'}><WorshipTools /></div>
      {tab === 'Favoritos' && <div className="library-scroll"><h3>Favoritos</h3>{favorites.length ? favorites.map(i => <ContentRow key={contentKey(i)} item={i} />) : <p className="hint">Use a estrela no Preview para guardar um conteúdo aqui.</p>}<h3 className="mt-6">Recentes</h3>{recent.map(i => <ContentRow key={contentKey(i)} item={i} />)}</div>}
    </div>
  </section>;
}

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [term, setTerm] = useState('');
  const query = useDeferredValue(normalize(term).trim());
  const hymns = useApp(s => s.hymns), bible = useApp(s => s.bible), plans = useApp(s => s.savedPlans), recent = useApp(s => s.recent);
  const { media, custom } = useLibrary();
  const results = useMemo(() => {
    if (!query) return recent;
    const pool: Content[] = [...hymns.map(hymnContent), ...musicLibrary, ...media.map(m => m.content), ...custom];
    const ref = parseReference(bible, query);
    const found = pool.filter(i => query.split(/\s+/).every(q => normalize(i.title + (i.kind === 'youtube' ? ` ${i.collection ?? ''} ${i.category ?? ''}` : '')).includes(q)) || i.kind === 'hymn' && /^\d+$/.test(query) && hymns.find(h => h.id === i.hymnId)?.number === Number(query)).slice(0, 50);
    if (ref) found.unshift({ kind: 'passage', title: passageReference(bible, ref), ref: { ...ref, verseEnd: ref.verseStart } });
    return found;
  }, [query, hymns, bible, media, custom, recent]);
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-40 bg-black/75" /><Dialog.Content className="search-dialog">
    <div className="flex items-center justify-between"><Dialog.Title>Buscar em toda a central</Dialog.Title><Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Fechar busca"><X size={18} /></Button></Dialog.Close></div>
    <Dialog.Description className="hint">Selecione para preparar. O conteúdo no ar permanece.</Dialog.Description>
    <Input autoFocus value={term} onChange={e => setTerm(e.target.value)} placeholder="Hino 12, mais perto, João 3:16, apresentação…" onKeyDown={e => { if (e.key === 'Enter' && results[0]) { useApp.getState().prepare(results[0]); onOpenChange(false); } }} />
    <div className="search-results">{results.map(i => <ContentRow key={contentKey(i)} item={i} onChoose={() => onOpenChange(false)} />)}
      {query && plans.filter(p => normalize(p.name).includes(query)).map(plan => <button className="content-row w-full text-left" key={plan.id} onClick={() => {
        const s = useApp.getState(); if (s.planDirty && s.setlist.length && !confirm('Substituir o roteiro atual não salvo por esta programação?')) return;
        s.loadServicePlan(plan.id); onOpenChange(false);
      }}>Programação · {plan.name}</button>)}
      {!results.length && <p className="hint p-4">Digite um número, título ou referência bíblica.</p>}
    </div>
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}
