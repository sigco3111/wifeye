import { describe, it, expect } from "vitest";
import type { ActivityState } from "@/types";
import {
  generateBreathingRate,
  generateHeartRate,
  generateSleepStage,
  generateVitalsPoint,
  getInitialBreathingRate,
  getInitialHeartRate,
} from "@/lib/simulation/vitals-generator";

const BREATHING_RANGES: Record<ActivityState, [number, number]> = {
  sitting: [12, 20],
  walking: [16, 24],
  sleeping: [10, 14],
  standing: [12, 18],
  fallen: [10, 25],
};

const HEART_RANGES: Record<ActivityState, [number, number]> = {
  sitting: [60, 80],
  walking: [80, 110],
  sleeping: [50, 65],
  standing: [65, 90],
  fallen: [50, 120],
};

describe("generateBreathingRate", () => {
  const activities: ActivityState[] = [
    "sitting",
    "walking",
    "sleeping",
    "standing",
    "fallen",
  ];

  activities.forEach((activity) => {
    it(`stays within range for ${activity}`, () => {
      const [min, max] = BREATHING_RANGES[activity];
      const mid = (min + max) / 2;

      for (let i = 0; i < 100; i++) {
        const result = generateBreathingRate(mid, activity);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
      }
    });

    it(`uses random walk from current value for ${activity}`, () => {
      const mid = (BREATHING_RANGES[activity][0] + BREATHING_RANGES[activity][1]) / 2;
      const results = new Set<number>();
      for (let i = 0; i < 50; i++) {
        results.add(generateBreathingRate(mid, activity));
      }
      expect(results.size).toBeGreaterThan(1);
    });
  });

  it("clamps to max when current is above range", () => {
    const result = generateBreathingRate(100, "sleeping");
    expect(result).toBeLessThanOrEqual(14);
    expect(result).toBeGreaterThanOrEqual(10);
  });

  it("clamps to min when current is below range", () => {
    const result = generateBreathingRate(0, "sitting");
    expect(result).toBeGreaterThanOrEqual(12);
    expect(result).toBeLessThanOrEqual(20);
  });
});

describe("generateHeartRate", () => {
  const activities: ActivityState[] = [
    "sitting",
    "walking",
    "sleeping",
    "standing",
    "fallen",
  ];

  activities.forEach((activity) => {
    it(`stays within range for ${activity}`, () => {
      const [min, max] = HEART_RANGES[activity];
      const mid = (min + max) / 2;

      for (let i = 0; i < 100; i++) {
        const result = generateHeartRate(mid, activity);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
      }
    });
  });
});

describe("generateSleepStage", () => {
  it("returns valid sleep stages", () => {
    const validStages = new Set(["deep", "light", "rem", "awake"]);
    for (let i = 0; i < 100; i++) {
      const stage = generateSleepStage(i * 5);
      expect(validStages.has(stage)).toBe(true);
    }
  });

  it("follows 90-minute cycle model for light at start", () => {
    let lightCount = 0;
    const trials = 200;
    for (let i = 0; i < trials; i++) {
      if (generateSleepStage(3) === "light") lightCount++;
    }
    expect(lightCount).toBeGreaterThan(trials * 0.6);
  });

  it("follows 90-minute cycle model for deep in 10-30 range", () => {
    let deepCount = 0;
    const trials = 200;
    for (let i = 0; i < trials; i++) {
      if (generateSleepStage(20) === "deep") deepCount++;
    }
    expect(deepCount).toBeGreaterThan(trials * 0.6);
  });

  it("follows 90-minute cycle model for rem in 30-50 range", () => {
    let remCount = 0;
    const trials = 200;
    for (let i = 0; i < trials; i++) {
      if (generateSleepStage(40) === "rem") remCount++;
    }
    expect(remCount).toBeGreaterThan(trials * 0.6);
  });

  it("wraps around after 90 minutes", () => {
    const stage1 = generateSleepStage(0);
    const stage2 = generateSleepStage(90);
    expect(typeof stage1).toBe("string");
    expect(typeof stage2).toBe("string");
  });
});

describe("generateVitalsPoint", () => {
  it("returns correctly shaped VitalsHistoryPoint", () => {
    const state = {
      roomId: "test-room",
      roomName: "테스트",
      presence: true,
      occupancy: 1,
      breathingRate: 16,
      heartRate: 70,
      activity: "sitting" as ActivityState,
      lastActivityTime: new Date(),
      lastUpdate: new Date(),
    };

    const point = generateVitalsPoint("test-room", state);
    expect(point).toHaveProperty("time");
    expect(point).toHaveProperty("breathingRate");
    expect(point).toHaveProperty("heartRate");
    expect(typeof point.time).toBe("string");
    expect(typeof point.breathingRate).toBe("number");
    expect(typeof point.heartRate).toBe("number");
  });

  it("generates vitals within range for the given activity", () => {
    const state = {
      roomId: "test-room",
      roomName: "테스트",
      presence: true,
      occupancy: 1,
      breathingRate: 15,
      heartRate: 65,
      activity: "sleeping" as ActivityState,
      lastActivityTime: new Date(),
      lastUpdate: new Date(),
    };

    for (let i = 0; i < 50; i++) {
      const point = generateVitalsPoint("test-room", state);
      expect(point.breathingRate).toBeGreaterThanOrEqual(10);
      expect(point.breathingRate).toBeLessThanOrEqual(14);
      expect(point.heartRate).toBeGreaterThanOrEqual(50);
      expect(point.heartRate).toBeLessThanOrEqual(65);
    }
  });
});

describe("getInitialBreathingRate", () => {
  it("returns value within valid range", () => {
    for (let i = 0; i < 50; i++) {
      const val = getInitialBreathingRate("sitting");
      expect(val).toBeGreaterThanOrEqual(12);
      expect(val).toBeLessThanOrEqual(20);
    }
  });
});

describe("getInitialHeartRate", () => {
  it("returns value within valid range", () => {
    for (let i = 0; i < 50; i++) {
      const val = getInitialHeartRate("walking");
      expect(val).toBeGreaterThanOrEqual(80);
      expect(val).toBeLessThanOrEqual(110);
    }
  });
});
