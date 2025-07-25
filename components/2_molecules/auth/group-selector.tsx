'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { cn } from '@/lib/utils';
import type { Group } from '@/mocks/staff-data';
import type React from 'react';

interface GroupSelectorProps {
  groups: Group[];
  selectedGroupId?: string;
  onGroupSelect: (groupId: string) => void;
  disabled?: boolean;
  className?: string;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  selectedGroupId,
  onGroupSelect,
  disabled = false,
  className = '',
}) => {
  const handleGroupClick = (groupId: string) => {
    if (!disabled) {
      onGroupSelect(groupId);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-carebase-text-primary mb-3">
        グループ［フロア］を選択
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {groups.map((group) => {
          const Icon = getLucideIcon(group.icon);
          const isSelected = selectedGroupId === group.id;
          return (
            <Card
              key={group.id}
              className={cn(
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md',
                isSelected
                  ? 'ring-2 ring-carebase-blue bg-carebase-blue text-white shadow-lg'
                  : !disabled && 'hover:ring-1 hover:ring-carebase-blue-light'
              )}
              onClick={() => handleGroupClick(group.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Icon
                      className={cn(
                        'w-6 h-6 transition-colors',
                        isSelected ? 'text-white' : 'text-carebase-blue'
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={cn(
                        'font-semibold transition-colors',
                        isSelected ? 'text-white' : 'text-carebase-text-primary'
                      )}
                    >
                      {group.name}
                    </h4>
                    <p
                      className={cn(
                        'text-sm transition-colors',
                        isSelected ? 'text-blue-100' : 'text-gray-500'
                      )}
                    >
                      {group.description}
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-1 transition-colors',
                        isSelected ? 'text-blue-200' : 'text-gray-400'
                      )}
                    >
                      {group.teams.length} チーム
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
