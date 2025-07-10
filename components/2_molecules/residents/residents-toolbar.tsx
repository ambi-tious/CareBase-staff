'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { ResidentSearchBar } from './resident-search-bar';
import { UserPlus, Filter, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ResidentsToolbarProps {
  onSearch: (query: string) => void;
  showDischargedResidents: boolean;
  onToggleDischargedResidents: (show: boolean) => void;
  onCreateResident: () => void;
  className?: string;
}

export const ResidentsToolbar: React.FC<ResidentsToolbarProps> = ({
  onSearch,
  showDischargedResidents,
  onToggleDischargedResidents,
  onCreateResident,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top row - Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <ResidentSearchBar onSearch={onSearch} className="flex-1 max-w-md" />
        <Button onClick={onCreateResident} className="bg-carebase-blue hover:bg-carebase-blue-dark">
          <UserPlus className="h-4 w-4 mr-2" />
          新規利用者登録
        </Button>
      </div>

      {/* Bottom row - Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-discharged"
              checked={showDischargedResidents}
              onCheckedChange={onToggleDischargedResidents}
            />
            <Label htmlFor="show-discharged" className="text-sm">
              退所済み利用者も表示
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            フィルター
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>
    </div>
  );
};