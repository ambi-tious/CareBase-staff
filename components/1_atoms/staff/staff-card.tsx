'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Staff } from '@/mocks/staff-data';
import { User } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';

interface StaffCardProps {
  staff: Staff;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  staff,
  isSelected = false,
  onClick,
  disabled = false,
  className = '',
}) => {
  const getRoleBadgeColor = (color: string) => {
    return isSelected ? `bg-${color}-200 text-${color}-900` : `bg-${color}-100 text-${color}-700`;
  };

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md',
        isSelected
          ? 'ring-2 ring-carebase-blue bg-carebase-blue text-white shadow-lg'
          : !disabled && 'hover:ring-1 hover:ring-carebase-blue-light',
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              {staff.avatar ? (
                <Image
                  src={staff.avatar || '/placeholder.svg'}
                  alt={staff.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className={cn('w-6 h-6 text-gray-500')} />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <Badge className={`text-xs ${getRoleBadgeColor(staff.role.color)}`}>
              {staff.role.name}
            </Badge>
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  'font-semibold truncate transition-colors',
                  isSelected ? 'text-white' : 'text-carebase-text-primary'
                )}
              >
                {staff.name}
              </h3>
            </div>
            <p
              className={cn(
                'text-sm transition-colors truncate',
                isSelected ? 'text-blue-100' : 'text-gray-500'
              )}
            >
              {staff.furigana}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
