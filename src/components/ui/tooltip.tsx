import * as React from "react";
import { cn } from "../../lib/utils";

export function Tooltip({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative inline-block", className)} {...props}>
      {children}
    </div>
  );
}
