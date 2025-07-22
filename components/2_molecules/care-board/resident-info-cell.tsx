import { Badge } from '@/components/ui/badge';
import type { Resident } from '@/mocks/residents-data';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ResidentInfoCellProps {
  resident: Resident;
  className?: string;
}

export const ResidentInfoCell: React.FC<ResidentInfoCellProps> = ({ resident, className = '' }) => {
  const careLevelColor = (() => {
    switch (resident.careLevel) {
      case '要支援1':
      case '要支援2':
        return 'bg-green-100 text-green-800 border-green-200';
      case '要介護1':
      case '要介護2':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '要介護3':
      case '要介護4':
      case '要介護5':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  })();

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
      <Badge variant="outline" className={`text-xs px-2 py-0.5 font-medium ${careLevelColor}`}>
        {resident.careLevel}
      </Badge>
    </div>
  );
};
