import * as React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-[rgba(99,102,241,0.14)] px-2 py-0.5 text-xs font-medium text-[var(--foreground)]", className)} {...props} />
  );
}
