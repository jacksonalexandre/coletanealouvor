import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-ink-700 bg-ink-800 px-3 text-sm text-ink-200 placeholder:text-ink-400 focus-visible:border-brand-600 focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}
