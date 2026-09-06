import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none items-center select-none", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-ink-700">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand-600" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-full border-2 border-brand-500 bg-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60" />
    </SliderPrimitive.Root>
  );
}
