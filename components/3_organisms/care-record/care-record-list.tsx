'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CareRecordSearchBar } from '@/components/2_molecules/care-record/care-record-search-bar';
import { CareRecordFilters } from '@/components/2_molecules/care-record/care-record-filters';
import { CareRecordTableRow } from '@/components/2_molecules/care-record/care-record-table-row';
import { CareRecordPagination } from '@/components/2_molecules/care-record/care-record-pagination';
import type { CareRecord, CareRecordCategory, CareRecordPriority, CareRecordStatus } from '@/types/care-record';
import { PlusCircle, ArrowLeft, FileText, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CareRecordListProps {
  records: CareRecord[];
  className?: string;
}

export const CareRecordList: React.FC<CareRecordListProps> = ({ 
  records, 
  className = '' 
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CareRecordCategory | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<CareRecordPriority | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<CareRecordStatus | undefined>();
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  // フィルタリングとソート
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      // 検索クエリフィルター
      const matchesSearch = searchQuery === '' ||
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.createdByName.toLowerCase().includes(searchQuery.toLowerCase());

      // カテゴリフィルター
      const matchesCategory = !selectedCategory || record.category === selectedCategory;

      // 重要度フィルター
      const matchesPriority = !selectedPriority || record.priority === selectedPriority;

      // ステータスフィルター
      const matchesStatus = !selectedStatus || record.status === selectedStatus;

      // 日付範囲フィルター
      const recordDate = new Date(record.recordedAt);
      const matchesDateFrom = !dateFrom || recordDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || recordDate <= new Date(dateTo + 'T23:59:59');

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus && 
             matchesDateFrom && matchesDateTo;
    }).sort((a, b) => {
      // 記録日時の降順でソート
      return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
    });
  }, [records, searchQuery, selectedCategory, selectedPriority, selectedStatus, dateFrom, dateTo]);

  // ページネーション
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setSelectedPriority(undefined);
    setSelectedStatus(undefined);
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  };

  const handleRecordClick = (recordId: string) => {
    router.push(`/care-records/${recordId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ヘッダー */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              メインメニュー
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">介護記録一覧</h1>
          </div>
        </div>

        <Button className="bg-carebase-blue hover:bg-carebase-blue-dark" asChild>
          <Link href="/care-records/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            新規記録作成
          </Link>
        </Button>
      </div>

      {/* 統計情報 */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>総件数: {records.length}件</span>
        <span>表示中: {filteredRecords.length}件</span>
        <span>ページ: {currentPage}/{totalPages}</span>
      </div>

      {/* 検索とフィルター */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <CareRecordSearchBar 
              onSearch={setSearchQuery} 
              className="flex-1 max-w-md" 
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              フィルター
              {(selectedCategory || selectedPriority || selectedStatus || dateFrom || dateTo) && (
                <span className="bg-carebase-blue text-white text-xs px-1.5 py-0.5 rounded-full">
                  ON
                </span>
              )}
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="pt-0">
            <CareRecordFilters
              selectedCategory={selectedCategory}
              selectedPriority={selectedPriority}
              selectedStatus={selectedStatus}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onCategoryChange={setSelectedCategory}
              onPriorityChange={setSelectedPriority}
              onStatusChange={setSelectedStatus}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onReset={handleResetFilters}
            />
          </CardContent>
        )}
      </Card>

      {/* テーブル */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">介護記録が見つかりません</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory || selectedPriority || selectedStatus || dateFrom || dateTo
                ? '検索条件に一致する記録がありません。条件を変更してお試しください。'
                : '介護記録が登録されていません。新規記録を作成してください。'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-32">記録ID</TableHead>
                    <TableHead className="w-32">利用者名</TableHead>
                    <TableHead className="w-32">記録日時</TableHead>
                    <TableHead className="w-24">記録種別</TableHead>
                    <TableHead className="min-w-[200px]">タイトル・概要</TableHead>
                    <TableHead className="w-32">担当職員</TableHead>
                    <TableHead className="w-20">重要度</TableHead>
                    <TableHead className="w-24">ステータス</TableHead>
                    <TableHead className="w-20">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record) => (
                    <CareRecordTableRow
                      key={record.id}
                      record={record}
                      onRecordClick={handleRecordClick}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ページネーション */}
      {filteredRecords.length > 0 && (
        <CareRecordPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredRecords.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};