"use client";

import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from "recharts";
import { Card as CardComponent } from "@/components/ui/card";
import { useState, useMemo } from "react";

// Activity Pie Chart Component
export function ActivityPieChart({ period }: { period: "daily" | "weekly" | "monthly" }) {
  const data = useMemo(() => {
    const baseData = [
      { name: "sleeping", value: 7, color: "#6366f1" },
      { name: "sitting", value: 8, color: "#818cf8" },
      { name: "walking", value: 2, color: "#06b6d4" },
      { name: "standing", value: 3, color: "#22c55e" },
    ];

    if (period === "weekly") {
      return baseData.map(item => ({ ...item, value: item.value * 7 }));
    } else if (period === "monthly") {
      return baseData.map(item => ({ ...item, value: item.value * 30 }));
    }
    return baseData;
  }, [period]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const formattedData = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  return (
    <CardComponent className="h-full">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">활동 요약</h3>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardComponent>
  );
}

// Alert Stats Chart Component
export function AlertStatsChart({ period }: { period: "daily" | "weekly" | "monthly" }) {
  const generateDates = (count: number) => {
    const dates = [];
    const today = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" }));
    }
    return dates;
  };

  const data = useMemo(() => {
    const days = period === "daily" ? 7 : period === "weekly" ? 28 : 180;
    const dates = generateDates(days);
    
    return [
      { date: dates[0], info: Math.floor(Math.random() * 5), warning: Math.floor(Math.random() * 3), critical: Math.floor(Math.random() * 2) },
      { date: dates[1], info: Math.floor(Math.random() * 5), warning: Math.floor(Math.random() * 3), critical: Math.floor(Math.random() * 2) },
      { date: dates[2], info: Math.floor(Math.random() * 5), warning: Math.floor(Math.random() * 3), critical: Math.floor(Math.random() * 2) },
      { date: dates[3], info: Math.floor(Math.random() * 5), warning: Math.floor(Math.random() * 3), critical: Math.floor(Math.random() * 2) },
      { date: dates[4], info: Math.floor(Math.random() * 5), warning: Math.floor(Math.random() * 3), critical: Math.floor(Math.random() * 2) },
      { date: dates[5], info: Math.floor(Math.random() * 5), warning: Math.floor(Math.random() * 3), critical: Math.floor(Math.random() * 2) },
      { date: dates[6], info: Math.floor(Math.random() * 5), warning: Math.floor(Math.random() * 3), critical: Math.floor(Math.random() * 2) },
    ];
  }, [period]);

  return (
    <CardComponent className="h-full">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">알림 통계</h3>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="info" fill="#06b6d4" name="정보" />
              <Bar dataKey="warning" fill="#f59e0b" name="경고" />
              <Bar dataKey="critical" fill="#ef4444" name="위험" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardComponent>
  );
}

// Sleep Trend Chart Component
export function SleepTrendChart({ period }: { period: "daily" | "weekly" | "monthly" }) {
  const generateData = () => {
    const points = period === "daily" ? 24 : period === "weekly" ? 7 : 30;
    const data = [];
    let baseHours = 7;
    
    for (let i = 0; i < points; i++) {
      const variation = (Math.random() - 0.5) * 2;
      data.push({
        time: period === "daily" ? `${i}:00` : 
              period === "weekly" ? `Day ${i + 1}` : 
              new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
        hours: Math.max(4, Math.min(10, baseHours + variation))
      });
    }
    return data;
  };

  const data = useMemo(generateData, [period]);

  return (
<CardComponent className="h-full">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">수면 리포트</h3>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[4, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ fill: "#6366f1", r: 3 }}
              />
              <Area 
                type="monotone" 
                dataKey="hours" 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardComponent>
  );
}

// Room Usage Grid Component
export function RoomUsageGrid({ period }: { period: "daily" | "weekly" | "monthly" }) {
  const rooms = [
    { name: "거실", hours: period === "daily" ? 8 : period === "weekly" ? 56 : 240 },
    { name: "침실", hours: period === "daily" ? 10 : period === "weekly" ? 70 : 300 },
    { name: "주방", hours: period === "daily" ? 6 : period === "weekly" ? 42 : 180 },
    { name: "화장실", hours: period === "daily" ? 2 : period === "weekly" ? 14 : 60 },
  ];

  const maxHours = Math.max(...rooms.map(r => r.hours));

  return (
    <CardComponent className="h-full">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">방별 사용 현황</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-48">
          {rooms.map((room, index) => {
            const intensity = (room.hours / maxHours) * 100;
            return (
              <div key={index} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-gray-50">
                <div 
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg mb-2"
                  style={{ 
                    backgroundColor: `rgba(99, 102, 241, ${intensity / 100})`,
                    border: '2px solid #6366f1'
                  }}
                />
                <div className="text-center">
                  <div className="font-medium text-sm sm:text-base">{room.name}</div>
                  <div className="text-sm text-gray-600">{room.hours}시간</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CardComponent>
  );
}

// Vitals Trend Chart Component
export function VitalsTrendChart({ period }: { period: "daily" | "weekly" | "monthly" }) {
  const generateData = () => {
    const points = period === "daily" ? 24 : period === "weekly" ? 7 : 30;
    const data = [];
    
    for (let i = 0; i < points; i++) {
      data.push({
        time: period === "daily" ? `${i}:00` : 
              period === "weekly" ? `Day ${i + 1}` : 
              new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
        breathingRate: 12 + (Math.random() - 0.5) * 4,
        heartRate: 70 + (Math.random() - 0.5) * 10
      });
    }
    return data;
  };

  const data = useMemo(generateData, [period]);

  return (
<CardComponent className="w-full">
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">생체신호 평균 추이</h3>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" domain={[8, 16]} label={{ value: "호흡수", angle: -90, position: "insideLeft" }} />
              <YAxis yAxisId="right" domain={[60, 80]} orientation="right" label={{ value: "심박수", angle: 90, position: "insideRight" }} />
              <Tooltip />
              <Legend />
              <ReferenceArea 
                yAxisId="left" x1="0" x2="0" y1={8} y2={16} stroke="green" fill="green" fillOpacity={0.1} />
              <ReferenceArea 
                yAxisId="left" x1="0" x2="0" y1={16} y2={24} stroke="yellow" fill="yellow" fillOpacity={0.1} />
              <ReferenceArea 
                yAxisId="right" x1="0" x2="0" y1={60} y2={100} stroke="green" fill="green" fillOpacity={0.1} />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="breathingRate" 
                stroke="#06b6d4" 
                strokeWidth={2}
                name="평균 호흡수"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#6366f1" 
                strokeWidth={2}
                name="평균 심박수"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardComponent>
  );
}