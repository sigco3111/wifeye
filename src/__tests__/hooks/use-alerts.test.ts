import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAlerts } from '@/hooks/use-alerts';
import { useAlertStore } from '@/stores/alert-store';
import type { Alert } from '@/types';

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id: `alert-${Math.random().toString(36).slice(2, 8)}`,
    roomId: 'living-room',
    roomName: '거실',
    type: 'movement',
    severity: 'info',
    message: '테스트 알림',
    timestamp: new Date(),
    acknowledged: false,
    ...overrides,
  };
}

describe('useAlerts', () => {
  beforeEach(() => {
    const store = useAlertStore.getState();
    store.alerts.forEach(() => {
      // clear alerts by dismissing
    });
    // Reset store state directly
    useAlertStore.setState({ alerts: [], unacknowledgedCount: 0 });
  });

  it('returns all alerts when no filters provided', () => {
    const alert1 = makeAlert({ id: 'a1' });
    const alert2 = makeAlert({ id: 'a2' });

    useAlertStore.getState().addAlert(alert1);
    useAlertStore.getState().addAlert(alert2);

    const { result } = renderHook(() => useAlerts());

    expect(result.current.alerts).toHaveLength(2);
  });

  it('filters alerts by severity', () => {
    useAlertStore.getState().addAlert(makeAlert({ id: 'a1', severity: 'critical' }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a2', severity: 'info' }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a3', severity: 'critical' }));

    const { result } = renderHook(() =>
      useAlerts({ severity: 'critical' }),
    );

    expect(result.current.alerts).toHaveLength(2);
    expect(result.current.alerts.every((a) => a.severity === 'critical')).toBe(true);
  });

  it('filters alerts by roomId', () => {
    useAlertStore.getState().addAlert(makeAlert({ id: 'a1', roomId: 'living-room' }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a2', roomId: 'bedroom' }));

    const { result } = renderHook(() =>
      useAlerts({ roomId: 'living-room' }),
    );

    expect(result.current.alerts).toHaveLength(1);
    expect(result.current.alerts[0].roomId).toBe('living-room');
  });

  it('filters alerts by acknowledged status', () => {
    useAlertStore.getState().addAlert(makeAlert({ id: 'a1', acknowledged: false }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a2', acknowledged: true }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a3', acknowledged: false }));

    const { result } = renderHook(() =>
      useAlerts({ acknowledged: false }),
    );

    expect(result.current.alerts).toHaveLength(2);
    expect(result.current.alerts.every((a) => !a.acknowledged)).toBe(true);
  });

  it('computes unacknowledgedCount correctly', () => {
    useAlertStore.getState().addAlert(makeAlert({ id: 'a1' }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a2' }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a3' }));

    const { result } = renderHook(() => useAlerts());

    expect(result.current.unacknowledgedCount).toBe(3);
  });

  it('acknowledgeAlert marks a single alert', () => {
    useAlertStore.getState().addAlert(makeAlert({ id: 'a1' }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a2' }));

    const { result } = renderHook(() => useAlerts());

    act(() => {
      result.current.acknowledgeAlert('a1');
    });

    expect(useAlertStore.getState().alerts.find((a) => a.id === 'a1')?.acknowledged).toBe(true);
    expect(useAlertStore.getState().alerts.find((a) => a.id === 'a2')?.acknowledged).toBe(false);
  });

  it('acknowledgeAll marks all alerts', () => {
    useAlertStore.getState().addAlert(makeAlert({ id: 'a1' }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a2' }));

    const { result } = renderHook(() => useAlerts());

    act(() => {
      result.current.acknowledgeAll();
    });

    const alerts = useAlertStore.getState().alerts;
    expect(alerts.every((a) => a.acknowledged)).toBe(true);
    expect(useAlertStore.getState().unacknowledgedCount).toBe(0);
  });

  it('dismissAlert removes an alert', () => {
    useAlertStore.getState().addAlert(makeAlert({ id: 'a1' }));
    useAlertStore.getState().addAlert(makeAlert({ id: 'a2' }));

    const { result } = renderHook(() => useAlerts());

    act(() => {
      result.current.dismissAlert('a1');
    });

    expect(useAlertStore.getState().alerts).toHaveLength(1);
    expect(useAlertStore.getState().alerts[0].id).toBe('a2');
  });
});
