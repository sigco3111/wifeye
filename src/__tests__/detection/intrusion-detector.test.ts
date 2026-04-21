import { describe, it, expect } from 'vitest';
import { analyzeIntrusion } from '@/lib/detection/intrusion-detector';
import type { DetectionInput } from '@/lib/detection/types';

function makeInput(overrides: {
  occupancy?: number;
  registeredOccupancy?: number;
  presence?: boolean;
  hour?: number;
}): DetectionInput {
  const date = new Date();
  date.setHours(overrides.hour ?? 14, 0, 0, 0);

  return {
    roomId: 'room-2',
    roomName: '침실',
    currentState: {
      presence: overrides.presence ?? true,
      occupancy: overrides.occupancy ?? 1,
      activity: 'sitting',
      registeredOccupancy: overrides.registeredOccupancy ?? 1,
      lastActivityTime: new Date(),
    },
    currentTime: date,
    recentEvents: [],
    activityHistory: [],
  };
}

describe('analyzeIntrusion', () => {
  it('returns CRITICAL when occupancy > registered at night (23:00)', () => {
    const input = makeInput({ occupancy: 3, registeredOccupancy: 1, presence: true, hour: 23 });
    const result = analyzeIntrusion(input);

    expect(result).not.toBeNull();
    expect(result!.detected).toBe(true);
    expect(result!.type).toBe('intrusion_detected');
    expect(result!.severity).toBe('critical');
    expect(result!.confidence).toBe(0.85);
    expect(result!.message).toContain('침실');
    expect(result!.message).toContain('미등록 인원');
  });

  it('returns CRITICAL when occupancy > registered at 03:00 (deep night)', () => {
    const input = makeInput({ occupancy: 2, registeredOccupancy: 1, presence: true, hour: 3 });
    const result = analyzeIntrusion(input);

    expect(result).not.toBeNull();
    expect(result!.severity).toBe('critical');
    expect(result!.confidence).toBe(0.85);
  });

  it('returns WARNING when occupancy > registered during daytime', () => {
    const input = makeInput({ occupancy: 3, registeredOccupancy: 1, presence: true, hour: 14 });
    const result = analyzeIntrusion(input);

    expect(result).not.toBeNull();
    expect(result!.severity).toBe('warning');
    expect(result!.confidence).toBe(0.6);
  });

  it('returns null when occupancy <= registered', () => {
    const input = makeInput({ occupancy: 1, registeredOccupancy: 1, presence: true, hour: 14 });
    expect(analyzeIntrusion(input)).toBeNull();
  });

  it('returns null when occupancy < registered', () => {
    const input = makeInput({ occupancy: 0, registeredOccupancy: 2, presence: false, hour: 14 });
    expect(analyzeIntrusion(input)).toBeNull();
  });

  it('returns null when occupancy > registered but no presence', () => {
    const input = makeInput({ occupancy: 3, registeredOccupancy: 1, presence: false, hour: 23 });
    expect(analyzeIntrusion(input)).toBeNull();
  });

  it('returns CRITICAL at 22:00 (night boundary start)', () => {
    const input = makeInput({ occupancy: 2, registeredOccupancy: 1, presence: true, hour: 22 });
    const result = analyzeIntrusion(input);
    expect(result!.severity).toBe('critical');
  });

  it('returns WARNING at 05:59 (just before night ends)', () => {
    const input = makeInput({ occupancy: 2, registeredOccupancy: 1, presence: true, hour: 5 });
    const result = analyzeIntrusion(input);
    expect(result!.severity).toBe('critical');
  });

  it('returns WARNING at 06:00 (day boundary start)', () => {
    const input = makeInput({ occupancy: 2, registeredOccupancy: 1, presence: true, hour: 6 });
    const result = analyzeIntrusion(input);
    expect(result!.severity).toBe('warning');
  });
});
