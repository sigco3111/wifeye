import { describe, it, expect } from 'vitest';
import { analyzeFall } from '@/lib/detection/fall-detector';
import type { DetectionInput } from '@/lib/detection/types';

function makeInput(overrides: Partial<DetectionInput['currentState']> = {}): DetectionInput {
  return {
    roomId: 'room-1',
    roomName: '거실',
    currentState: {
      presence: true,
      occupancy: 1,
      activity: 'sitting',
      registeredOccupancy: 1,
      lastActivityTime: new Date(),
      ...overrides,
    },
    currentTime: new Date(),
    recentEvents: [],
    activityHistory: [],
  };
}

describe('analyzeFall', () => {
  it('returns CRITICAL detection when activity is "fallen"', () => {
    const input = makeInput({ activity: 'fallen' });
    const result = analyzeFall(input);

    expect(result).not.toBeNull();
    expect(result!.detected).toBe(true);
    expect(result!.type).toBe('fall_detected');
    expect(result!.severity).toBe('critical');
    expect(result!.confidence).toBe(0.9);
    expect(result!.message).toContain('거실');
    expect(result!.message).toContain('낙상');
    expect(result!.roomId).toBe('room-1');
  });

  it('returns null when activity is "standing"', () => {
    const input = makeInput({ activity: 'standing' });
    expect(analyzeFall(input)).toBeNull();
  });

  it('returns null when activity is "sitting"', () => {
    const input = makeInput({ activity: 'sitting' });
    expect(analyzeFall(input)).toBeNull();
  });

  it('returns null when activity is "walking"', () => {
    const input = makeInput({ activity: 'walking' });
    expect(analyzeFall(input)).toBeNull();
  });

  it('returns null when activity is "sleeping"', () => {
    const input = makeInput({ activity: 'sleeping' });
    expect(analyzeFall(input)).toBeNull();
  });
});
