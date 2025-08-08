'use client';

import { ResidentStatusBadge } from '@/components/1_atoms/residents/resident-status-badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Resident } from '@/mocks/care-board-data';
import { MapPin, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';

interface ResidentCardProps {
  resident: Resident;
  className?: string;
}

export const ResidentCard: React.FC<ResidentCardProps> = ({ resident, className = '' }) => {
  return (
    <Link href={`/residents/${resident.id}`}>
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
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
                  <ResidentStatusBadge status={resident.admissionStatus} />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-1 text-sm text-gray-600">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
