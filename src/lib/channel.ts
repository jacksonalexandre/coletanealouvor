import type { LiveState } from "@/lib/types";

export type ChannelMessage =
  | { type: "state"; state: LiveState }
  | { type: "hello" }
  | { type: "display-open" }
  | { type: "display-closed" }
  | { type: "command"; action: "next" | "prev" | "blank" };

const NAME = "coletanea-live";

/**
 * Canal entre a janela de controle e a janela de projeção. BroadcastChannel
 * cobre navegadores modernos; sem ele, caímos para eventos de `storage`, que
 * funcionam entre janelas de mesma origem em qualquer navegador.
 */
export function createChannel(onMessage: (message: ChannelMessage) => void) {
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(NAME);
    channel.onmessage = (event) => onMessage(event.data as ChannelMessage);
    return {
      post: (message: ChannelMessage) => channel.postMessage(message),
      close: () => channel.close(),
    };
  }

  const key = `coletanea:channel`;
  const listener = (event: StorageEvent) => {
    if (event.key !== key || !event.newValue) return;
    onMessage(JSON.parse(event.newValue).message as ChannelMessage);
  };
  window.addEventListener("storage", listener);
  return {
    post: (message: ChannelMessage) => {
      localStorage.setItem(key, JSON.stringify({ at: Date.now(), message }));
    },
    close: () => window.removeEventListener("storage", listener),
  };
}
