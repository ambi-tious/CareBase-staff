'use client';

import { Button } from '@/components/ui/button';
import { FileX, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAddButton?: boolean;
  showSearchSuggestion?: boolean;
  onAddRecord?: () => void;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = '記録データがありません',
  description = '選択した条件に該当する記録データが見つかりませんでした。',
  showAddButton = false,
  showSearchSuggestion = false,
  onAddRecord,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileX className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {showAddButton && onAddRecord && (
          <Button
            onClick={onAddRecord}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            新規記録を追加
          </Button>
        )}
        
        {showSearchSuggestion && onResetFilters && (
          <Button
            variant="outline"
            onClick={onResetFilters}
          >
            <Search className="w-4 h-4 mr-2" />
            フィルターをリセット
          </Button>
        )}
      </div>
      
      {!showAddButton && !showSearchSuggestion && (
        <div className="text-sm text-gray-400 mt-4">
          記録データが登録されると、こちらに表示されます。
        </div>
      )}
    </div>
  );
};