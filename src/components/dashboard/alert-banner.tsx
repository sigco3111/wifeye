'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { SystemStatus, SystemInfo } from '@/types';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  system: SystemInfo;
}

export function AlertBanner({ system }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || system.status === 'normal') {
    return null;
  }

  const getBannerColor = (status: SystemStatus) => {
    switch (status) {
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'critical':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
<Card className={cn(
  "p-3 sm:p-4 mb-3 sm:mb-6 border-l-4 slide-in",
  getBannerColor(system.status)
)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--foreground)] mb-1">
            {system.status === 'warning' ? '⚠️ 경고' : '🚨 위험'}
          </h3>
          <p className="text-sm text-[var(--muted)]">
            {system.message}
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </Card>
  );
}