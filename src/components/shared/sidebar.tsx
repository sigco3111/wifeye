"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, DoorOpen, Bell, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "개요" },
  { href: "/dashboard/rooms", icon: DoorOpen, label: "방 관리" },
  { href: "/dashboard/alerts", icon: Bell, label: "알림" },
  { href: "/dashboard/reports", icon: BarChart3, label: "리포트" },
  { href: "/dashboard/settings", icon: Settings, label: "설정" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-surface/50 backdrop-blur-xl border-r border-border/20 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/20">
        <div className="flex items-center space-x-3">
          <Badge className="bg-gradient-to-r from-primary to-accent text-white px-2 py-1 text-xs font-bold rounded">
            WE
          </Badge>
          <div>
            <h1 className="text-lg font-bold text-foreground">WifeEye</h1>
            <p className="text-xs text-muted">Privacy-First Care</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-10",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                )}
                asChild
              >
                <a href={item.href}>
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </a>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-muted">모든 시스템 정상</span>
          </div>
        </div>
        <Separator />
        <div className="mt-3">
          <a
            href="https://github.com/sigco3111/wifeye"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}