import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { SimulationEngine } from "@/lib/simulation/engine";
import { useSensorStore } from "@/stores/sensor-store";
import { useAlertStore } from "@/stores/alert-store";
import { useVitalsHistory } from "@/hooks/use-vitals-history";
import { useAlerts } from "@/hooks/use-alerts";
import { analyzeFall } from "@/lib/detection/fall-detector";
import { analyzeIntrusion } from "@/lib/detection/intrusion-detector";
import { analyzeAnomaly } from "@/lib/detection/anomaly-detector";
import { analyzeInactivity } from "@/lib/detection/inactivity-detector";
import type { DetectionInput } from "@/lib/detection/types";
import type { Alert, RoomState } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRoomState(overrides: Partial<RoomState> = {}): RoomState {
  return {
    roomId: "living-room",
    roomName: "\uAC70\uC2E4",
    presence: true,
    occupancy: 1,
    breathingRate: 16,
    heartRate: 72,
    activity: "sitting",
    lastActivityTime: new Date(),
    lastUpdate: new Date(),
    ...overrides,
  };
}

function makeAlert(overrides: Partial<Alert> = {}): Alert {
  return {
    id: `alert-${Math.random().toString(36).slice(2, 8)}`,
    roomId: "living-room",
    roomName: "\uAC70\uC2E4",
    type: "fall_detected",
    severity: "critical",
    message: "\uB0A9\uC0C1 \uAC10\uC9C0",
    timestamp: new Date(),
    acknowledged: false,
    ...overrides,
  };
}

function makeDetectionInput(
  overrides: Partial<DetectionInput["currentState"]> = {},
  extra: Partial<Omit<DetectionInput, "currentState">> = {},
): DetectionInput {
  return {
    roomId: "living-room",
    roomName: "\uAC70\uC2E4",
    currentTime: new Date(),
    recentEvents: [],
    activityHistory: [],
    ...extra,
    currentState: {
      presence: true,
      occupancy: 1,
      activity: "sitting",
      registeredOccupancy: 1,
      lastActivityTime: new Date(),
      ...overrides,
    },
  };
}

/** Reset both stores before each test */
function resetStores(): void {
  useSensorStore.getState().reset();
  // Alert store has no reset method — re-create by setting state directly
  const alertState = useAlertStore.getState();
  alertState.alerts = [];
  alertState.unacknowledgedCount = 0;
}

// ---------------------------------------------------------------------------
// Suite 1: Simulation → Store data flow
// ---------------------------------------------------------------------------

describe("Suite 1: Simulation \u2192 Store data flow", () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    resetStores();
    engine = new SimulationEngine();
  });

  afterEach(() => {
    engine.stop();
  });

  it("simulation engine populates sensor store", () => {
    engine.start();
    engine.tick();

    const { rooms } = useSensorStore.getState();
    expect(rooms.size).toBeGreaterThan(0);

    rooms.forEach((room) => {
      expect(room.breathingRate).toBeGreaterThanOrEqual(10);
      expect(room.heartRate).toBeGreaterThanOrEqual(50);
      expect(room.activity).toBeDefined();
      expect(typeof room.presence).toBe("boolean");
    });

    engine.stop();
  });

  it("simulation updates vitals history", () => {
    engine.start();
    engine.tick();

    const { vitalsHistory, rooms } = useSensorStore.getState();
    expect(vitalsHistory.size).toBe(rooms.size);

    rooms.forEach((_room, roomId) => {
      const history = vitalsHistory.get(roomId);
      expect(history).toBeDefined();
      expect(history!.length).toBeGreaterThan(0);
      expect(history![0]).toHaveProperty("time");
      expect(history![0]).toHaveProperty("breathingRate");
      expect(history![0]).toHaveProperty("heartRate");
    });

    engine.stop();
  });

  it("simulation generates events after many ticks", () => {
    // The event chance is 1%, so ~500 ticks should reliably produce events.
    // We force deterministic randomness by ticking many times.
    engine.start();

    for (let i = 0; i < 500; i++) {
      engine.tick();
    }

    const { events } = useSensorStore.getState();
    expect(events.length).toBeGreaterThan(0);

    engine.stop();
  });

  it("simulation respects room structure with 4 default rooms", () => {
    engine.start();
    engine.tick();

    const { rooms } = useSensorStore.getState();
    const expectedRooms = ["living-room", "bedroom", "kitchen", "bathroom"];

    expectedRooms.forEach((id) => {
      expect(rooms.has(id)).toBe(true);
    });

    engine.stop();
  });
});

// ---------------------------------------------------------------------------
// Suite 2: Detection → Alert flow
// ---------------------------------------------------------------------------

describe("Suite 2: Detection \u2192 Alert flow", () => {
  beforeEach(() => {
    resetStores();
  });

  it("fall detection creates critical result", () => {
    const input = makeDetectionInput({ activity: "fallen" });
    const result = analyzeFall(input);

    expect(result).not.toBeNull();
    expect(result!.detected).toBe(true);
    expect(result!.severity).toBe("critical");
    expect(result!.type).toBe("fall_detected");
  });

  it("intrusion detection at night creates critical result", () => {
    // Create a date at midnight (night time: >= 22 or < 6)
    const nightDate = new Date();
    nightDate.setHours(23, 0, 0, 0);

    const input = makeDetectionInput(
      { occupancy: 2, registeredOccupancy: 1, presence: true },
      { currentTime: nightDate },
    );
    const result = analyzeIntrusion(input);

    expect(result).not.toBeNull();
    expect(result!.detected).toBe(true);
    expect(result!.severity).toBe("critical");
    expect(result!.type).toBe("intrusion_detected");
  });

  it("anomaly detection on pattern deviation", () => {
    const now = new Date();
    // Build activity history with 10 transitions in 30 min to exceed threshold of 8
    const activityHistory = Array.from({ length: 11 }, (_, i) => ({
      timestamp: new Date(now.getTime() - (11 - i) * 2 * 60 * 1000),
      activity: i % 2 === 0 ? "walking" : "standing",
    }));

    const input = makeDetectionInput(
      { activity: "walking" },
      { activityHistory, currentTime: now },
    );
    const result = analyzeAnomaly(input);

    expect(result).not.toBeNull();
    expect(result!.detected).toBe(true);
    expect(result!.type).toBe("anomaly_detected");
    // Severity should be warning or critical
    expect(["warning", "critical"]).toContain(result!.severity);
  });

  it("inactivity detection triggers on threshold", () => {
    const now = new Date();
    const lastActivity = new Date(now.getTime() - 120 * 60 * 1000); // 120 min ago

    const result = analyzeInactivity({
      roomId: "living-room",
      roomName: "\uAC70\uC2E4",
      lastActivityTime: lastActivity,
      currentTime: now,
      activity: "sitting",
      thresholdMinutes: 60,
    });

    expect(result).not.toBeNull();
    expect(result!.severity).toBe("critical");
    expect(result!.type).toBe("inactivity_detected");
  });

  it("inactivity detection returns null when sleeping", () => {
    const now = new Date();
    const lastActivity = new Date(now.getTime() - 120 * 60 * 1000);

    const result = analyzeInactivity({
      roomId: "bedroom",
      roomName: "\uCE68\uC2E4",
      lastActivityTime: lastActivity,
      currentTime: now,
      activity: "sleeping",
      thresholdMinutes: 60,
    });

    expect(result).toBeNull();
  });

  it("detection results can be added to alert store", () => {
    const input = makeDetectionInput({ activity: "fallen" });
    const detection = analyzeFall(input);

    expect(detection).not.toBeNull();

    // Convert DetectionOutput to Alert format
    const alert: Alert = {
      id: `alert-detection-${Date.now()}`,
      roomId: detection!.roomId,
      roomName: "\uAC70\uC2E4",
      type: detection!.type,
      severity: detection!.severity,
      message: detection!.message,
      timestamp: detection ? new Date() : new Date(),
      acknowledged: false,
    };

    useAlertStore.getState().addAlert(alert);

    const { alerts, unacknowledgedCount } = useAlertStore.getState();
    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe("fall_detected");
    expect(alerts[0].severity).toBe("critical");
    expect(unacknowledgedCount).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Suite 3: Hook + Store integration
// ---------------------------------------------------------------------------

describe("Suite 3: Hook + Store integration", () => {
  beforeEach(() => {
    resetStores();
  });

  it("useVitalsHistory returns store data", () => {
    const store = useSensorStore.getState();

    // Populate room and vitals
    store.updateRoom("living-room", makeRoomState());
    store.appendVitals("living-room", {
      time: "10:00:00",
      breathingRate: 16,
      heartRate: 72,
    });
    store.appendVitals("living-room", {
      time: "10:00:02",
      breathingRate: 17,
      heartRate: 74,
    });

    const { result } = renderHook(() => useVitalsHistory("living-room"));

    expect(result.current.history).toHaveLength(2);
    expect(result.current.latestBreathing).toBe(16);
    expect(result.current.latestHeartRate).toBe(72);
  });

  it("useAlerts filters work with store data", () => {
    const store = useAlertStore.getState();

    store.addAlert(makeAlert({ severity: "critical", roomId: "living-room" }));
    store.addAlert(
      makeAlert({
        id: "alert-warn",
        severity: "warning",
        roomId: "bedroom",
        type: "anomaly_detected",
      }),
    );
    store.addAlert(
      makeAlert({
        id: "alert-info",
        severity: "warning",
        roomId: "living-room",
        type: "movement",
        acknowledged: true,
      }),
    );

    // Filter by severity
    const { result: criticalResult } = renderHook(() =>
      useAlerts({ severity: "critical" }),
    );
    expect(criticalResult.current.alerts).toHaveLength(1);
    expect(criticalResult.current.alerts[0].severity).toBe("critical");

    // Filter by room
    const { result: roomResult } = renderHook(() =>
      useAlerts({ roomId: "bedroom" }),
    );
    expect(roomResult.current.alerts).toHaveLength(1);
    expect(roomResult.current.alerts[0].roomId).toBe("bedroom");

    // Filter by acknowledged status
    const { result: ackResult } = renderHook(() =>
      useAlerts({ acknowledged: false }),
    );
    expect(ackResult.current.alerts).toHaveLength(2);

    // Unacknowledged count should be 2
    expect(criticalResult.current.unacknowledgedCount).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Suite 4: Store state management
// ---------------------------------------------------------------------------

describe("Suite 4: Store state management", () => {
  beforeEach(() => {
    resetStores();
  });

  it("sensor store reset clears all data", () => {
    useSensorStore.getState().updateRoom("living-room", makeRoomState());
    useSensorStore.getState().appendVitals("living-room", {
      time: "10:00:00",
      breathingRate: 16,
      heartRate: 72,
    });
    useSensorStore.getState().addEvent({
      id: "evt-1",
      roomId: "living-room",
      roomName: "\uAC70\uC2E4",
      type: "movement",
      message: "\uC6C0\uC9C1\uC784 \uAC10\uC9C0",
      severity: "info",
      timestamp: new Date(),
    });

    // Verify data exists (getState() always returns latest snapshot)
    expect(useSensorStore.getState().rooms.size).toBe(1);
    expect(useSensorStore.getState().events).toHaveLength(1);
    expect(useSensorStore.getState().vitalsHistory.size).toBe(1);

    useSensorStore.getState().reset();

    const state = useSensorStore.getState();
    expect(state.rooms.size).toBe(0);
    expect(state.events).toHaveLength(0);
    expect(state.vitalsHistory.size).toBe(0);
  });

  it("alert store acknowledge flow", () => {
    const store = useAlertStore.getState();

    store.addAlert(makeAlert({ id: "a1" }));
    store.addAlert(makeAlert({ id: "a2" }));
    store.addAlert(makeAlert({ id: "a3" }));

    expect(useAlertStore.getState().unacknowledgedCount).toBe(3);

    // Acknowledge one
    act(() => {
      store.acknowledgeAlert("a2");
    });

    const afterOne = useAlertStore.getState();
    expect(afterOne.unacknowledgedCount).toBe(2);
    expect(afterOne.alerts.find((a) => a.id === "a2")?.acknowledged).toBe(true);
    expect(afterOne.alerts.find((a) => a.id === "a1")?.acknowledged).toBe(false);

    // Acknowledge all
    act(() => {
      store.acknowledgeAll();
    });

    const afterAll = useAlertStore.getState();
    expect(afterAll.unacknowledgedCount).toBe(0);
    afterAll.alerts.forEach((a) => {
      expect(a.acknowledged).toBe(true);
    });
  });

  it("simulation mode toggle", () => {
    const store = useSensorStore.getState();

    // Default is true
    expect(useSensorStore.getState().system.simulationMode).toBe(true);

    store.setSimulationMode(false);
    expect(useSensorStore.getState().system.simulationMode).toBe(false);

    store.setSimulationMode(true);
    expect(useSensorStore.getState().system.simulationMode).toBe(true);
  });
});
