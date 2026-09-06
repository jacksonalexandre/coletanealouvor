import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";
import type { SetlistItem } from "@/lib/types";

/** Roteiro do culto: ordem das músicas, arrastável. */
export function Setlist() {
  const setlist = useApp((state) => state.setlist);
  const activeUid = useApp((state) => state.activeUid);
  const reorder = useApp((state) => state.reorderSetlist);
  const clear = useApp((state) => state.clearSetlist);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = setlist.findIndex((item) => item.uid === active.id);
    const to = setlist.findIndex((item) => item.uid === over.id);
    reorder(arrayMove(setlist, from, to));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between px-3 py-2">
        <h2 className="text-xs font-semibold tracking-wider text-ink-400 uppercase">
          Roteiro · {setlist.length}
        </h2>
        {setlist.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            Limpar
          </Button>
        )}
      </header>

      {setlist.length === 0 ? (
        <p className="px-4 py-6 text-sm text-ink-400">
          Adicione músicas pelo <span className="text-ink-200">+</span> da lista para montar a ordem do
          culto.
        </p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={setlist.map((item) => item.uid)}
              strategy={verticalListSortingStrategy}
            >
              {setlist.map((item, index) => (
                <Row key={item.uid} item={item} index={index} active={item.uid === activeUid} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

function Row({ item, index, active }: { item: SetlistItem; index: number; active: boolean }) {
  const song = useApp((state) => state.song(item.songId));
  const openSong = useApp((state) => state.openSong);
  const remove = useApp((state) => state.removeFromSetlist);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.uid,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group mb-1 flex items-center gap-1 rounded-lg px-1 py-1.5",
        active ? "bg-brand-600/15 ring-1 ring-brand-600/50" : "hover:bg-ink-800",
        isDragging && "opacity-60",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab px-1 text-ink-400 active:cursor-grabbing"
        aria-label="Reordenar"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="w-5 text-center text-xs text-ink-400">{index + 1}</span>
      <button
        onClick={() => openSong(item.songId, item.uid)}
        className="min-w-0 flex-1 truncate text-left text-sm text-ink-200"
      >
        {song?.title ?? "Música removida"}
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100"
        onClick={() => remove(item.uid)}
        aria-label="Remover do roteiro"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
