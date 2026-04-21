"use client";

import { useSensorStore } from "@/stores/sensor-store";
import { useAlertStore } from "@/stores/alert-store";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Settings, Wifi, Bell, Shield, Database } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { system, setSimulationMode, reset: resetSensorStore } = useSensorStore();
  const { acknowledgeAll } = useAlertStore();
  
  const [alertSoundEnabled, setAlertSoundEnabled] = useState(true);
  const [severityToggles, setSeverityToggles] = useState({
    info: true,
    warning: true,
    critical: true
  });
  const [inactivityThreshold, setInactivityThreshold] = useState(30);
  const [intrusionDetection, setIntrusionDetection] = useState(true);
  const [nightModeStart, setNightModeStart] = useState(22);
  const [nightModeEnd, setNightModeEnd] = useState(6);
  const [sensitivity, setSensitivity] = useState(5);
  const [reconnectEnabled, setReconnectEnabled] = useState(true);

  const handleSeverityToggle = (severity: keyof typeof severityToggles, enabled: boolean) => {
    setSeverityToggles(prev => ({ ...prev, [severity]: enabled }));
  };

  const handleReset = () => {
    if (window.confirm("정말로 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      resetSensorStore();
      acknowledgeAll();
    }
  };

  const getMqttStatusColor = () => {
    switch (system.mqttStatus) {
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-red-500";
      case "reconnecting":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMqttStatusText = () => {
    switch (system.mqttStatus) {
      case "connected":
        return "연결됨";
      case "disconnected":
        return "연결 끊김";
      case "reconnecting":
        return "재연결 중";
      default:
        return "알 수 없음";
    }
  };

  return (
<div className="container mx-auto p-3 sm:p-6 space-y-6">
      {/* Section 1: System */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold">시스템</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">시뮬레이션 모드</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {system.simulationMode ? "시뮬레이션 모드" : "실제 모드"}
              </span>
              <Switch
                checked={system.simulationMode}
                onCheckedChange={setSimulationMode}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Section 2: MQTT Connection */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Wifi className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold">MQTT 연결</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">브로커 URL</span>
            <input
              type="text"
              defaultValue="ws://localhost:9001"
              className="px-3 py-2 bg-surface border border-border rounded-md text-sm w-full sm:w-64"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">연결 상태</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getMqttStatusColor()}`}></div>
              <span className="text-sm text-muted-foreground">{getMqttStatusText()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">자동 재연결</span>
            <Switch
              checked={reconnectEnabled}
              onCheckedChange={setReconnectEnabled}
            />
          </div>
        </div>
      </Card>

      {/* Section 3: Alerts */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold">알림 설정</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">알림 사운드</span>
            <Switch
              checked={alertSoundEnabled}
              onCheckedChange={setAlertSoundEnabled}
            />
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">심각도</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">정보</span>
                <Switch
                  checked={severityToggles.info}
                  onCheckedChange={(val) => handleSeverityToggle("info", val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">경고</span>
                <Switch
                  checked={severityToggles.warning}
                  onCheckedChange={(val) => handleSeverityToggle("warning", val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">위험</span>
                <Switch
                  checked={severityToggles.critical}
                  onCheckedChange={(val) => handleSeverityToggle("critical", val)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">미이동 임계값 (분)</span>
<input
  type="number"
  value={inactivityThreshold}
  onChange={(e) => setInactivityThreshold(Number(e.target.value))}
  className="px-3 py-2 bg-surface border border-border rounded-md text-sm w-full sm:w-20"
/>
          </div>
        </div>
      </Card>

      {/* Section 4: Security */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold">보안 설정</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">침입 감지</span>
            <Switch
              checked={intrusionDetection}
              onCheckedChange={setIntrusionDetection}
            />
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">야간 모드 시간 범위</span>
            <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm">시작:</span>
<input
  type="number"
  value={nightModeStart}
  onChange={(e) => setNightModeStart(Number(e.target.value))}
  className="px-3 py-2 bg-surface border border-border rounded-md text-sm w-full sm:w-16"
/>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">종료:</span>
<input
  type="number"
  value={nightModeEnd}
  onChange={(e) => setNightModeEnd(Number(e.target.value))}
  className="px-3 py-2 bg-surface border border-border rounded-md text-sm w-full sm:w-16"
/>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-medium">감도</span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">1</span>
              <Slider
                value={[sensitivity.toString()]}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                min={1}
                max={10}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">10</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 5: Data Management */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold">데이터 관리</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">데이터 초기화</span>
            <Button variant="default" onClick={handleReset} className="min-h-[44px] min-w-[44px] px-4">
              스토어 초기화
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}