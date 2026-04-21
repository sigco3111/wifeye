import * as React from "react";
import { cn } from "../../lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("bg-[var(--surface)] text-[var(--foreground)] rounded-md px-2 py-1", className)} {...props} />;
}
