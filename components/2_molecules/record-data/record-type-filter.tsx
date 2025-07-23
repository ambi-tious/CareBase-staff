'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { recordTypeOptions, type RecordType } from '@/types/record-data';
import { ChevronDown, Filter } from 'lucide-react';

interface RecordTypeFilterProps {
  selectedTypes: RecordType[];
  onTypesChange: (types: RecordType[]) => void;
}

export const RecordTypeFilter: React.FC<RecordTypeFilterProps> = ({
  selectedTypes,
  onTypesChange,
}) => {
  const handleTypeToggle = (type: RecordType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypesChange(newTypes);
  };

  const handleSelectAll = () => {
    if (selectedTypes.length === recordTypeOptions.length) {
      onTypesChange([]);
    } else {
      onTypesChange(recordTypeOptions.map(option => option.value));
    }
  };

  const getDisplayText = () => {
    if (selectedTypes.length === 0) {
      return '記録種別を選択';
    } else if (selectedTypes.length === recordTypeOptions.length) {
      return 'すべての記録種別';
    } else {
      const labels = selectedTypes.map(type => 
        recordTypeOptions.find(option => option.value === type)?.label
      ).filter(Boolean);
      return labels.join(', ');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="min-w-[180px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="truncate">{getDisplayText()}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">記録種別</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
            >
              {selectedTypes.length === recordTypeOptions.length ? '全解除' : '全選択'}
            </Button>
          </div>
          
          <div className="space-y-2">
            {recordTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={selectedTypes.includes(option.value)}
                  onCheckedChange={() => handleTypeToggle(option.value)}
                />
                <label
                  htmlFor={option.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                >
                  <span className={`px-2 py-1 rounded-md text-xs ${option.color}`}>
                    {option.label}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};