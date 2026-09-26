import { create } from "zustand";
import { listMedia, type MediaEntry } from "@/lib/media";
import { local } from "@/lib/storage";
import { isContent, type Content } from "@/lib/content";

type Library = {
  media: MediaEntry[];
  custom: Content[];
  error: string | null;
  refresh: () => Promise<void>;
  add: (content: Content) => void;
};
export const useLibrary = create<Library>((set, get) => ({
  media: [],
  custom: local.get<unknown[]>("custom-library", []).filter(isContent),
  error: null,
  async refresh() {
    try {
      set({
        media: (await listMedia()).sort((a, b) => b.createdAt - a.createdAt),
        error: null,
      });
    } catch {
      set({
        error:
          "Não foi possível abrir os arquivos salvos. Verifique o armazenamento nas configurações do navegador.",
      });
    }
  },
  add(content) {
    const custom = [...get().custom, content];
    local.set("custom-library", custom);
    set({ custom });
  },
}));
