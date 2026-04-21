import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSensorStore } from '@/stores/sensor-store';
import type { RoomState } from '@/types';

vi.mock('@/lib/mqtt/client', () => {
  const listeners: Record<string, Set<(...args: unknown[]) => void>> = {};
  return {
    createMQTTClient: () => ({
      onStatusChange: (cb: (...args: unknown[]) => void) => {
        if (!listeners.status) listeners.status = new Set();
        listeners.status.add(cb);
        return () => { listeners.status.delete(cb); };
      },
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn(),
    }),
  };
});

import { useSensorData } from '@/hooks/use-sensor-data';

function makeRoomState(overrides: Partial<RoomState> = {}): RoomState {
  return {
    roomId: 'living-room',
    roomName: '거실',
    presence: true,
    occupancy: 1,
    breathingRate: 16,
    heartRate: 72,
    activity: 'sitting',
    lastActivityTime: new Date(),
    lastUpdate: new Date(),
    ...overrides,
  };
}

describe('useSensorData', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSensorStore.getState().reset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns rooms from the store', () => {
    useSensorStore.getState().updateRoom('living-room', makeRoomState());

    const { result } = renderHook(() => useSensorData());

    expect(result.current.rooms.has('living-room')).toBe(true);
    expect(result.current.rooms.get('living-room')?.roomName).toBe('거실');
  });

  it('starts simulation engine when simulationMode is true', () => {
    useSensorStore.getState().setSimulationMode(true);

    const { result } = renderHook(() => useSensorData());

    expect(result.current.simulationMode).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const rooms = useSensorStore.getState().rooms;
    expect(rooms.size).toBeGreaterThan(0);
  });

  it('returns events from the store', () => {
    useSensorStore.getState().addEvent({
      id: 'evt-test',
      roomId: 'living-room',
      roomName: '거실',
      type: 'movement',
      message: '움직임 감지',
      severity: 'info',
      timestamp: new Date(),
    });

    const { result } = renderHook(() => useSensorData());

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].id).toBe('evt-test');
  });

  it('returns system info from the store', () => {
    const { result } = renderHook(() => useSensorData());

    expect(result.current.system.status).toBe('normal');
    expect(result.current.system.simulationMode).toBe(true);
  });

  it('allows toggling simulation mode', () => {
    const { result } = renderHook(() => useSensorData());

    expect(result.current.simulationMode).toBe(true);
    expect(typeof useSensorStore.getState().setSimulationMode).toBe('function');

    useSensorStore.getState().setSimulationMode(false);

    expect(useSensorStore.getState().system.simulationMode).toBe(false);
  });
});
