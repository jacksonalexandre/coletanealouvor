import { useEffect, useMemo, useRef } from "react";
import { passageReference, passageVerses } from "@/lib/bible";
import { createChannel, type ChannelMessage } from "@/lib/channel";
import { useApp } from "@/store/useApp";
import type { LiveState } from "@/lib/types";

export const emptyLive: LiveState = {
  videoId: null,
  title: "",
  blank: false,
  playing: false,
  volume: 1,
  seek: null,
  passage: null,
  updatedAt: 0,
};

/** Lado do controle: publica o desejo do operador e ouve o player de volta. */
export function useControlLink() {
  const hymn = useApp((state) => state.hymn(state.hymnId));
  const videoId = useApp((state) => state.videoOf(state.hymnId));
  const blank = useApp((state) => state.blank);
  const playing = useApp((state) => state.playing);
  const volume = useApp((state) => state.volume);
  const seek = useApp((state) => state.seek);
  const passage = useApp((state) => state.passage);
  const bible = useApp((state) => state.bible);

  const setPlayer = useApp((state) => state.setPlayer);
  const setDisplayOpen = useApp((state) => state.setDisplayOpen);

  const channelRef = useRef<ReturnType<typeof createChannel> | null>(null);

  const passageLive = useMemo(
    () =>
      passage && bible.length
        ? { reference: passageReference(bible, passage), verses: passageVerses(bible, passage) }
        : null,
    [passage, bible],
  );

  const state = useMemo<LiveState>(
    () => ({
      videoId,
      title: hymn ? `${hymn.number}. ${hymn.title}` : "",
      blank,
      playing,
      volume,
      seek,
      passage: passageLive,
      updatedAt: Date.now(),
    }),
    [videoId, hymn, blank, playing, volume, seek, passageLive],
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
      if (message.type === "player") setPlayer(message.state);
      if (message.type === "command") {
        const store = useApp.getState();
        if (message.action === "next") {
          if (store.passage) store.movePassageVerses(1);
          else store.stepHymn(1);
        }
        if (message.action === "prev") {
          if (store.passage) store.movePassageVerses(-1);
          else store.stepHymn(-1);
        }
        if (message.action === "blank") store.setBlank(!store.blank);
        if (message.action === "toggle") store.toggle();
      }
    });

    channelRef.current = channel;
    channel.post({ type: "hello" });
    return () => channel.close();
  }, [setDisplayOpen, setPlayer]);

  useEffect(() => {
    channelRef.current?.post({ type: "state", state });
  }, [state]);
}
