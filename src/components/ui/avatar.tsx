import * as React from "react";
import { cn } from "../../lib/utils";

export function Avatar({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("inline-block h-8 w-8 rounded-full bg-[var(--surface)]", className)} {...props} />;
}
