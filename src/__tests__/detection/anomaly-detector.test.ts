import { describe, it, expect } from 'vitest';
import { analyzeAnomaly } from '@/lib/detection/anomaly-detector';
import type { DetectionInput } from '@/lib/detection/types';

function makeInput(overrides: {
  activity?: string;
  hour?: number;
  activityHistory?: Array<{ timestamp: Date; activity: string }>;
}): DetectionInput & { currentTime: Date } {
  const currentTime = new Date();
  currentTime.setHours(overrides.hour ?? 14, 0, 0, 0);

  return {
    roomId: 'room-3',
    roomName: '주방',
    currentState: {
      presence: true,
      occupancy: 1,
      activity: overrides.activity ?? 'sitting',
      registeredOccupancy: 1,
      lastActivityTime: new Date(),
    },
    currentTime,
    recentEvents: [],
    activityHistory: overrides.activityHistory ?? [],
  };
}

function makeAlternatingActivities(count: number, baseTime: Date): Array<{ timestamp: Date; activity: string }> {
  const activities: Array<{ timestamp: Date; activity: string }> = [];
  const states = ['sitting', 'walking', 'standing', 'sitting', 'walking'];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(baseTime.getTime() - (count - i) * 60 * 1000);
    activities.push({ timestamp, activity: states[i % states.length] });
  }

  return activities;
}

describe('analyzeAnomaly', () => {
  it('returns WARNING when many activity changes (>8 transitions in 30 min)', () => {
    const input = makeInput({ activity: 'sitting' });
    const history = makeAlternatingActivities(15, input.currentTime);

    input.activityHistory = history;
    const result = analyzeAnomaly(input);

    expect(result).not.toBeNull();
    expect(result!.detected).toBe(true);
    expect(result!.type).toBe('anomaly_detected');
    expect(result!.severity).toBe('warning');
    expect(result!.confidence).toBeGreaterThanOrEqual(0.5);
    expect(result!.confidence).toBeLessThanOrEqual(0.7);
    expect(result!.message).toContain('잦은 활동 변화');
  });

  it('returns WARNING for night walking (23:00)', () => {
    const input = makeInput({ activity: 'walking', hour: 23 });
    const result = analyzeAnomaly(input);

    expect(result).not.toBeNull();
    expect(result!.type).toBe('anomaly_detected');
    expect(result!.severity).toBe('warning');
    expect(result!.message).toContain('야간');
    expect(result!.message).toContain('walking');
  });

  it('returns WARNING for night standing (02:00)', () => {
    const input = makeInput({ activity: 'standing', hour: 2 });
    const result = analyzeAnomaly(input);

    expect(result).not.toBeNull();
    expect(result!.severity).toBe('warning');
    expect(result!.message).toContain('야간');
  });

  it('returns null for normal daytime activity', () => {
    const input = makeInput({ activity: 'sitting', hour: 14 });
    expect(analyzeAnomaly(input)).toBeNull();
  });

  it('returns null for night sleeping (normal night behavior)', () => {
    const input = makeInput({ activity: 'sleeping', hour: 2 });
    expect(analyzeAnomaly(input)).toBeNull();
  });

  it('returns null for night sitting (not walking/standing)', () => {
    const input = makeInput({ activity: 'sitting', hour: 23 });
    expect(analyzeAnomaly(input)).toBeNull();
  });

  it('returns null when activity changes are <=8 in 30 min', () => {
    const input = makeInput({ activity: 'sitting', hour: 14 });
    const history = makeAlternatingActivities(5, input.currentTime);

    input.activityHistory = history;
    expect(analyzeAnomaly(input)).toBeNull();
  });

  it('prioritizes restlessness detection over night anomaly', () => {
    const input = makeInput({ activity: 'walking', hour: 23 });
    const history = makeAlternatingActivities(15, input.currentTime);

    input.activityHistory = history;
    const result = analyzeAnomaly(input);

    expect(result).not.toBeNull();
    expect(result!.message).toContain('잦은 활동 변화');
  });
});
