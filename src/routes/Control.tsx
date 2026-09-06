import { useEffect, useState } from "react";
import { ListMusic, Radio, Search } from "lucide-react";
import { HymnSearch } from "@/components/HymnSearch";
import { Setlist } from "@/components/Setlist";
import { TopBar } from "@/components/TopBar";
import { Transport } from "@/components/Transport";
import { useControlLink } from "@/lib/useLive";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";

type Tab = "buscar" | "roteiro" | "ao-vivo";

export default function Control() {
  useControlLink();
  useShortcuts();

  const loading = useApp((state) => state.loading);
  const error = useApp((state) => state.error);
  const boot = useApp((state) => state.boot);
  const [tab, setTab] = useState<Tab>("buscar");

  useEffect(() => {
    void boot();
  }, [boot]);

  if (loading) return <Splash message="Carregando o hinário…" />;
  if (error) return <Splash message={`Não foi possível carregar o hinário: ${error}`} />;

  return (
    <div className="flex h-dvh flex-col bg-ink-950">
      <TopBar />

      {/* Desktop: busca, roteiro e comando lado a lado. Mobile: uma aba por vez. */}
      <main className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_280px_360px]">
        <section
          className={cn(
            "min-h-0 border-ink-800 lg:border-r",
            tab === "buscar" ? "block" : "hidden lg:block",
          )}
        >
          <HymnSearch />
        </section>

        <section
          className={cn(
            "min-h-0 border-ink-800 lg:border-r",
            tab === "roteiro" ? "block" : "hidden lg:block",
          )}
        >
          <Setlist />
        </section>

        <section className={cn("min-h-0", tab === "ao-vivo" ? "block" : "hidden lg:block")}>
          <Transport />
        </section>
      </main>

      <nav className="flex border-t border-ink-800 bg-ink-900 lg:hidden">
        <TabButton
          icon={<Search className="size-5" />}
          label="Buscar"
          active={tab === "buscar"}
          onClick={() => setTab("buscar")}
        />
        <TabButton
          icon={<ListMusic className="size-5" />}
          label="Roteiro"
          active={tab === "roteiro"}
          onClick={() => setTab("roteiro")}
        />
        <TabButton
          icon={<Radio className="size-5" />}
          label="Ao vivo"
          active={tab === "ao-vivo"}
          onClick={() => setTab("ao-vivo")}
        />
      </nav>
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]",
        active ? "text-brand-400" : "text-ink-400",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Splash({ message }: { message: string }) {
  return (
    <div className="flex h-dvh items-center justify-center px-6 text-center text-sm text-ink-400">
      {message}
    </div>
  );
}

function useShortcuts() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      const store = useApp.getState();
      const key = event.key.toLowerCase();

      if (event.key === " ") {
        event.preventDefault();
        store.toggle();
      } else if (event.key === "ArrowRight" || event.key === "PageDown" || key === "n") {
        store.stepHymn(1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp" || key === "p") {
        store.stepHymn(-1);
      } else if (key === "b") {
        store.setBlank(!store.blank);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
