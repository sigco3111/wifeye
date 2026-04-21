'use client';

import { useState } from 'react';
import { useSensorData } from '@/hooks/use-sensor-data';
import { useVitalsHistory } from '@/hooks/use-vitals-history';
import { FloorPlan } from '@/components/dashboard/floor-plan';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { VitalsChart } from '@/components/dashboard/vitals-chart';
import { ActivityTimeline } from '@/components/dashboard/activity-timeline';
import { AlertBanner } from '@/components/dashboard/alert-banner';
import { SystemInfo } from '@/types';

export default function DashboardPage() {
  const { rooms, events, system } = useSensorData();
  const [selectedRoomId, setSelectedRoomId] = useState('living-room');

  return (
    <div className="space-y-6">
      <AlertBanner system={system} />
      <StatsGrid system={system} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <div className="h-64 sm:h-96">
          <FloorPlan 
            rooms={rooms} 
            selectedRoomId={selectedRoomId}
            onRoomClick={setSelectedRoomId}
          />
        </div>
        <div className="h-64 sm:h-96">
          <VitalsChart roomId={selectedRoomId} />
        </div>
      </div>
      
      <ActivityTimeline events={events} />
    </div>
  );
}
