"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [isSimulation, setIsSimulation] = useState(true);
  const lastUpdateTime = new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="sticky top-0 z-10 bg-surface/50 backdrop-blur-xl border-b border-border/20">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted">시뮬레이션</span>
            <Switch
              checked={isSimulation}
              onCheckedChange={setIsSimulation}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-sm text-muted">실시간</span>
          </div>
          <div className="text-xs text-muted">
            마지막 업데이트: {lastUpdateTime}
          </div>
        </div>
      </div>
    </header>
  );
}