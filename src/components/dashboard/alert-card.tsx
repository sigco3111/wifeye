'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Info, AlertTriangle, AlertOctagon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Alert } from '@/types';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function AlertCard({ alert, onAcknowledge, onDismiss }: AlertCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getSeverityIcon = () => {
    switch (alert.severity) {
      case 'info':
        return <Info className="w-5 h-5 text-cyan-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getSeverityBorder = () => {
    switch (alert.severity) {
      case 'info':
        return 'border-l-cyan-400';
      case 'warning':
        return 'border-l-amber-400';
      case 'critical':
        return 'border-l-red-400';
      default:
        return 'border-l-cyan-400';
    }
  };

  const getSeverityBadgeColor = () => {
    switch (alert.severity) {
      case 'info':
        return 'bg-cyan-400/20 text-cyan-400';
      case 'warning':
        return 'bg-amber-400/20 text-amber-400';
      case 'critical':
        return 'bg-red-400/20 text-red-400';
      default:
        return 'bg-cyan-400/20 text-cyan-400';
    }
  };

  return (
    <Card
      className={`glass-card slide-in relative overflow-hidden transition-all duration-200 ${
        !alert.acknowledged
          ? 'bg-[rgba(255,255,255,0.05)] border-l-4 ' + getSeverityBorder()
          : 'opacity-60 bg-[rgba(255,255,255,0.02)]'
      } ${isHovered ? 'transform scale-102' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getSeverityIcon()}
            <div className="flex-1">
              <p className="text-[var(--foreground)] font-medium leading-tight">
                {alert.message}
              </p>
              <p className="text-[var(--muted)] text-sm mt-1">
                {alert.roomName}
              </p>
            </div>
          </div>
          <Badge className={`text-xs font-medium ${getSeverityBadgeColor()}`}>
            {alert.severity === 'info' ? '정보' : alert.severity === 'warning' ? '경고' : '위험'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-[var(--muted)] text-sm">
            {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
          </span>
          <div className="flex items-center space-x-2">
            {!alert.acknowledged && (
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="px-3 py-1 text-sm bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent)]/80 transition-colors"
              >
                확인
              </button>
            )}
            <button
              onClick={() => onDismiss(alert.id)}
              className="p-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}