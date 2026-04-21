'use client';

import { useState } from 'react';
import { useAlerts } from '@/hooks/use-alerts';
import { useSensorStore } from '@/stores/sensor-store';
import { AlertCard } from '@/components/dashboard/alert-card';
import { AlertFilters } from '@/components/dashboard/alert-filters';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import type { AlertSeverity } from '@/types';

export default function AlertsPage() {
  const [filters, setFilters] = useState({
    severity: undefined as AlertSeverity | undefined,
    roomId: undefined as string | undefined,
    acknowledged: undefined as boolean | undefined,
  });

  const { alerts, unacknowledgedCount, acknowledgeAlert, acknowledgeAll, dismissAlert } = useAlerts(filters);
  const rooms = useSensorStore((state) => Array.from(state.rooms.values()));

  const handleFilterChange = (newFilters: {
    severity?: AlertSeverity;
    roomId?: string;
    acknowledged?: boolean;
  }) => {
    setFilters({
      severity: newFilters.severity,
      roomId: newFilters.roomId,
      acknowledged: newFilters.acknowledged,
    });
  };

  const handleAcknowledgeAll = () => {
    acknowledgeAll();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">알림</h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {unacknowledgedCount > 0 && (
            <Badge className="bg-red-500 text-white px-3 py-1">
              미확인 {unacknowledgedCount}
            </Badge>
          )}
          {unacknowledgedCount > 0 && (
            <Button
              onClick={handleAcknowledgeAll}
              variant="default"
              className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/80 min-h-[44px] min-w-[44px] px-4"
            >
              전체 확인
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <AlertFilters filters={filters} onChange={handleFilterChange} />

      {/* Alert List */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          <div className="space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-2">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={acknowledgeAlert}
                onDismiss={dismissAlert}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Bell className="w-16 h-16 text-[var(--muted)] mb-4" />
            <p className="text-[var(--muted)] text-lg">알림이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}