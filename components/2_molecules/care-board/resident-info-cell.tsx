import type { Resident } from '@/mocks/residents-data';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ResidentInfoCellProps {
  resident: Resident;
  className?: string;
}

export const ResidentInfoCell: React.FC<ResidentInfoCellProps> = ({ resident, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link
        href={`/residents/${resident.id}`}
        className="flex items-center gap-2 hover:bg-gray-50 rounded-md p-1 transition-colors"
      >
        <div className="relative">
          <Image
            src={resident.avatarUrl}
            alt={`${resident.name}様`}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-sm font-medium text-gray-900 hover:text-carebase-blue transition-colors">
          {resident.name}
        </span>
      </Link>
    </div>
  );
};
