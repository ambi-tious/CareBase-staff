import type React from 'react';
import { useState } from 'react';
import type { IndividualPoint, IndividualPointDetail } from '@/mocks/care-board-data';
import { Badge } from '@/components/ui/badge';
import { getLucideIcon } from '@/lib/lucide-icon-registry';

interface IndividualPointCardProps {
  point: IndividualPoint;
  onSelect?: (point: IndividualPoint) => void;
  isSelected?: boolean;
}

export const IndividualPointCard: React.FC<IndividualPointCardProps> = ({ 
  point, 
  onSelect,
  isSelected = false
}) => {
  const Icon = getLucideIcon(point.icon);
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(point);
    }
  };

  return (
    <div
      className={`relative p-4 rounded-lg text-center cursor-pointer transition-all ${
        isSelected 
          ? 'ring-2 ring-carebase-blue shadow-md scale-105' 
          : point.isActive 
            ? 'bg-carebase-blue text-white hover:shadow-md' 
            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
      }`}
      onClick={handleClick}
    >
      {point.count > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {point.count}
        </Badge>
      )}
      <Icon className="h-8 w-8 mx-auto mb-2" />
      <p className="text-sm font-medium">{point.category}</p>
    </div>
  );
};
