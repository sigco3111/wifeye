import { describe, it, expect, beforeEach } from "vitest";
import { useAlertStore } from "@/stores/alert-store";
import type { Alert } from "@/types";

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id: "alert-1",
    roomId: "room-1",
    roomName: "거실",
    type: "fall_detected",
    severity: "critical",
    message: "낙상 감지",
    timestamp: new Date(),
    acknowledged: false,
    ...overrides,
  };
}

describe("useAlertStore", () => {
  beforeEach(() => {
    const store = useAlertStore.getState();
    store.dismissAlert("alert-1");
    store.dismissAlert("alert-2");
    store.dismissAlert("alert-3");
    store.dismissAlert("alert-4");
  });

  describe("addAlert", () => {
    it("appends an alert and increments unacknowledgedCount", () => {
      const store = useAlertStore.getState();
      store.addAlert(makeAlert());

      const state = useAlertStore.getState();
      expect(state.alerts).toHaveLength(1);
      expect(state.unacknowledgedCount).toBe(1);
    });

    it("does not increment count for pre-acknowledged alerts", () => {
      const store = useAlertStore.getState();
      store.addAlert(makeAlert({ acknowledged: true }));

      expect(useAlertStore.getState().unacknowledgedCount).toBe(0);
    });

    it("tracks multiple alerts correctly", () => {
      const store = useAlertStore.getState();
      store.addAlert(makeAlert({ id: "alert-1" }));
      store.addAlert(makeAlert({ id: "alert-2", acknowledged: true }));
      store.addAlert(makeAlert({ id: "alert-3" }));

      const state = useAlertStore.getState();
      expect(state.alerts).toHaveLength(3);
      expect(state.unacknowledgedCount).toBe(2);
    });
  });

  describe("acknowledgeAlert", () => {
    it("marks a specific alert as acknowledged", () => {
      const store = useAlertStore.getState();
      store.addAlert(makeAlert({ id: "alert-1" }));
      store.addAlert(makeAlert({ id: "alert-2" }));

      store.acknowledgeAlert("alert-1");

      const state = useAlertStore.getState();
      const alert1 = state.alerts.find((a) => a.id === "alert-1");
      const alert2 = state.alerts.find((a) => a.id === "alert-2");
      expect(alert1?.acknowledged).toBe(true);
      expect(alert2?.acknowledged).toBe(false);
      expect(state.unacknowledgedCount).toBe(1);
    });

    it("does nothing for a non-existent alert id", () => {
      const store = useAlertStore.getState();
      store.addAlert(makeAlert({ id: "alert-1" }));

      store.acknowledgeAlert("nonexistent");

      const state = useAlertStore.getState();
      expect(state.unacknowledgedCount).toBe(1);
    });
  });

  describe("acknowledgeAll", () => {
    it("marks all alerts as acknowledged", () => {
      const store = useAlertStore.getState();
      store.addAlert(makeAlert({ id: "alert-1" }));
      store.addAlert(makeAlert({ id: "alert-2" }));
      store.addAlert(makeAlert({ id: "alert-3" }));

      store.acknowledgeAll();

      const state = useAlertStore.getState();
      expect(state.unacknowledgedCount).toBe(0);
      expect(state.alerts.every((a) => a.acknowledged)).toBe(true);
    });
  });

  describe("dismissAlert", () => {
    it("removes an alert from the list", () => {
      const store = useAlertStore.getState();
      store.addAlert(makeAlert({ id: "alert-1" }));
      store.addAlert(makeAlert({ id: "alert-2" }));

      store.dismissAlert("alert-1");

      const state = useAlertStore.getState();
      expect(state.alerts).toHaveLength(1);
      expect(state.alerts[0].id).toBe("alert-2");
      expect(state.unacknowledgedCount).toBe(1);
    });

    it("updates unacknowledgedCount when dismissing unacknowledged alert", () => {
      const store = useAlertStore.getState();
      store.addAlert(makeAlert({ id: "alert-1" }));

      store.dismissAlert("alert-1");

      expect(useAlertStore.getState().unacknowledgedCount).toBe(0);
    });
  });

  describe("getFilteredAlerts", () => {
    beforeEach(() => {
      const store = useAlertStore.getState();
      store.addAlert(makeAlert({ id: "alert-1", severity: "critical", roomId: "room-1", acknowledged: false }));
      store.addAlert(makeAlert({ id: "alert-2", severity: "warning", roomId: "room-1", acknowledged: true }));
      store.addAlert(makeAlert({ id: "alert-3", severity: "info", roomId: "room-2", acknowledged: false }));
      store.addAlert(makeAlert({ id: "alert-4", severity: "critical", roomId: "room-2", acknowledged: true }));
    });

    it("filters by severity", () => {
      const result = useAlertStore.getState().getFilteredAlerts({ severity: "critical" });
      expect(result).toHaveLength(2);
      expect(result.every((a) => a.severity === "critical")).toBe(true);
    });

    it("filters by roomId", () => {
      const result = useAlertStore.getState().getFilteredAlerts({ roomId: "room-2" });
      expect(result).toHaveLength(2);
      expect(result.every((a) => a.roomId === "room-2")).toBe(true);
    });

    it("filters by acknowledged status", () => {
      const result = useAlertStore.getState().getFilteredAlerts({ acknowledged: false });
      expect(result).toHaveLength(2);
      expect(result.every((a) => !a.acknowledged)).toBe(true);
    });

    it("combines multiple filters", () => {
      const result = useAlertStore.getState().getFilteredAlerts({
        severity: "critical",
        acknowledged: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("alert-4");
    });

    it("returns all alerts with empty filters", () => {
      const result = useAlertStore.getState().getFilteredAlerts({});
      expect(result).toHaveLength(4);
    });
  });
});
