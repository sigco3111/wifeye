'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createMQTTClient } from '@/lib/mqtt/client';
import type { ConnectionStatus } from '@/types';

interface UseMQTTConfig {
  url?: string;
}

interface UseMQTTReturn {
  status: ConnectionStatus;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useMQTT(config?: UseMQTTConfig): UseMQTTReturn {
  const url = config?.url ?? process.env.NEXT_PUBLIC_MQTT_URL ?? 'ws://localhost:9001';
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const clientRef = useRef<ReturnType<typeof createMQTTClient> | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const client = createMQTTClient({ url });
    clientRef.current = client;

    const unsubscribe = client.onStatusChange((newStatus: ConnectionStatus) => {
      if (mountedRef.current) {
        setStatus(newStatus);
      }
    });

    return () => {
      mountedRef.current = false;
      unsubscribe();
      client.disconnect();
      clientRef.current = null;
    };
  }, [url]);

  const connect = useCallback(async () => {
    const client = clientRef.current;
    if (client) {
      await client.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    const client = clientRef.current;
    if (client) {
      client.disconnect();
    }
  }, []);

  return { status, connect, disconnect };
}
