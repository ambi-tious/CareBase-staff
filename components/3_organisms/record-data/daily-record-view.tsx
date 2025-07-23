'use client';

import { EmptyState } from '@/components/2_molecules/record-data/empty-state';
import { RecordCard } from '@/components/2_molecules/record-data/record-card';
import { Button } from '@/components/ui/button';
import { searchRecordData } from '@/mocks/record-data';
import type { RecordDataItem, RecordType } from '@/types/record-data';
import { Download, Plus } from 'lucide-react';
import { useMemo } from 'react';

interface DailyRecordViewProps {
  records: RecordDataItem[];
  searchQuery: string;
  selectedTypes: RecordType[];
  onAddRecord?: () => void;
  onEditRecord?: (record: RecordDataItem) => void;
  onDeleteRecord?: (recordId: string) => void;
  onExport?: () => void;
}

export const DailyRecordView: React.FC<DailyRecordViewProps> = ({
  records,
  searchQuery,
  selectedTypes,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onExport,
}) => {
  const filteredRecords = useMemo(() => {
    return searchRecordData(records, searchQuery, selectedTypes);
  }, [records, searchQuery, selectedTypes]);

  // Sort records by time
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const timeA = a.time.replace(':', '');
      const timeB = b.time.replace(':', '');
      return timeA.localeCompare(timeB);
    });
  }, [filteredRecords]);

  const hasFiltersApplied = searchQuery.length > 0 || selectedTypes.length < 3;

  if (sortedRecords.length === 0) {
    return (
      <EmptyState
        title={hasFiltersApplied ? '該当する記録が見つかりません' : '記録データがありません'}
        description={
          hasFiltersApplied
            ? '検索条件を変更するか、フィルターをリセットしてください。'
            : 'この日には記録データが登録されていません。'
        }
        showAddButton={true}
        showSearchSuggestion={hasFiltersApplied}
        onAddRecord={onAddRecord}
        onResetFilters={() => {
          // This will be handled by parent component
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {filteredRecords.length}件の記録データ
          {hasFiltersApplied && records.length !== filteredRecords.length && (
            <span className="text-gray-400 ml-1">(全{records.length}件中)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onExport && sortedRecords.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4 mr-2" />
              エクスポート
            </Button>
          )}

          {onAddRecord && (
            <Button
              size="sm"
              onClick={onAddRecord}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              <Plus className="w-4 h-4 mr-2" />
              記録追加
            </Button>
          )}
        </div>
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {sortedRecords.map((record, index) => (
          <div key={record.id} className="relative">
            {/* Timeline connector */}
            {index > 0 && <div className="absolute left-4 -top-4 w-0.5 h-4 bg-gray-200" />}

            {/* Timeline dot */}
            <div className="absolute left-2 top-6 w-3 h-3 bg-carebase-blue rounded-full border-2 border-white shadow-sm z-10" />

            {/* Record card with left margin for timeline */}
            <div className="ml-8">
              <RecordCard record={record} onEdit={onEditRecord} onDelete={onDeleteRecord} />
            </div>
          </div>
        ))}
      </div>

      {/* Load more or pagination can be added here if needed */}
      {sortedRecords.length > 0 && (
        <div className="text-center pt-4">
          <div className="text-sm text-gray-500">記録データの表示が完了しました</div>
        </div>
      )}
    </div>
  );
};
