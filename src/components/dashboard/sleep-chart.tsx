'use client';

import React from 'react';
import { generateRecentSleepHistory } from '@/lib/simulation/sleep-generator';
import { SleepSession, SleepStage } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Moon, Clock, Activity } from 'lucide-react';

interface SleepChartProps {
  roomId: string;
}

const stageColors: Record<SleepStage, string> = {
  deep: 'hsl(var(--primary))',
  light: 'hsl(var(--primary) / 0.6)',
  rem: 'hsl(var(--accent))',
  awake: 'hsl(var(--warning))'
};

const getSleepQualityLabel = (score: number): string => {
  if (score >= 85) return '우수';
  if (score >= 70) return '양호';
  if (score >= 55) return '보통';
  return '나쁨';
};

const getSleepQualityColor = (score: number): string => {
  if (score >= 85) return 'text-success';
  if (score >= 70) return 'text-success';
  if (score >= 55) return 'text-warning';
  return 'text-danger';
};

export function SleepChart({ roomId }: SleepChartProps) {
  const sleepHistory = generateRecentSleepHistory(roomId, 1);
  const latestSession = sleepHistory[0];
  
  if (!latestSession) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            수면 패턴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            수면 데이터가 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Prepare chart data for sleep stages
  const chartData = latestSession.stages.map(stage => ({
    time: stage.startTime.getHours() + ':' + String(stage.startTime.getMinutes()).padStart(2, '0'),
    stage: stage.stage,
    duration: stage.duration / (1000 * 60) // Convert to minutes
  }));
  
  // Calculate stats
  const totalDuration = latestSession.totalDuration / (1000 * 60 * 60); // Convert to hours
  const deepSleepDuration = latestSession.stages
    .filter(s => s.stage === 'deep')
    .reduce((sum, stage) => sum + stage.duration, 0) / (1000 * 60 * 60);
  const deepSleepRatio = (deepSleepDuration / totalDuration) * 100;
  const wakeCount = latestSession.stages.filter(s => s.stage === 'awake').length;
  const sleepEfficiency = (totalDuration / 9) * 100; // Assuming 9 hours in bed
  
  return (
<Card className="glass-card">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Moon className="w-5 h-5" />
      수면 패턴
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3 sm:space-y-6">
          {/* Sleep Score Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className={`text-3xl sm:text-5xl font-bold ${getSleepQualityColor(latestSession.score)}`}>
                {latestSession.score}
              </div>
              <div className={`text-base sm:text-lg ${getSleepQualityColor(latestSession.score)}`}>
                {getSleepQualityLabel(latestSession.score)}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {latestSession.startTime.toLocaleDateString('ko-KR')} {latestSession.startTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} -
                {latestSession.endTime?.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          
          {/* Sleep Stage Chart */}
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart 
                data={chartData} 
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
                <XAxis 
                  type="number" 
                  domain={[0, 60]} 
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis 
                  dataKey="time" 
                  type="category"
                  tick={{ fill: 'currentColor', fontSize: 10 }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                  formatter={(value: number) => [`${value}분`, '지속 시간']}
                />
                <Bar dataKey="duration" stackId="a">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={stageColors[entry.stage]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Activity className="w-4 h-4" />
                총 수면 시간
              </div>
              <div className="text-lg sm:text-xl font-semibold mt-1">
                {totalDuration.toFixed(1)}시간
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Moon className="w-4 h-4" />
                깊은 수면 비율
              </div>
              <div className="text-lg sm:text-xl font-semibold mt-1">
                {deepSleepRatio.toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                깨어난 횟수
              </div>
              <div className="text-lg sm:text-xl font-semibold mt-1">
                {wakeCount}회
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Activity className="w-4 h-4" />
                수면 효율성
              </div>
              <div className="text-lg sm:text-xl font-semibold mt-1">
                {sleepEfficiency.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}