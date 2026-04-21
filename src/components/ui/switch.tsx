import * as React from "react";
import { cn } from "../../lib/utils";

import { useState } from "react";

export function Switch({ 
  className, 
  checked, 
  onCheckedChange,
  ...props 
}: React.HTMLAttributes<HTMLButtonElement> & { 
  checked?: boolean; 
  onCheckedChange?: (checked: boolean) => void; 
}) {
  const [isChecked, setIsChecked] = useState(checked || false);
  
  const handleCheckedChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    if (onCheckedChange) {
      onCheckedChange(newChecked);
    }
  };
  
  return (
    <button
      className={cn(
        "w-10 h-6 rounded-full relative transition-colors duration-200",
        isChecked ? "bg-primary" : "bg-[rgba(255,255,255,0.06)]",
        className
      )}
      onClick={handleCheckedChange}
      {...props}
    >
      <div
        className={cn(
          "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200",
          isChecked ? "translate-x-4" : "translate-x-1"
        )}
      />
    </button>
  );
}
