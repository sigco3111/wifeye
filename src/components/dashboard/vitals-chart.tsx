'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useVitalsHistory } from '@/hooks/use-vitals-history';
import { VitalsHistoryPoint } from '@/types';

interface VitalsChartProps {
  roomId: string;
}

export function VitalsChart({ roomId }: VitalsChartProps) {
  const { history } = useVitalsHistory(roomId);

  const chartData = history.map((point) => ({
    time: point.time,
    breathingRate: point.breathingRate,
    heartRate: point.heartRate,
  }));

  return (
    <div className="w-full min-h-[200px] h-full">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="breathingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="time" 
            stroke="var(--muted)"
            tick={{ fill: 'var(--muted)', fontSize: 10 }}
          />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="var(--accent)"
            domain={[8, 25]}
            tick={{ fill: 'var(--accent)', fontSize: 10 }}
            label={{ value: '호흡수 (회/분)', position: 'insideLeft', style: { fill: 'var(--accent)' } }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="var(--primary)"
            domain={[50, 120]}
            tick={{ fill: 'var(--primary)', fontSize: 10 }}
            label={{ value: '심박수 (회/분)', position: 'insideRight', style: { fill: 'var(--primary)' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface)', 
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
          />
          <Area 
            yAxisId="left" 
            type="monotone" 
            dataKey="breathingRate" 
            stroke="#06b6d4" 
            fillOpacity={1} 
            fill="url(#breathingGradient)" 
            strokeWidth={2}
            name="호흡수"
          />
          <Area 
            yAxisId="right" 
            type="monotone" 
            dataKey="heartRate" 
            stroke="#6366f1" 
            fillOpacity={1} 
            fill="url(#heartRateGradient)" 
            strokeWidth={2}
            name="심박수"
          />
          <ReferenceLine yAxisId="left" y={12} stroke="var(--accent)" strokeDasharray="5 5" />
          <ReferenceLine yAxisId="right" y={72} stroke="var(--primary)" strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}