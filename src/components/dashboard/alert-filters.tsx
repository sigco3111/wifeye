'use client';

import { useState, useEffect } from 'react';
import { Select } from '@/components/ui/select';
import { useSensorStore } from '@/stores/sensor-store';
import type { AlertSeverity } from '@/types';

interface AlertFiltersProps {
  filters: {
    severity?: AlertSeverity;
    roomId?: string;
    acknowledged?: boolean;
  };
  onChange: (filters: {
    severity?: AlertSeverity;
    roomId?: string;
    acknowledged?: boolean;
  }) => void;
}

export function AlertFilters({ filters, onChange }: AlertFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const rooms = useSensorStore((state) => Array.from(state.rooms.values()));
  const roomOptions = [
    { value: '', label: '전체' },
    ...rooms.map((room) => ({ value: room.roomId, label: room.roomName })),
  ];

  const severityOptions = [
    { value: '', label: '전체' },
    { value: 'info', label: '정보' },
    { value: 'warning', label: '경고' },
    { value: 'critical', label: '위험' },
  ];

  const statusOptions = [
    { value: undefined, label: '전체' },
    { value: false, label: '미확인' },
    { value: true, label: '확인됨' },
  ];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSeverityChange = (value: string) => {
    const severity = value as AlertSeverity | undefined;
    const newFilters = { ...localFilters, severity };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleRoomChange = (value: string) => {
    const roomId = value || undefined;
    const newFilters = { ...localFilters, roomId };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleStatusChange = (value: boolean | undefined) => {
    const acknowledged = value === undefined ? undefined : value;
    const newFilters = { ...localFilters, acknowledged };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-[var(--surface)] rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <label className="text-[var(--foreground)] text-sm font-medium">심각도</label>
        <Select
          value={localFilters.severity || ''}
          onChange={(e) => handleSeverityChange(e.target.value)}
          className="w-full sm:w-32 mt-1 sm:mt-0"
        >
          {severityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto mt-3 sm:mt-0">
        <label className="text-[var(--foreground)] text-sm font-medium">방</label>
        <Select
          value={localFilters.roomId || ''}
          onChange={(e) => handleRoomChange(e.target.value)}
          className="w-full sm:w-32 mt-1 sm:mt-0"
        >
          {roomOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto mt-3 sm:mt-0">
        <label className="text-[var(--foreground)] text-sm font-medium">상태</label>
        <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
          {statusOptions.map((option) => (
            <button
              key={option.value === undefined ? 'undefined' : option.value.toString()}
              onClick={() => handleStatusChange(option.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors min-h-[44px] ${
                (option.value === undefined && localFilters.acknowledged === undefined) ||
                (option.value !== undefined && localFilters.acknowledged === option.value)
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface)]/80'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}