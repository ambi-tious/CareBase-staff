'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Resident } from '@/mocks/care-board-data';
import { careBoardData } from '@/mocks/care-board-data';
import { Search, User, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface ResidentSelectorProps {
  selectedResidentId?: string;
  onSelectionChange: (residentId?: string) => void;
  className?: string;
}

export const ResidentSelector: React.FC<ResidentSelectorProps> = ({
  selectedResidentId,
  onSelectionChange,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter active residents only
  const activeResidents = careBoardData.filter((resident) => resident.dischargeDate === undefined);

  // Filter residents based on search query
  const filteredResidents = activeResidents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.furigana.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.roomInfo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedResident = selectedResidentId
    ? activeResidents.find((r) => r.id.toString() === selectedResidentId)
    : undefined;

  const handleResidentSelect = (resident: Resident) => {
    onSelectionChange(resident.id.toString());
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelectionChange(undefined);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">対象利用者（任意）</label>

      {/* Selected Resident Display */}
      {selectedResident ? (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <div>
                <span className="text-sm font-medium text-green-800">{selectedResident.name}</span>
                <div className="text-xs text-green-600">
                  {selectedResident.roomInfo} | {selectedResident.careLevel}
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-green-600 hover:text-green-800 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full justify-start text-gray-500"
        >
          <User className="h-4 w-4 mr-2" />
          利用者を選択してください
        </Button>
      )}

      {/* Resident Selection Modal */}
      {isOpen && (
        <Card className="absolute z-50 w-full max-w-md bg-white shadow-lg border">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">利用者選択</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="py-0">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="利用者名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Resident List */}
            <div className="max-h-48 overflow-y-auto pb-4">
              {filteredResidents.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {searchQuery ? '検索結果が見つかりません' : '利用者が見つかりません'}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredResidents.map((resident) => (
                    <div
                      key={resident.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handleResidentSelect(resident)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{resident.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {resident.careLevel}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {resident.roomInfo} | {resident.furigana}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
