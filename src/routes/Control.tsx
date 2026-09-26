import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Setlist } from '@/components/Setlist';
import { ShortcutsHelp } from '@/components/ShortcutsHelp';
import { TopBar } from '@/components/TopBar';
import { Transport } from '@/components/Transport';
import { Library, GlobalSearch } from '@/components/Library';
import { SessionRecovery } from '@/components/SessionRecovery';
import { useControlLink } from '@/lib/useLive';
import { useApp } from '@/store/useApp';
import { useLibrary } from '@/store/useLibrary';

export default function Control() {
  useControlLink();
  const boot = useApp(s => s.boot), loading = useApp(s => s.loading), error = useApp(s => s.error), simple = useApp(s => s.simpleMode);
  const [help, setHelp] = useState(false), [search, setSearch] = useState(false), [storageError, setStorageError] = useState(false);
  useEffect(() => { void boot(); void useLibrary.getState().refresh(); }, [boot]);
  useEffect(() => { const onFailure = () => setStorageError(true); window.addEventListener('storage-failure', onFailure); return () => window.removeEventListener('storage-failure', onFailure); }, []);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(true); return; }
      if (help || search || document.querySelector('[role="dialog"]')) return;
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"], [role="slider"]') || e.ctrlKey || e.metaKey || e.altKey) return;
      if ((e.key === 'Enter' || e.key === ' ') && target.closest('button, a, summary')) return;
      const s = useApp.getState();
      if (e.key === 'Enter') { e.preventDefault(); void s.putOnAir(); }
      else if (e.key === ' ') { e.preventDefault(); if (s.liveContent?.kind === 'timer') s.controlTimer(s.liveContent.endsAt ? 'pause' : 'start', 'live'); else s.toggle(); }
      else if (['ArrowRight', 'PageDown', 'n'].includes(e.key)) { e.preventDefault(); s.stepLive(1); }
      else if (['ArrowLeft', 'PageUp', 'p'].includes(e.key)) { e.preventDefault(); s.stepLive(-1); }
      else if (e.key.toLowerCase() === 'b') s.setBlank(!s.blank);
      else if (e.key === '?') setHelp(true);
    };
    window.addEventListener('keydown', keydown); return () => window.removeEventListener('keydown', keydown);
  }, [help, search]);
  return <div className={`console-shell ${simple ? 'simple-mode' : ''}`}>
    <TopBar onShowShortcuts={() => setHelp(true)} />
    <div className="console-toolbar"><button className="global-search-trigger" onClick={() => setSearch(true)}><Search size={16} /><span>Buscar hino, Bíblia, música, arquivo…</span><kbd>Ctrl K</kbd></button><label className="simple-toggle"><input type="checkbox" checked={simple} onChange={e => useApp.getState().setSimpleMode(e.target.checked)} />Modo simples</label></div>
    {loading && <p role="status" className="session-notice">Carregando biblioteca… Você já pode preparar textos e arquivos.</p>}
    {error && <p role="alert" className="session-notice">Não foi possível carregar o hinário.<Button size="sm" onClick={() => void boot()}>Tentar novamente</Button></p>}
    {storageError && <p role="alert" className="session-notice">Não foi possível salvar neste navegador. Mantenha esta janela aberta e verifique o espaço disponível.</p>}
    {!loading && <SessionRecovery />}
    <main className="console-main"><Library /><Transport /><aside className="service-panel"><Setlist /></aside></main>
    <footer className="console-footer"><span>1. Buscar e preparar</span><span>2. Conferir Preview</span><span>3. Colocar no ar</span><span>B · Apagar tela</span></footer>
    <GlobalSearch open={search} onOpenChange={setSearch} /><ShortcutsHelp open={help} onOpenChange={setHelp} />
  </div>;
}
