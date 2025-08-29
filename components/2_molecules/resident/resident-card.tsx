'use client';

import { ResidentStatusBadge } from '@/components/1_atoms/residents/resident-status-badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Resident } from '@/mocks/care-board-data';
import { isTodayBirthday } from '@/utils/staff-utils';
import { FileText, Gift, MapPin, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

interface ResidentCardProps {
  resident: Resident;
  className?: string;
}

export const ResidentCard: React.FC<ResidentCardProps> = ({ resident, className = '' }) => {
  const isBirthday = isTodayBirthday(resident.dob);

  return (
    <Link href={`/residents/${resident.id}`}>
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-lg bg-gray-200">
                <Image
                  src={resident.avatarUrl || '/placeholder.svg'}
                  alt={resident.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                {/* 誕生日アイコン */}
                {isBirthday && (
                  <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-1 shadow-lg">
                    <Gift className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-500">{resident.furigana}</p>
                  <h3 className="font-semibold text-lg text-carebase-text-primary truncate">
                    <span className="mr-1">{resident.name}</span>
                    <span className="text-xs text-gray-500">({resident.sex})</span>
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {resident.status && resident.status !== 'ー' && (
                    <ResidentStatusBadge status={resident.status} />
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>
                    {resident.dob} ({resident.age}歳)
                  </span>
                </div>
                {resident.roomInfo && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{resident.roomInfo}</span>
                  </div>
                )}
              </div>
              {resident.notes && (
                <div className="flex items-start gap-1 mt-2">
                  <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-500 line-clamp-2">{resident.notes}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
