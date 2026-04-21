import { describe, it, expect } from 'vitest';
import { analyzeInactivity } from '@/lib/detection/inactivity-detector';
import type { InactivityInput } from '@/lib/detection/inactivity-detector';

function minutesAgo(min: number, now: Date): Date {
  return new Date(now.getTime() - min * 60 * 1000);
}

function makeInput(overrides: Partial<InactivityInput> = {}): InactivityInput {
  const now = new Date('2026-04-21T12:00:00Z');
  return {
    roomId: 'room-1',
    roomName: '거실',
    lastActivityTime: minutesAgo(0, now),
    currentTime: now,
    activity: 'sitting',
    thresholdMinutes: 30,
    ...overrides,
  };
}

describe('analyzeInactivity', () => {
  it('returns null for recent activity', () => {
    const now = new Date('2026-04-21T12:00:00Z');
    const input = makeInput({
      lastActivityTime: minutesAgo(5, now),
      currentTime: now,
      thresholdMinutes: 30,
    });

    const result = analyzeInactivity(input);
    expect(result).toBeNull();
  });

  it('returns null for sleeping activity regardless of time', () => {
    const now = new Date('2026-04-21T12:00:00Z');
    const input = makeInput({
      lastActivityTime: minutesAgo(60, now),
      currentTime: now,
      activity: 'sleeping',
    });

    const result = analyzeInactivity(input);
    expect(result).toBeNull();
  });

  it('returns WARNING at half threshold', () => {
    const now = new Date('2026-04-21T12:00:00Z');
    const input = makeInput({
      lastActivityTime: minutesAgo(16, now),
      currentTime: now,
      thresholdMinutes: 30,
    });

    const result = analyzeInactivity(input);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('inactivity_detected');
    expect(result!.severity).toBe('warning');
    expect(result!.confidence).toBeGreaterThan(0.6);
    expect(result!.confidence).toBeLessThanOrEqual(0.9);
    expect(result!.message).toContain('거실');
    expect(result!.message).toContain('16');
  });

  it('returns CRITICAL at full threshold', () => {
    const now = new Date('2026-04-21T12:00:00Z');
    const input = makeInput({
      lastActivityTime: minutesAgo(35, now),
      currentTime: now,
      thresholdMinutes: 30,
    });

    const result = analyzeInactivity(input);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('inactivity_detected');
    expect(result!.severity).toBe('critical');
    expect(result!.confidence).toBeGreaterThan(0.85);
    expect(result!.confidence).toBeLessThanOrEqual(0.99);
    expect(result!.message).toContain('거실');
    expect(result!.message).toContain('35');
  });

  it('escalation: confidence increases with time', () => {
    const now = new Date('2026-04-21T12:00:00Z');
    const input20 = makeInput({
      lastActivityTime: minutesAgo(20, now),
      currentTime: now,
      thresholdMinutes: 30,
    });
    const input40 = makeInput({
      lastActivityTime: minutesAgo(40, now),
      currentTime: now,
      thresholdMinutes: 30,
    });

    const result20 = analyzeInactivity(input20);
    const result40 = analyzeInactivity(input40);

    expect(result20).not.toBeNull();
    expect(result40).not.toBeNull();
    expect(result40!.confidence).toBeGreaterThan(result20!.confidence);
  });

  it('returns null for zero elapsed time', () => {
    const now = new Date('2026-04-21T12:00:00Z');
    const input = makeInput({
      lastActivityTime: now,
      currentTime: now,
    });

    const result = analyzeInactivity(input);
    expect(result).toBeNull();
  });

  it('message includes room name', () => {
    const now = new Date('2026-04-21T12:00:00Z');
    const input = makeInput({
      lastActivityTime: minutesAgo(20, now),
      currentTime: now,
      roomName: '주방',
    });

    const result = analyzeInactivity(input);
    expect(result).not.toBeNull();
    expect(result!.message).toContain('주방');
    expect(result!.roomName).toBe('주방');
  });

  it('sitting activity can trigger alert', () => {
    const now = new Date('2026-04-21T12:00:00Z');
    const input = makeInput({
      lastActivityTime: minutesAgo(45, now),
      currentTime: now,
      activity: 'sitting',
      thresholdMinutes: 30,
    });

    const result = analyzeInactivity(input);
    expect(result).not.toBeNull();
    expect(result!.severity).toBe('critical');
  });

  it('walking activity does not trigger with recent timestamp', () => {
    const now = new Date('2026-04-21T12:00:00Z');
    const input = makeInput({
      lastActivityTime: minutesAgo(5, now),
      currentTime: now,
      activity: 'walking',
      thresholdMinutes: 30,
    });

    const result = analyzeInactivity(input);
    expect(result).toBeNull();
  });

  it('custom threshold works', () => {
    const now = new Date('2026-04-21T12:00:00Z');

    // 20 min with threshold 60 → 20 < 60*0.5=30 → null
    const input20 = makeInput({
      lastActivityTime: minutesAgo(20, now),
      currentTime: now,
      thresholdMinutes: 60,
    });
    expect(analyzeInactivity(input20)).toBeNull();

    // 40 min with threshold 60 → 40 >= 30 and 40 < 60 → WARNING
    const input40 = makeInput({
      lastActivityTime: minutesAgo(40, now),
      currentTime: now,
      thresholdMinutes: 60,
    });
    const result = analyzeInactivity(input40);
    expect(result).not.toBeNull();
    expect(result!.severity).toBe('warning');
  });
});
