import * as React from "react";
import { cn } from "../../lib/utils";

export function Slider({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="range" className={cn("w-full h-2 bg-[rgba(255,255,255,0.04)]", className)} {...props} />;
}
