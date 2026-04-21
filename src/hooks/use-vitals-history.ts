'use client';

import { useMemo, useRef } from 'react';
import { useSensorStore } from '@/stores/sensor-store';
import type { VitalsHistoryPoint } from '@/types';

interface UseVitalsHistoryReturn {
  history: VitalsHistoryPoint[];
  latestBreathing: number;
  latestHeartRate: number;
}

export function useVitalsHistory(roomId: string): UseVitalsHistoryReturn {
  const prevHistoryRef = useRef<VitalsHistoryPoint[]>([]);

  const history = useSensorStore((s) => {
    const h = s.vitalsHistory.get(roomId);
    if (!h) return prevHistoryRef.current;
    prevHistoryRef.current = h;
    return h;
  });
  const room = useSensorStore((s) => s.rooms.get(roomId));

  const latestBreathing = useMemo(() => {
    if (room) return room.breathingRate;
    if (history.length > 0) return history[history.length - 1].breathingRate;
    return 0;
  }, [room, history]);

  const latestHeartRate = useMemo(() => {
    if (room) return room.heartRate;
    if (history.length > 0) return history[history.length - 1].heartRate;
    return 0;
  }, [room, history]);

  return { history, latestBreathing, latestHeartRate };
}
