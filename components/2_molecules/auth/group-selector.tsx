'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { cn } from '@/lib/utils';
import type { Group } from '@/mocks/staff-data';
import type React from 'react';

interface GroupSelectorProps {
  groups: Group[];
  selectedGroupId?: string;
  currentGroupId?: string; // 現在所属しているグループID
  onGroupSelect: (groupId: string) => void;
  disabled?: boolean;
  className?: string;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  selectedGroupId,
  currentGroupId,
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
        ① グループ［フロア］を選択
      </h3>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-2">
        {groups.map((group) => {
          const Icon = getLucideIcon(group.icon);
          const isSelected = selectedGroupId === group.id;
          const isCurrent = currentGroupId === group.id;
          return (
            <Card
              key={group.id}
              className={cn(
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md',
                isSelected
                  ? 'ring-2 ring-carebase-blue bg-carebase-blue text-white shadow-lg'
                  : isCurrent
                    ? 'ring-2 ring-green-500 bg-green-50 border-green-200'
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
                        isSelected
                          ? 'text-white'
                          : isCurrent
                            ? 'text-green-600'
                            : 'text-carebase-blue'
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={cn(
                        'font-semibold transition-colors',
                        isSelected
                          ? 'text-white'
                          : isCurrent
                            ? 'text-green-800'
                            : 'text-carebase-text-primary'
                      )}
                    >
                      {group.name}
                    </h4>
                    <p
                      className={cn(
                        'text-sm transition-colors',
                        isSelected
                          ? 'text-blue-100'
                          : isCurrent
                            ? 'text-green-600'
                            : 'text-gray-500'
                      )}
                    >
                      {group.description}
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-1 transition-colors',
                        isSelected
                          ? 'text-blue-200'
                          : isCurrent
                            ? 'text-green-500'
                            : 'text-gray-400'
                      )}
                    >
                      {group.teams.length} チーム
                    </p>
                    {isCurrent && (
                      <div className="mt-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-300">
                          現在の所属
                        </span>
                      </div>
                    )}
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
