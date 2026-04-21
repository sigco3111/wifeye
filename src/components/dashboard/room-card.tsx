"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { AlertTriangle, Footprints, Moon, User, Users, Armchair } from "lucide-react";

interface RoomState {
  roomId: string;
  roomName: string;
  presence: boolean;
  occupancy: number;
  breathingRate: number;
  heartRate: number;
  activity: "sitting" | "walking" | "sleeping" | "standing" | "fallen";
  lastActivityTime: Date;
  lastUpdate: Date;
}

interface RoomCardProps {
  room: RoomState;
  onEdit: (roomId: string) => void;
  onClick: (roomId: string) => void;
}

export function RoomCard({ room, onEdit, onClick }: RoomCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    if (!room.presence) return "bg-gray-400";
    if (room.activity === "fallen") return "bg-red-500";
    if (room.activity === "sleeping") return "bg-blue-500";
    return "bg-green-500";
  };

  const getActivityIcon = () => {
    switch (room.activity) {
      case "sitting":
        return <Armchair className="w-4 h-4" />;
      case "walking":
        return <Footprints className="w-4 h-4" />;
      case "sleeping":
        return <Moon className="w-4 h-4" />;
      case "standing":
        return <User className="w-4 h-4" />;
      case "fallen":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getSensorStatusColor = () => {
    const timeSinceUpdate = Date.now() - room.lastUpdate.getTime();
    if (timeSinceUpdate < 30000) return "bg-green-500";
    if (timeSinceUpdate < 120000) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div
      className="glass-card relative p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg min-h-[100px]"
      onClick={() => onClick(room.roomId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <h3 className="font-semibold text-lg">{room.roomName}</h3>
        </div>
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(room.roomId);
            }}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{room.occupancy}</span>
          </div>
          <div className="flex items-center gap-2">
            {getActivityIcon()}
            <span className="text-xs text-muted-foreground capitalize">{room.activity}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getSensorStatusColor()}`} />
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(room.lastUpdate, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}