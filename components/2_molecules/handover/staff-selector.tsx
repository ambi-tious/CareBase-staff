'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { getAllStaff } from '@/mocks/staff-data';
import { Search, Users, X } from 'lucide-react';
import type React from 'react';
import { useCallback, useState } from 'react';

interface StaffSelectorProps {
  selectedStaffIds: string[];
  onSelectionChange: (staffIds: string[]) => void;
  error?: string;
  className?: string;
}

export const StaffSelector: React.FC<StaffSelectorProps> = ({
  selectedStaffIds,
  onSelectionChange,
  error,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const allStaff = getAllStaff();

  // Filter staff based on search query
  const filteredStaff = allStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.furigana.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStaffToggle = useCallback(
    (staffId: string) => {
      const newSelection = selectedStaffIds.includes(staffId)
        ? selectedStaffIds.filter((id) => id !== staffId)
        : [...selectedStaffIds, staffId];

      onSelectionChange(newSelection);
    },
    [selectedStaffIds, onSelectionChange]
  );

  const handleSelectAll = () => {
    const allStaffIds = filteredStaff.map((staff) => staff.id);
    onSelectionChange(allStaffIds);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const getSelectedStaff = () => {
    return allStaff.filter((staff) => selectedStaffIds.includes(staff.id));
  };

  const selectedStaff = getSelectedStaff();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          申し送り先スタッフ <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={filteredStaff.length === 0}
          >
            全選択
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={selectedStaffIds.length === 0}
          >
            クリア
          </Button>
        </div>
      </div>

      {/* Selected Staff Display */}
      {selectedStaff.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              選択中のスタッフ ({selectedStaff.length}名)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedStaff.map((staff) => (
              <Badge
                key={staff.id}
                className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1"
                variant="outline"
              >
                {staff.name}
                <button
                  type="button"
                  onClick={() => handleStaffToggle(staff.id)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="スタッフ名で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Staff List */}
      <Card className="max-h-64 overflow-y-auto">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">スタッフ一覧</CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          {filteredStaff.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              {searchQuery ? '検索結果が見つかりません' : 'スタッフが見つかりません'}
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md"
                >
                  <Checkbox
                    checked={selectedStaffIds.includes(staff.id)}
                    onCheckedChange={() => handleStaffToggle(staff.id)}
                  />
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleStaffToggle(staff.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{staff.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {staff.role.name}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{staff.furigana}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
