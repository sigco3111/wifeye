"use client";

import AlertBanner from "@/components/AlertBanner";
import FloorPlan from "@/components/FloorPlan";
import VitalSigns from "@/components/VitalSigns";
import ActivityTimeline from "@/components/ActivityTimeline";
import {
  getRoomStates,
  getRecentEvents,
  getStats,
  getSystemStatus,
  updateSensorData,
} from "@/lib/sensor-simulator";
import type { RoomState, TimelineEvent } from "@/lib/sensor-simulator";
import { useState, useEffect, useCallback } from "react";

export default function DashboardPage() {
  const [simulationMode, setSimulationMode] = useState(true);
  const [rooms, setRooms] = useState<RoomState[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [stats, setStats] = useState({
    totalSensors: 0,
    monitoredRooms: 0,
    todayAlerts: 0,
    lastUpdate: new Date(),
  });
  const [systemStatus, setSystemStatus] = useState({
    status: "normal" as "normal" | "warning" | "critical",
    message: "",
  });
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (simulationMode) {
      updateSensorData();
    }
    setRooms(getRoomStates());
    setEvents(getRecentEvents(10));
    setStats(getStats());
    setSystemStatus(getSystemStatus());
  }, [simulationMode]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [refresh]);

  const activeRoom = selectedRoom
    ? rooms.find((r) => r.id === selectedRoom) ?? null
    : null;

  const activityLabels: Record<string, string> = {
    sitting: "앉아 있음",
    walking: "걷기",
    sleeping: "수면",
    standing: "서 있음",
    fallen: "낙상 ⚠️",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              WE
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">WifeEye</h1>
              <p className="text-xs text-gray-500">대시보드</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Simulation Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <button
                onClick={() => setSimulationMode(true)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  simulationMode
                    ? "bg-indigo-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                시뮬레이션
              </button>
              <button
                onClick={() => setSimulationMode(false)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  !simulationMode
                    ? "bg-indigo-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                실시간
              </button>
            </div>
            <span className="text-xs text-gray-600">
              {simulationMode ? "🔵 시뮬레이션 모드" : "🟢 실시간 모드"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Alert Banner */}
        <AlertBanner
          status={systemStatus.status}
          message={systemStatus.message}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5">
            <p className="text-xs text-gray-500 mb-1">센서 수</p>
            <p className="text-2xl font-bold text-white">
              {stats.totalSensors}
            </p>
            <p className="text-xs text-gray-600 mt-1">ESP32-S3</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs text-gray-500 mb-1">모니터링 중인 방</p>
            <p className="text-2xl font-bold text-cyan-400">
              {stats.monitoredRooms}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              / {stats.totalSensors}개 방
            </p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs text-gray-500 mb-1">오늘의 알림</p>
            <p className="text-2xl font-bold text-amber-400">
              {stats.todayAlerts}
            </p>
            <p className="text-xs text-gray-600 mt-1">경고 / 위험</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs text-gray-500 mb-1">마지막 업데이트</p>
            <p className="text-lg font-bold text-white">
              {stats.lastUpdate.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {simulationMode ? "시뮬레이션" : "실시간"}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Floor Plan */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                도면
              </h2>
              <FloorPlan
                rooms={rooms}
                selectedRoom={selectedRoom}
                onSelectRoom={setSelectedRoom}
              />
            </div>
          </div>

          {/* Room Detail / Vital Signs */}
          <div className="space-y-6">
            {activeRoom ? (
              <>
                {/* Selected Room Info */}
                <div className="glass-card p-6">
                  <h2 className="text-lg font-semibold text-white mb-3">
                    {activeRoom.name}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">상태</span>
                      <span
                        className={
                          activeRoom.presence
                            ? "text-green-400"
                            : "text-gray-600"
                        }
                      >
                        {activeRoom.presence
                          ? `사람 있음 (${activeRoom.occupancy}명)`
                          : "비어 있음"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">활동</span>
                      <span className="text-white">
                        {activityLabels[activeRoom.activity] ??
                          activeRoom.activity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                {activeRoom.presence && (
                  <VitalSigns
                    breathingRate={activeRoom.breathingRate}
                    heartRate={activeRoom.heartRate}
                  />
                )}
              </>
            ) : (
              <div className="glass-card p-6 text-center">
                <div className="text-4xl mb-3">🏠</div>
                <p className="text-gray-400 text-sm">
                  도면에서 방을 클릭하면
                  <br />
                  상세 정보가 표시됩니다
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Room Cards */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            방별 상태
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() =>
                  setSelectedRoom(
                    selectedRoom === room.id ? null : room.id
                  )
                }
                className={`glass-card p-5 text-left transition-all ${
                  selectedRoom === room.id
                    ? "border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    {room.name}
                  </h3>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      room.presence
                        ? "bg-green-400 animate-sensor-pulse"
                        : room.activity === "fallen"
                          ? "bg-red-500 animate-sensor-pulse"
                          : "bg-gray-600"
                    }`}
                  />
                </div>
                {room.presence ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">활동</span>
                      <span className="text-gray-300">
                        {activityLabels[room.activity] ?? room.activity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">호흡수</span>
                      <span
                        className={
                          room.breathingRate >= 12 &&
                          room.breathingRate <= 20
                            ? "text-green-400"
                            : "text-amber-400"
                        }
                      >
                        {room.breathingRate.toFixed(1)} bpm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">심박수</span>
                      <span
                        className={
                          room.heartRate >= 60 && room.heartRate <= 100
                            ? "text-green-400"
                            : "text-amber-400"
                        }
                      >
                        {room.heartRate} bpm
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">비어 있음</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            최근 활동
          </h2>
          <ActivityTimeline events={events} />
        </div>
      </main>
    </div>
  );
}
