"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, DoorOpen, Bell, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "개요" },
  { href: "/dashboard/rooms", icon: DoorOpen, label: "방 관리" },
  { href: "/dashboard/alerts", icon: Bell, label: "알림" },
  { href: "/dashboard/reports", icon: BarChart3, label: "리포트" },
  { href: "/dashboard/settings", icon: Settings, label: "설정" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/50 backdrop-blur-xl border-t border-border/20">
      <div className="flex justify-around py-2 px-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg",
                isActive
                  ? "text-primary"
                  : "text-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </a>
          );
        })}
      </div>
      <div className="h-6 bg-background" /> {/* Safe area padding */}
    </div>
  );
}