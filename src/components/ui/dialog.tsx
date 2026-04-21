import * as React from "react";
import { cn } from "../../lib/utils";

export function Dialog({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fixed inset-0 flex items-center justify-center p-4", className)} {...props} />;
}
