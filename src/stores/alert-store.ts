import { create } from "zustand";
import type { Alert, AlertSeverity } from "@/types";

interface AlertFilters {
  severity?: AlertSeverity;
  roomId?: string;
  acknowledged?: boolean;
}

interface AlertState {
  alerts: Alert[];
  unacknowledgedCount: number;

  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string) => void;
  acknowledgeAll: () => void;
  dismissAlert: (id: string) => void;
  getFilteredAlerts: (filters: AlertFilters) => Alert[];
}

function countUnacknowledged(alerts: Alert[]): number {
  return alerts.filter((a) => !a.acknowledged).length;
}

export const useAlertStore = create<AlertState>()((set, get) => ({
  alerts: [],
  unacknowledgedCount: 0,

  addAlert: (alert) =>
    set((state) => {
      const alerts = [...state.alerts, alert];
      return { alerts, unacknowledgedCount: countUnacknowledged(alerts) };
    }),

  acknowledgeAlert: (id) =>
    set((state) => {
      const alerts = state.alerts.map((a) =>
        a.id === id ? { ...a, acknowledged: true } : a,
      );
      return { alerts, unacknowledgedCount: countUnacknowledged(alerts) };
    }),

  acknowledgeAll: () =>
    set((state) => {
      const alerts = state.alerts.map((a) => ({ ...a, acknowledged: true }));
      return { alerts, unacknowledgedCount: 0 };
    }),

  dismissAlert: (id) =>
    set((state) => {
      const alerts = state.alerts.filter((a) => a.id !== id);
      return { alerts, unacknowledgedCount: countUnacknowledged(alerts) };
    }),

  getFilteredAlerts: (filters) => {
    const { alerts } = get();
    return alerts.filter((a) => {
      if (filters.severity !== undefined && a.severity !== filters.severity) return false;
      if (filters.roomId !== undefined && a.roomId !== filters.roomId) return false;
      if (filters.acknowledged !== undefined && a.acknowledged !== filters.acknowledged) return false;
      return true;
    });
  },
}));
