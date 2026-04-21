"use client";

import Sidebar from "@/components/shared/sidebar";
import MobileNav from "@/components/shared/mobile-nav";
import Header from "@/components/shared/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Header title="대시보드" subtitle="실시간 모니터링 및 관리" />
        <main className="flex-1 p-3 sm:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}