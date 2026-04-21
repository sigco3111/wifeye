"use client";

import { useState } from "react";
import { useSensorStore } from "@/stores/sensor-store";
import { RoomCard } from "@/components/dashboard/room-card";
import { RoomForm } from "@/components/dashboard/room-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Room } from "@/types";

export default function RoomsPage() {
  const { rooms, addRoom, removeRoom, updateRoomConfig } = useSensorStore();
  const [editingRoom, setEditingRoom] = useState<Room | null | undefined>(null);

  const roomStates = Array.from(rooms.values());

  const handleEdit = (roomId: string) => {
    const roomState = rooms.get(roomId);
    if (roomState) {
      const room: Room = {
        id: roomState.roomId,
        name: roomState.roomName,
        sensorId: null,
        registeredOccupancy: 1,
        monitoringEnabled: true,
        inactivityThresholdMinutes: 30,
      };
      setEditingRoom(room);
    }
  };

  const handleAdd = () => {
    setEditingRoom(undefined);
  };

  const handleSave = (room: Room) => {
    if (editingRoom === undefined) {
      addRoom(room);
    } else {
      updateRoomConfig(room.id, room);
    }
    setEditingRoom(null);
  };

  const handleDelete = (roomId: string) => {
    if (confirm("정말로 이 방을 삭제하시겠습니까?")) {
      removeRoom(roomId);
    }
  };

  const handleCancel = () => {
    setEditingRoom(null);
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">방 관리</h1>
        <Button onClick={handleAdd} className="min-h-[44px] min-w-[44px] px-4">
          <Plus className="w-4 h-4 mr-2" />
          방 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {roomStates.map((room) => (
          <RoomCard
            key={room.roomId}
            room={room}
            onEdit={handleEdit}
            onClick={(roomId) => {
            }}
          />
        ))}
      </div>

      {editingRoom !== null && (
        <RoomForm
          room={editingRoom === undefined ? undefined : editingRoom}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}