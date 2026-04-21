import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    const baseClasses = "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";
    
    let variantClasses = "";
    if (variant === "ghost") {
      variantClasses = "text-[var(--foreground)] hover:text-[var(--primary)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg)]";
    } else if (variant === "default") {
      variantClasses = "bg-[var(--primary)] text-white shadow-sm hover:brightness-105";
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
