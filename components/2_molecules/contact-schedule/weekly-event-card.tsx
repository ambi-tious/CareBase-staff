'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, User, MapPin, Edit3, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface WeeklyEventCardProps {
  event: {
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    status: string;
    assignedTo: string;
    startTime: string;
    endTime?: string;
    relatedResidentName?: string;
  };
  compact?: boolean;
  showActions?: boolean;
  onClick?: () => void;
  className?: string;
}

export const WeeklyEventCard: React.FC<WeeklyEventCardProps> = ({
  event,
  compact = false,
  showActions = false,
  onClick,
  className = '',
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case '予定':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case '連絡事項':
        return 'bg-green-50 border-green-200 text-green-800';
      case '申し送り':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = `/contact-schedule/${event.id}`;
    }
  };

  if (compact) {
    return (
      <div
        className={`
          p-2 rounded-md border-l-4 cursor-pointer
          transition-all duration-200 hover:shadow-sm hover:scale-[1.02]
          ${getTypeColor(event.type)} ${getPriorityIndicator(event.priority)} ${className}
        `}
        onClick={handleClick}
      >
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <Clock className="h-3 w-3" />
          <span>
            {event.startTime}
            {event.endTime && ` - ${event.endTime}`}
          </span>
        </div>
        <div className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{event.title}</div>
        {event.relatedResidentName && (
          <div className="text-xs text-blue-600 font-medium">対象: {event.relatedResidentName}</div>
        )}
      </div>
    );
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2">{event.title}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Clock className="h-3 w-3" />
              <span>
                {event.startTime}
                {event.endTime && ` - ${event.endTime}`}
              </span>
            </div>
          </div>
          {showActions && (
            <div className="flex gap-1 ml-2">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{event.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Badge
              className={`text-xs ${
                event.type === '予定'
                  ? 'bg-blue-100 text-blue-700'
                  : event.type === '連絡事項'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-100 text-purple-700'
              }`}
            >
              {event.type}
            </Badge>
            {event.priority === 'high' && (
              <Badge className="bg-red-100 text-red-700 text-xs">高</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <User className="h-3 w-3" />
            <span>{event.assignedTo}</span>
          </div>
        </div>

        {event.relatedResidentName && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <MapPin className="h-3 w-3" />
              <span>対象: {event.relatedResidentName}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
