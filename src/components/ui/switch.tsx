import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-ink-600 transition-colors data-[state=checked]:bg-brand-600 data-[state=unchecked]:bg-ink-700",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-4 translate-x-1 rounded-full bg-ink-200 transition-transform data-[state=checked]:translate-x-6 data-[state=checked]:bg-ink-950" />
    </SwitchPrimitive.Root>
  );
}
