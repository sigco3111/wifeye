'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, DoorOpen, Bell, Wifi } from 'lucide-react';
import { SystemStatus, SystemInfo } from '@/types';
import { cn } from '@/lib/utils';

interface StatsGridProps {
  system: SystemInfo;
}

export function StatsGrid({ system }: StatsGridProps) {
  const stats = [
    {
      icon: Activity,
      label: '센서',
      value: system.totalSensors,
      trend: null,
    },
    {
      icon: DoorOpen,
      label: '모니터링 방',
      value: system.monitoredRooms,
      trend: null,
    },
    {
      icon: Bell,
      label: '오늘의 알림',
      value: system.todayAlerts,
      trend: null,
    },
    {
      icon: Wifi,
      label: '시스템 상태',
      value: system.status,
      trend: null,
    },
  ];

  const getStatusColor = (status: SystemStatus) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500/20 text-green-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'critical':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <stat.icon className="h-6 sm:h-8 w-6 sm:w-8 text-[var(--primary)]" />
              <div>
                <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-[var(--foreground)]">
                  {stat.value}
                </p>
              </div>
            </div>
            {stat.label === '시스템 상태' && (
              <Badge className={cn('px-3 py-1', getStatusColor(stat.value as SystemStatus))}>
                {stat.value}
              </Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}