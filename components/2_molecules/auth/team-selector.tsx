'use client';

import type React from 'react';
import type { Team } from '@/mocks/staff-data';
import { Card, CardContent } from '@/components/ui/card';

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
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-carebase-text-primary mb-4">
        チームを選択してください
      </h3>
      <div className="grid gap-3">
        {teams.map((team) => (
          <Card
            key={team.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTeamId === team.id ? 'ring-2 ring-carebase-blue bg-carebase-blue-light' : ''
            }`}
            onClick={() => onTeamSelect(team.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-carebase-blue-light flex items-center justify-center">
                    <team.icon className="w-5 h-5 text-carebase-blue" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-carebase-text-primary">{team.name}</h4>
                  <p className="text-sm text-gray-500">{team.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{team.staff.length} 名のスタッフ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
