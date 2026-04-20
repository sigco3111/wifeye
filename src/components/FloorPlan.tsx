"use client";

import type { RoomState } from "@/lib/sensor-simulator";

interface FloorPlanProps {
  rooms: RoomState[];
  selectedRoom: string | null;
  onSelectRoom: (roomId: string | null) => void;
}

const defaultRoom: RoomState = {
  id: "",
  name: "",
  presence: false,
  occupancy: 0,
  breathingRate: 0,
  heartRate: 0,
  activity: "standing",
  lastUpdate: new Date(),
};

function getStatusColor(room: RoomState): string {
  if (room.activity === "fallen") return "#ef4444";
  if (room.presence) return "#22c55e";
  return "#374151";
}

function getStatusFill(room: RoomState): string {
  if (room.activity === "fallen") return "rgba(239,68,68,0.15)";
  if (room.presence) return "rgba(34,197,94,0.08)";
  return "rgba(55,65,81,0.1)";
}

export default function FloorPlan({
  rooms,
  selectedRoom,
  onSelectRoom,
}: FloorPlanProps) {
  const roomMap = new Map(rooms.map((r) => [r.id, r]));
  const getRoom = (id: string) => roomMap.get(id) ?? defaultRoom;

  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <svg
        viewBox="0 0 600 340"
        className="absolute inset-0 w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(99,102,241,0.05))" }}
      >
        {/* Background */}
        <rect width="600" height="340" fill="none" rx="12" />

        {/* Outer walls */}
        <rect
          x="20"
          y="20"
          width="560"
          height="300"
          fill="none"
          stroke="rgba(99,102,241,0.2)"
          strokeWidth="2"
          rx="4"
        />

        {/* Grid lines (subtle) */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`vg-${i}`}
            x1={20 + i * 56}
            y1="20"
            x2={20 + i * 56}
            y2="320"
            stroke="rgba(99,102,241,0.03)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`hg-${i}`}
            x1="20"
            y1={20 + i * 60}
            x2="580"
            y2={20 + i * 60}
            stroke="rgba(99,102,241,0.03)"
            strokeWidth="1"
          />
        ))}

        {/* 거실 (Living Room) - Large room left side */}
        <g
          onClick={() => onSelectRoom(selectedRoom === "living" ? null : "living")}
          className="cursor-pointer"
          style={{ transition: "all 0.3s" }}
        >
          <rect
            x="25"
            y="25"
            width="340"
            height="185"
            fill={getStatusFill(getRoom("living"))}
            stroke={getStatusColor(getRoom("living"))}
            strokeWidth={selectedRoom === "living" ? 3 : 1.5}
            rx="4"
            opacity={selectedRoom === "living" ? 1 : 0.7}
          />
          <text x="195" y="100" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">
            거실
          </text>
          <text x="195" y="122" textAnchor="middle" fill="#6b7280" fontSize="11">
            {getRoom("living")?.presence
              ? `사람 ${getRoom("living")?.occupancy}명`
              : "비어 있음"}
          </text>
          {/* Sensor indicator */}
          <circle
            cx="50"
            cy="50"
            r="6"
            fill={getStatusColor(getRoom("living"))}
            className={getRoom("living")?.presence ? "animate-sensor-pulse" : ""}
          />
        </g>

        {/* 침실 (Bedroom) - Top right */}
        <g
          onClick={() => onSelectRoom(selectedRoom === "bedroom" ? null : "bedroom")}
          className="cursor-pointer"
        >
          <rect
            x="370"
            y="25"
            width="205"
            height="185"
            fill={getStatusFill(getRoom("bedroom"))}
            stroke={getStatusColor(getRoom("bedroom"))}
            strokeWidth={selectedRoom === "bedroom" ? 3 : 1.5}
            rx="4"
            opacity={selectedRoom === "bedroom" ? 1 : 0.7}
          />
          <text x="472" y="100" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">
            침실
          </text>
          <text x="472" y="122" textAnchor="middle" fill="#6b7280" fontSize="11">
            {getRoom("bedroom")?.presence
              ? `사람 ${getRoom("bedroom")?.occupancy}명`
              : "비어 있음"}
          </text>
          <circle
            cx="395"
            cy="50"
            r="6"
            fill={getStatusColor(getRoom("bedroom"))}
            className={getRoom("bedroom")?.presence ? "animate-sensor-pulse" : ""}
          />
        </g>

        {/* 주방 (Kitchen) - Bottom left */}
        <g
          onClick={() => onSelectRoom(selectedRoom === "kitchen" ? null : "kitchen")}
          className="cursor-pointer"
        >
          <rect
            x="25"
            y="215"
            width="220"
            height="100"
            fill={getStatusFill(getRoom("kitchen"))}
            stroke={getStatusColor(getRoom("kitchen"))}
            strokeWidth={selectedRoom === "kitchen" ? 3 : 1.5}
            rx="4"
            opacity={selectedRoom === "kitchen" ? 1 : 0.7}
          />
          <text x="135" y="262" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">
            주방
          </text>
          <text x="135" y="284" textAnchor="middle" fill="#6b7280" fontSize="11">
            {getRoom("kitchen")?.presence
              ? `사람 ${getRoom("kitchen")?.occupancy}명`
              : "비어 있음"}
          </text>
          <circle
            cx="50"
            cy="235"
            r="6"
            fill={getStatusColor(getRoom("kitchen"))}
            className={getRoom("kitchen")?.presence ? "animate-sensor-pulse" : ""}
          />
        </g>

        {/* 화장실 (Bathroom) - Bottom right */}
        <g
          onClick={() => onSelectRoom(selectedRoom === "bathroom" ? null : "bathroom")}
          className="cursor-pointer"
        >
          <rect
            x="250"
            y="215"
            width="140"
            height="100"
            fill={getStatusFill(getRoom("bathroom"))}
            stroke={getStatusColor(getRoom("bathroom"))}
            strokeWidth={selectedRoom === "bathroom" ? 3 : 1.5}
            rx="4"
            opacity={selectedRoom === "bathroom" ? 1 : 0.7}
          />
          <text x="320" y="262" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">
            화장실
          </text>
          <text x="320" y="284" textAnchor="middle" fill="#6b7280" fontSize="11">
            {getRoom("bathroom")?.presence
              ? "사람 있음"
              : "비어 있음"}
          </text>
          <circle
            cx="275"
            cy="235"
            r="6"
            fill={getStatusColor(getRoom("bathroom"))}
            className={getRoom("bathroom")?.presence ? "animate-sensor-pulse" : ""}
          />
        </g>

        {/* Door indicators */}
        <rect x="175" y="208" width="30" height="8" fill="#6366f1" opacity="0.3" rx="2" />
        <rect x="465" y="208" width="30" height="8" fill="#6366f1" opacity="0.3" rx="2" />
        <rect x="125" y="208" width="30" height="8" fill="#6366f1" opacity="0.3" rx="2" />
        <rect x="310" y="208" width="30" height="8" fill="#6366f1" opacity="0.3" rx="2" />

        {/* Legend */}
        <circle cx="460" cy="240" r="5" fill="#22c55e" />
        <text x="472" y="244" fill="#9ca3af" fontSize="10">사람 있음</text>
        <circle cx="460" cy="260" r="5" fill="#374151" />
        <text x="472" y="264" fill="#9ca3af" fontSize="10">비어 있음</text>
        <circle cx="460" cy="280" r="5" fill="#ef4444" />
        <text x="472" y="284" fill="#9ca3af" fontSize="10">위험</text>
      </svg>
    </div>
  );
}
