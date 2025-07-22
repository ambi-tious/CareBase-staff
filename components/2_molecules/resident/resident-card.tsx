'use client';

import { AlertIndicator } from '@/components/1_atoms/residents/alert-indicator';
import { ResidentStatusBadge } from '@/components/1_atoms/residents/resident-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Resident } from '@/mocks/care-board-data';
import { Calendar, Edit, MapPin, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

interface ResidentCardProps {
  resident: Resident;
  className?: string;
}

// Mock alert data - in production this would come from the API
const getResidentAlerts = (residentId: number) => {
  const alerts = {
    1: { high: 2, medium: 1, low: 0 },
    2: { high: 0, medium: 3, low: 2 },
    3: { high: 1, medium: 0, low: 1 },
    4: { high: 0, medium: 0, low: 0 },
    5: { high: 3, medium: 2, low: 1 },
    6: { high: 1, medium: 1, low: 0 },
    7: { high: 0, medium: 1, low: 2 },
    8: { high: 0, medium: 0, low: 1 },
  };
  return alerts[residentId as keyof typeof alerts] || { high: 0, medium: 0, low: 0 };
};

export const ResidentCard: React.FC<ResidentCardProps> = ({ resident, className = '' }) => {
  const alerts = getResidentAlerts(resident.id);

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={resident.avatarUrl || '/placeholder.svg'}
                alt={resident.name}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-carebase-text-primary truncate">
                  {resident.name}
                </h3>
                <p className="text-sm text-gray-500">{resident.furigana}</p>
              </div>
              <div className="flex items-center gap-2">
                <ResidentStatusBadge status={resident.admissionStatus} />
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/residents/${resident.id}`}>
                    <Edit className="h-3 w-3 mr-1" />
                    詳細
                  </Link>
                </Button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>
                  {resident.age}歳 ({resident.sex})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>要介護度: {resident.careLevel}</span>
              </div>
              {resident.roomInfo && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{resident.roomInfo}</span>
                </div>
              )}
              {resident.unitTeam && (
                <div className="flex items-center gap-1">
                  <span>チーム: {resident.unitTeam}</span>
                </div>
              )}
            </div>

            {/* Alerts */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">アラート:</span>
              <AlertIndicator level="high" count={alerts.high} />
              <AlertIndicator level="medium" count={alerts.medium} />
              <AlertIndicator level="low" count={alerts.low} />
              {alerts.high === 0 && alerts.medium === 0 && alerts.low === 0 && (
                <span className="text-xs text-gray-400">なし</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
