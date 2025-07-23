'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = '記録内容、担当者名で検索...',
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchChange(localQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {localQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">検索をクリア</span>
          </Button>
        )}
      </div>
      <Button type="submit" size="sm" className="bg-carebase-blue hover:bg-carebase-blue-dark">
        検索
      </Button>
    </form>
  );
};
