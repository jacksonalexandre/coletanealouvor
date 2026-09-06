import { useEffect, useMemo, useRef, useState } from "react";
import { createChannel, type ChannelMessage } from "@/lib/channel";
import { defaultStyle } from "@/lib/slides";
import { useApp } from "@/store/useApp";
import type { LiveState } from "@/lib/types";

export const emptyLive: LiveState = {
  songId: null,
  title: "",
  slides: [],
  slideIndex: 0,
  blank: false,
  style: defaultStyle,
  message: null,
  clock: false,
  updatedAt: 0,
};

/** Lado do controle: publica o estado para a janela de projeção. */
export function useLiveBroadcast() {
  const songId = useApp((state) => state.songId);
  const slides = useApp((state) => state.slides);
  const slideIndex = useApp((state) => state.slideIndex);
  const blank = useApp((state) => state.blank);
  const style = useApp((state) => state.style);
  const live = useApp((state) => state.live);
  const song = useApp((state) => state.song(state.songId));
  const setDisplayOpen = useApp((state) => state.setDisplayOpen);
  const step = useApp((state) => state.step);
  const setBlank = useApp((state) => state.setBlank);

  const channelRef = useRef<ReturnType<typeof createChannel> | null>(null);

  const state = useMemo<LiveState>(
    () => ({
      songId,
      title: song?.title ?? "",
      // Enquanto o operador não colocar no ar, a projeção fica em preto.
      slides: live ? slides : [],
      slideIndex,
      blank: blank || !live,
      style,
      message: null,
      clock: false,
      updatedAt: Date.now(),
    }),
    [songId, song?.title, slides, slideIndex, blank, style, live],
  );

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const channel = createChannel((message: ChannelMessage) => {
      if (message.type === "hello" || message.type === "display-open") {
        setDisplayOpen(true);
        channel.post({ type: "state", state: stateRef.current });
      }
      if (message.type === "display-closed") setDisplayOpen(false);
      if (message.type === "command") {
        if (message.action === "next") step(1);
        if (message.action === "prev") step(-1);
        if (message.action === "blank") setBlank(!useApp.getState().blank);
      }
    });
    channelRef.current = channel;
    channel.post({ type: "hello" });
    return () => channel.close();
  }, [setDisplayOpen, step, setBlank]);

  useEffect(() => {
    channelRef.current?.post({ type: "state", state });
  }, [state]);
}

/** Lado da projeção: recebe o estado publicado pelo controle. */
export function useLiveReceiver() {
  const [state, setState] = useState<LiveState>(emptyLive);

  useEffect(() => {
    const channel = createChannel((message) => {
      if (message.type === "state") {
        setState((current) => (message.state.updatedAt >= current.updatedAt ? message.state : current));
      }
      if (message.type === "hello") channel.post({ type: "display-open" });
    });

    channel.post({ type: "display-open" });
    const bye = () => channel.post({ type: "display-closed" });
    window.addEventListener("pagehide", bye);

    return () => {
      bye();
      window.removeEventListener("pagehide", bye);
      channel.close();
    };
  }, []);

  return state;
}
