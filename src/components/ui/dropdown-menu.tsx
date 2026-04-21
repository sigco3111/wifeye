import * as React from "react";
import { cn } from "../../lib/utils";

export function DropdownMenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative inline-block text-left", className)} {...props} />;
}
