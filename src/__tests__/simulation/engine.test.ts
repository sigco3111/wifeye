import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { SimulationEngine } from "@/lib/simulation/engine";
import { useSensorStore } from "@/stores/sensor-store";

describe("SimulationEngine", () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    engine = new SimulationEngine();
    useSensorStore.getState().reset();
  });

  afterEach(() => {
    engine.stop();
    useSensorStore.getState().reset();
  });

  describe("start / stop / isRunning", () => {
    it("starts and reports running", () => {
      engine.start(100);
      expect(engine.isRunning()).toBe(true);
    });

    it("stops and reports not running", () => {
      engine.start(100);
      engine.stop();
      expect(engine.isRunning()).toBe(false);
    });

    it("does not start twice", () => {
      engine.start(100);
      engine.start(100);
      expect(engine.isRunning()).toBe(true);
      engine.stop();
      expect(engine.isRunning()).toBe(false);
    });

    it("stop on non-started engine is safe", () => {
      expect(() => engine.stop()).not.toThrow();
      expect(engine.isRunning()).toBe(false);
    });
  });

  describe("default rooms", () => {
    it("creates default rooms when store is empty on start", () => {
      expect(useSensorStore.getState().rooms.size).toBe(0);
      engine.start(100);
      expect(useSensorStore.getState().rooms.size).toBe(4);
    });

    it("default rooms are 거실, 침실, 주방, 화장실", () => {
      engine.start(100);
      const rooms = useSensorStore.getState().rooms;
      const names = Array.from(rooms.values()).map((r) => r.roomName);
      expect(names).toContain("거실");
      expect(names).toContain("침실");
      expect(names).toContain("주방");
      expect(names).toContain("화장실");
    });

    it("does not override existing rooms", () => {
      useSensorStore.getState().updateRoom("custom-room", {
        roomName: "커스텀",
        breathingRate: 16,
        heartRate: 70,
        activity: "sitting",
        presence: true,
        occupancy: 1,
        lastActivityTime: new Date(),
        lastUpdate: new Date(),
      });
      engine.start(100);
      expect(useSensorStore.getState().rooms.size).toBe(1);
      expect(useSensorStore.getState().rooms.get("custom-room")?.roomName).toBe("커스텀");
    });
  });

  describe("tick", () => {
    it("updates rooms on each tick", () => {
      engine.start(100);
      const before = useSensorStore.getState().rooms.get("living-room");
      expect(before).toBeDefined();

      engine.tick();
      const after = useSensorStore.getState().rooms.get("living-room");
      expect(after).toBeDefined();
      expect(after!.lastUpdate.getTime()).toBeGreaterThanOrEqual(
        before!.lastUpdate.getTime(),
      );
    });

    it("appends vitals history on each tick", () => {
      engine.start(100);
      engine.tick();
      const vitals = useSensorStore.getState().vitalsHistory.get("living-room");
      expect(vitals).toBeDefined();
      expect(vitals!.length).toBeGreaterThanOrEqual(1);
    });

    it("increments tick count", () => {
      expect(engine.getTickCount()).toBe(0);
      engine.tick();
      expect(engine.getTickCount()).toBe(1);
      engine.tick();
      expect(engine.getTickCount()).toBe(2);
    });

    it("updates system info", () => {
      engine.start(100);
      engine.tick();
      const system = useSensorStore.getState().system;
      expect(system.totalSensors).toBe(4);
      expect(system.monitoredRooms).toBe(4);
    });
  });

  describe("event generation", () => {
    it("events can be generated during tick", () => {
      engine.start(100);

      for (let i = 0; i < 500; i++) {
        engine.tick();
      }

      const events = useSensorStore.getState().events;
      expect(events.length).toBeGreaterThan(0);
    }, 10000);
  });

  describe("integration", () => {
    it("tick updates vitals within physiological ranges", () => {
      engine.start(100);
      engine.tick();

      const room = useSensorStore.getState().rooms.get("living-room");
      expect(room).toBeDefined();
      expect(room!.breathingRate).toBeGreaterThanOrEqual(10);
      expect(room!.breathingRate).toBeLessThanOrEqual(25);
      expect(room!.heartRate).toBeGreaterThanOrEqual(50);
      expect(room!.heartRate).toBeLessThanOrEqual(120);
    });

    it("interval triggers multiple ticks", () => {
      vi.useFakeTimers();
      engine.start(50);

      vi.advanceTimersByTime(250);
      expect(engine.getTickCount()).toBeGreaterThanOrEqual(4);

      engine.stop();
      vi.useRealTimers();
    });
  });
});
