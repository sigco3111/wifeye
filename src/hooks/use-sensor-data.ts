'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSensorStore } from '@/stores/sensor-store';
import { SimulationEngine } from '@/lib/simulation/engine';
import { createMQTTClient } from '@/lib/mqtt/client';
import { TOPICS } from '@/lib/mqtt/topics';
import {
  parseCSIData,
  parseVitalsData,
  parseActivityData,
  extractRoomId,
} from '@/lib/mqtt/parser';
import type { ConnectionStatus } from '@/types';

interface UseSensorDataReturn {
  rooms: Map<string, import('@/types').RoomState>;
  events: import('@/types').TimelineEvent[];
  system: import('@/types').SystemInfo;
  simulationMode: boolean;
  setSimulationMode: (enabled: boolean) => void;
}

export function useSensorData(): UseSensorDataReturn {
  const rooms = useSensorStore((s) => s.rooms);
  const events = useSensorStore((s) => s.events);
  const system = useSensorStore((s) => s.system);
  const simulationMode = useSensorStore((s) => s.system.simulationMode);
  const setSimulationMode = useSensorStore((s) => s.setSimulationMode);
  const updateRoom = useSensorStore((s) => s.updateRoom);
  const appendVitals = useSensorStore((s) => s.appendVitals);
  const addEvent = useSensorStore((s) => s.addEvent);
  const updateSystem = useSensorStore((s) => s.updateSystem);

  const engineRef = useRef<SimulationEngine | null>(null);
  const mountedRef = useRef(false);

  const handleMQTTMessage = useCallback(
    (topic: string, payload: string) => {
      const roomId = extractRoomId(topic);
      if (!roomId) return;

      if (topic.includes('/csi')) {
        const data = parseCSIData(payload);
        if (data) {
          updateRoom(roomId, {
            ...data,
            roomId,
            lastUpdate: new Date(),
          });
        }
      } else if (topic.includes('/vitals')) {
        const data = parseVitalsData(payload);
        if (data) {
          const now = new Date();
          const time = now.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          updateRoom(roomId, {
            breathingRate: data.breathingRate,
            heartRate: data.heartRate,
            lastUpdate: now,
          });
          appendVitals(roomId, {
            time,
            breathingRate: data.breathingRate,
            heartRate: data.heartRate,
          });
        }
      } else if (topic.includes('/activity')) {
        const data = parseActivityData(payload);
        if (data) {
          updateRoom(roomId, {
            activity: data.activity as import('@/types').ActivityState,
            occupancy: data.occupancy,
            presence: data.presence,
            lastActivityTime: new Date(),
            lastUpdate: new Date(),
          });
        }
      }
    },
    [updateRoom, appendVitals],
  );

  useEffect(() => {
    mountedRef.current = true;

    // initialize simulation mode from environment variable (defaults to 'true')
    const envSim = process.env.NEXT_PUBLIC_SIMULATION_MODE;
    const shouldSimulate = envSim ? envSim === 'true' : true;
    setSimulationMode(shouldSimulate);

    if (simulationMode) {
      const engine = new SimulationEngine();
      engineRef.current = engine;
      engine.start(2000);
      updateSystem({ mqttStatus: 'disconnected' as ConnectionStatus });
    } else {
      const mqtt = createMQTTClient({
        url: process.env.NEXT_PUBLIC_MQTT_URL || 'ws://localhost:9001',
      });

      mqtt.onStatusChange((status: ConnectionStatus) => {
        if (mountedRef.current) {
          updateSystem({ mqttStatus: status });
        }
      });

      const topics = [
        TOPICS.sensorCSI('+'),
        TOPICS.sensorVitals('+'),
        TOPICS.sensorActivity('+'),
      ];

      topics.forEach((topic) => {
        mqtt.subscribe(topic, handleMQTTMessage);
      });

      mqtt.connect().catch((err: unknown) => {
        console.error('[useSensorData] MQTT connection failed:', err);
      });

      return () => {
        mountedRef.current = false;
        topics.forEach((topic) => mqtt.unsubscribe(topic));
        mqtt.disconnect();
      };
    }

    return () => {
      mountedRef.current = false;
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, [simulationMode, updateSystem, handleMQTTMessage]);

  return { rooms, events, system, simulationMode, setSimulationMode };
}
