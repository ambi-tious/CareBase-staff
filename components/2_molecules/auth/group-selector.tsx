'use client';

import type React from 'react';
import type { Group } from '@/mocks/staff-data';
import { Card, CardContent } from '@/components/ui/card';
import { getLucideIcon } from '@/lib/lucide-icon-registry';

interface GroupSelectorProps {
  groups: Group[];
  selectedGroupId?: string;
  onGroupSelect: (groupId: string) => void;
  className?: string;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  selectedGroupId,
  onGroupSelect,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-carebase-text-primary mb-4">
        グループを選択してください
      </h3>
      <div className="grid gap-3">
        {groups.map((group) => {
          const Icon = getLucideIcon(group.icon);
          return (
            <Card
              key={group.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedGroupId === group.id
                  ? 'ring-2 ring-carebase-blue bg-carebase-blue-light'
                  : ''
              }`}
              onClick={() => onGroupSelect(group.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6 text-carebase-blue" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-carebase-text-primary">{group.name}</h4>
                    <p className="text-sm text-gray-500">{group.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{group.teams.length} チーム</p>
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
