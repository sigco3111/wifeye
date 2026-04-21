import { describe, it, expect } from 'vitest';
import {
  parseCSIData,
  parseVitalsData,
  parseActivityData,
  parseAlertData,
  extractRoomId,
} from '@/lib/mqtt/parser';

describe('parseCSIData', () => {
  it('parses valid CSI JSON payload', () => {
    const raw = JSON.stringify({
      roomId: 'living-room',
      timestamp: 1713700000,
      amplitude: [0.5, 0.3, 0.8],
      phase: [1.2, 0.9, 2.1],
    });

    const result = parseCSIData(raw);

    expect(result).not.toBeNull();
    expect(result?.roomId).toBe('living-room');
    expect(result?.timestamp).toBe(1713700000);
  });

  it('returns null for invalid JSON', () => {
    const result = parseCSIData('not-json{{{');
    expect(result).toBeNull();
  });

  it('returns null for non-object JSON', () => {
    expect(parseCSIData('"hello"')).toBeNull();
    expect(parseCSIData('42')).toBeNull();
    expect(parseCSIData('null')).toBeNull();
  });

  it('returns partial result when fields are missing', () => {
    const raw = JSON.stringify({ roomId: 'bedroom' });
    const result = parseCSIData(raw);

    expect(result).not.toBeNull();
    expect(result?.roomId).toBe('bedroom');
    expect(result?.timestamp).toBeUndefined();
  });
});

describe('parseVitalsData', () => {
  it('parses valid vitals payload', () => {
    const raw = JSON.stringify({ breathingRate: 16, heartRate: 72 });
    const result = parseVitalsData(raw);

    expect(result).toEqual({ breathingRate: 16, heartRate: 72 });
  });

  it('returns null for invalid JSON', () => {
    expect(parseVitalsData('bad')).toBeNull();
  });

  it('returns null when fields are wrong types', () => {
    const raw = JSON.stringify({ breathingRate: 'fast', heartRate: 72 });
    expect(parseVitalsData(raw)).toBeNull();
  });

  it('returns null when required fields are missing', () => {
    const raw = JSON.stringify({ breathingRate: 16 });
    expect(parseVitalsData(raw)).toBeNull();
  });
});

describe('parseActivityData', () => {
  it('parses valid activity payload', () => {
    const raw = JSON.stringify({
      activity: 'walking',
      occupancy: 1,
      presence: true,
    });
    const result = parseActivityData(raw);

    expect(result).toEqual({
      activity: 'walking',
      occupancy: 1,
      presence: true,
    });
  });

  it('returns null for invalid JSON', () => {
    expect(parseActivityData('{bad')).toBeNull();
  });

  it('returns null when occupancy is not a number', () => {
    const raw = JSON.stringify({
      activity: 'sitting',
      occupancy: 'two',
      presence: true,
    });
    expect(parseActivityData(raw)).toBeNull();
  });

  it('returns null when presence is not a boolean', () => {
    const raw = JSON.stringify({
      activity: 'idle',
      occupancy: 0,
      presence: 'yes',
    });
    expect(parseActivityData(raw)).toBeNull();
  });
});

describe('parseAlertData', () => {
  it('parses valid alert payload', () => {
    const raw = JSON.stringify({
      type: 'intrusion',
      severity: 'high',
      message: 'Unknown person detected in living room',
    });
    const result = parseAlertData(raw);

    expect(result).toEqual({
      type: 'intrusion',
      severity: 'high',
      message: 'Unknown person detected in living room',
    });
  });

  it('returns null for invalid JSON', () => {
    expect(parseAlertData('not-json')).toBeNull();
  });

  it('returns null when severity is not a string', () => {
    const raw = JSON.stringify({
      type: 'fall',
      severity: 3,
      message: 'Fall detected',
    });
    expect(parseAlertData(raw)).toBeNull();
  });
});

describe('extractRoomId', () => {
  it('extracts room ID from CSI topic', () => {
    expect(extractRoomId('wifeye/sensor/living-room/csi')).toBe('living-room');
  });

  it('extracts room ID from vitals topic', () => {
    expect(extractRoomId('wifeye/sensor/bedroom/vitals')).toBe('bedroom');
  });

  it('extracts room ID from activity topic', () => {
    expect(extractRoomId('wifeye/sensor/kitchen/activity')).toBe('kitchen');
  });

  it('extracts room ID from alert topic', () => {
    expect(extractRoomId('wifeye/alert/bathroom')).toBe('bathroom');
  });

  it('extracts room ID from status topic', () => {
    expect(extractRoomId('wifeye/status/office')).toBe('office');
  });

  it('returns null for non-matching topic', () => {
    expect(extractRoomId('wifeye/unknown/topic')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractRoomId('')).toBeNull();
  });

  it('returns null for system status topic (no room ID)', () => {
    expect(extractRoomId('wifeye/status/system')).toBe('system');
  });
});
