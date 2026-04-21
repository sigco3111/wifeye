'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Footprints, UserCheck, Heart, AlertTriangle, Shield, Eye, Clock, LogIn 
} from 'lucide-react';
import { TimelineEvent, AlertSeverity } from '@/types';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'movement':
        return <Footprints className="h-4 w-4" />;
      case 'presence_change':
        return <UserCheck className="h-4 w-4" />;
      case 'vitals_warning':
        return <Heart className="h-4 w-4" />;
      case 'fall_detected':
        return <AlertTriangle className="h-4 w-4" />;
      case 'intrusion_detected':
        return <Shield className="h-4 w-4" />;
      case 'anomaly_detected':
        return <Eye className="h-4 w-4" />;
      case 'inactivity_detected':
        return <Clock className="h-4 w-4" />;
      case 'entry_exit':
        return <LogIn className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'info':
        return 'bg-cyan-500/20 text-cyan-400';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400';
      case 'critical':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  return (
    <Card className="p-3 sm:p-4">
      <ScrollArea className="h-48 sm:h-64">
        <div className="space-y-3">
          {events.slice(0, 10).map((event) => (
            <div key={event.id} className="flex items-start space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors">
              <div className="flex-shrink-0 text-[var(--primary)]">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--foreground)] truncate">{event.message}</p>
                  <Badge className={cn('ml-2 px-2 py-0.5 text-xs', getSeverityColor(event.severity))}>
                    {event.severity}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {event.roomName} · {formatRelativeTime(event.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}