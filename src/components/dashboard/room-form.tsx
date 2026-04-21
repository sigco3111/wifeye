"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Room {
  id: string;
  name: string;
  sensorId: string | null;
  registeredOccupancy: number;
  monitoringEnabled: boolean;
  inactivityThresholdMinutes: number;
}

interface RoomFormProps {
  room?: Room;
  onSave: (room: Room) => void;
  onCancel: () => void;
}

export function RoomForm({ room, onSave, onCancel }: RoomFormProps) {
  const [formData, setFormData] = useState({
    name: room?.name || "",
    sensorId: room?.sensorId || "",
    registeredOccupancy: room?.registeredOccupancy || 1,
    monitoringEnabled: room?.monitoringEnabled ?? true,
    inactivityThresholdMinutes: room?.inactivityThresholdMinutes || 30,
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    const roomData: Room = {
      id: room?.id || Date.now().toString(),
      name: formData.name,
      sensorId: formData.sensorId || null,
      registeredOccupancy: formData.registeredOccupancy,
      monitoringEnabled: formData.monitoringEnabled,
      inactivityThresholdMinutes: formData.inactivityThresholdMinutes,
    };
    
    onSave(roomData);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancel}>
      <div 
        className="glass-card p-4 sm:p-6 rounded-lg max-w-md w-full mx-4 slide-in" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {room ? "방 수정" : "새 방 추가"}
          </h2>
          <button onClick={handleCancel} className="p-1 hover:bg-white hover:bg-opacity-20 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">방 이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="방 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">센서 ID (선택)</label>
            <input
              type="text"
              value={formData.sensorId}
              onChange={(e) => setFormData({ ...formData, sensorId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="센서 ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">등록된 인원 수</label>
            <input
              type="number"
              min="1"
              value={formData.registeredOccupancy}
              onChange={(e) => setFormData({ ...formData, registeredOccupancy: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">모니터링 활성화</label>
            <button
              onClick={() => setFormData({ ...formData, monitoringEnabled: !formData.monitoringEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.monitoringEnabled ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.monitoringEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">비활동 임계값 (분)</label>
            <input
              type="number"
              min="1"
              value={formData.inactivityThresholdMinutes}
              onChange={(e) => setFormData({ ...formData, inactivityThresholdMinutes: parseInt(e.target.value) || 30 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}