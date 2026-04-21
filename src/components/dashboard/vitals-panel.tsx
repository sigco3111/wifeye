'use client';

import React from 'react';
import { useVitalsHistory } from '@/hooks/use-vitals-history';
import { VitalsHistoryPoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Heart, Wind } from 'lucide-react';

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  label: string;
  unit: string;
  icon: React.ReactNode;
}

const Gauge: React.FC<GaugeProps> = ({ value, min, max, normalMin, normalMax, label, unit, icon }) => {
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const strokeDashoffset = circumference * (1 - normalizedValue);
  
  let statusColor = 'stroke-success';
  let statusBg = 'text-success';
  
  if (value < normalMin || value > normalMax) {
    if (value < normalMin - 10 || value > normalMax + 10) {
      statusColor = 'stroke-danger';
      statusBg = 'text-danger';
    } else {
      statusColor = 'stroke-warning';
      statusBg = 'text-warning';
    }
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={statusColor}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-gray-500">{unit}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

interface VitalsPanelProps {
  roomId: string;
}

export function VitalsPanel({ roomId }: VitalsPanelProps) {
  const { history, latestBreathing, latestHeartRate } = useVitalsHistory(roomId);
  
  // Prepare chart data
  const chartData = history.slice(-24).map((point, index) => ({
    time: point.time,
    breathingRate: point.breathingRate,
    heartRate: point.heartRate
  }));
  
  return (
<Card className="glass-card">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Wind className="w-5 h-5" />
      생체신호 모니터링
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3 sm:space-y-6">
          {/* Gauge Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <Gauge
              value={latestBreathing}
              min={8}
              max={30}
              normalMin={12}
              normalMax={20}
              label="호흡수"
              unit="회/분"
              icon={<Wind className="w-4 h-4" />}
            />
            <Gauge
              value={latestHeartRate}
              min={40}
              max={140}
              normalMin={60}
              normalMax={100}
              label="심박수"
              unit="회/분"
              icon={<Heart className="w-4 h-4" />}
            />
          </div>
          
          {/* Chart Row */}
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  tickLine={false}
                  domain={[8, 140]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
                {/* Normal range bands */}
                <ReferenceArea 
                  y1={12} y2={20} 
                  fill="hsl(var(--accent))" 
                  fillOpacity={0.1}
                />
                <ReferenceArea 
                  y1={60} y2={100} 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.1}
                />
                <Area 
                  type="monotone" 
                  dataKey="breathingRate" 
                  stroke="hsl(var(--accent))" 
                  fill="hsl(var(--accent))" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}