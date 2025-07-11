'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { cn } from '@/lib/utils';
import type { Team } from '@/mocks/staff-data';
import type React from 'react';

interface TeamSelectorProps {
  teams: Team[];
  selectedTeamId?: string;
  onTeamSelect: (teamId: string) => void;
  className?: string;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
  teams,
  selectedTeamId,
  onTeamSelect,
  className = '',
}) => {
  const handleTeamClick = (teamId: string) => {
    if (selectedTeamId === teamId) {
      // Allow deselection by clicking the same team
      onTeamSelect('');
    } else {
      onTeamSelect(teamId);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-carebase-text-primary mb-3">
        チームを選択してください
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {teams.map((team) => {
          const Icon = getLucideIcon(team.icon);
          const isSelected = selectedTeamId === team.id;
          return (
            <Card
              key={team.id}
              className={cn(
                'cursor-pointer hover:shadow-md',
                isSelected
                  ? 'ring-2 ring-carebase-blue bg-carebase-blue text-white shadow-lg'
                  : 'hover:ring-1 hover:ring-carebase-blue-light'
              )}
              onClick={() => handleTeamClick(team.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors',
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
                      {team.name}
                    </h4>
                    <p
                      className={cn(
                        'text-sm transition-colors',
                        isSelected ? 'text-blue-100' : 'text-gray-500'
                      )}
                    >
                      {team.description}
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-1 transition-colors',
                        isSelected ? 'text-blue-200' : 'text-gray-400'
                      )}
                    >
                      {team.staff.length} 名のスタッフ
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
