'use client';

import { useState } from 'react';
import { cn } from '../../lib/utils';
import { RoomState } from '@/types';

interface FloorPlanProps {
  rooms: Map<string, RoomState>;
  selectedRoomId: string;
  onRoomClick: (roomId: string) => void;
}

export function FloorPlan({ rooms, selectedRoomId, onRoomClick }: FloorPlanProps) {
  const roomConfigs = [
    { id: 'living-room', name: '거실', x: 50, y: 50, width: 200, height: 150 },
    { id: 'bedroom', name: '침실', x: 50, y: 220, width: 150, height: 120 },
    { id: 'kitchen', name: '주방', x: 260, y: 50, width: 180, height: 100 },
    { id: 'bathroom', name: '화장실', x: 260, y: 170, width: 80, height: 80 },
  ];

  const getRoomColor = (room: RoomState) => {
    if (!room.presence) return 'rgba(255,255,255,0.03)';
    if (room.activity === 'fallen') return 'rgba(239, 68, 68, 0.2)';
    if (room.breathingRate < 8 || room.breathingRate > 25 || room.heartRate < 50 || room.heartRate > 120) {
      return 'rgba(245, 158, 11, 0.2)';
    }
    return 'rgba(34, 197, 94, 0.2)';
  };

  return (
    <svg viewBox="0 0 500 400" className="w-full h-full min-h-[200px] max-w-full">
      {roomConfigs.map((config) => {
        const room = rooms.get(config.id);
        if (!room) return null;

        const isSelected = config.id === selectedRoomId;
        const color = getRoomColor(room);

        return (
          <g key={config.id} onClick={() => onRoomClick(config.id)}>
            <rect
              x={config.x}
              y={config.y}
              width={config.width}
              height={config.height}
              fill={color}
              stroke={isSelected ? 'var(--primary)' : 'var(--border)'}
              strokeWidth={isSelected ? 2 : 1}
              className="cursor-pointer transition-all hover:opacity-80"
              rx="8"
            />
            <text
              x={config.x + config.width / 2}
              y={config.y + config.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--foreground)] text-sm font-medium pointer-events-none"
            >
              {config.name}
            </text>
            {room.presence && (
              <circle
                cx={config.x + 20}
                cy={config.y + 20}
                r="6"
                fill="var(--primary)"
                className="sensor-pulse"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}