'use client';

import { useMemo } from 'react';
import { useAlertStore } from '@/stores/alert-store';
import type { AlertSeverity } from '@/types';

interface AlertFilters {
  severity?: AlertSeverity;
  roomId?: string;
  acknowledged?: boolean;
}

interface UseAlertsReturn {
  alerts: import('@/types').Alert[];
  unacknowledgedCount: number;
  acknowledgeAlert: (id: string) => void;
  acknowledgeAll: () => void;
  dismissAlert: (id: string) => void;
}

export function useAlerts(filters?: AlertFilters): UseAlertsReturn {
  const allAlerts = useAlertStore((s) => s.alerts);
  const unacknowledgedCount = useAlertStore((s) => s.unacknowledgedCount);
  const acknowledgeAlert = useAlertStore((s) => s.acknowledgeAlert);
  const acknowledgeAll = useAlertStore((s) => s.acknowledgeAll);
  const dismissAlert = useAlertStore((s) => s.dismissAlert);

  const alerts = useMemo(() => {
    if (!filters) return allAlerts;

    return allAlerts.filter((alert) => {
      if (filters.severity !== undefined && alert.severity !== filters.severity) {
        return false;
      }
      if (filters.roomId !== undefined && alert.roomId !== filters.roomId) {
        return false;
      }
      if (filters.acknowledged !== undefined && alert.acknowledged !== filters.acknowledged) {
        return false;
      }
      return true;
    });
  }, [allAlerts, filters]);

  return { alerts, unacknowledgedCount, acknowledgeAlert, acknowledgeAll, dismissAlert };
}
