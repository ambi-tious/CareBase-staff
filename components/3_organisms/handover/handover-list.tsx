'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { HandoverSearchBar } from '@/components/2_molecules/handover/handover-search-bar';
import { HandoverFilters } from '@/components/2_molecules/handover/handover-filters';
import { HandoverTableRow } from '@/components/2_molecules/handover/handover-table-row';
import type { Handover, HandoverPriority, HandoverStatus } from '@/types/handover';
import { MessageSquarePlus, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface HandoverListProps {
  handovers: Handover[];
  onStatusUpdate?: (handoverId: string, status: 'read' | 'completed') => void;
}

export const HandoverList: React.FC<HandoverListProps> = ({ handovers, onStatusUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<HandoverPriority | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<HandoverStatus | undefined>();

  // Filter and search handovers
  const filteredHandovers = useMemo(() => {
    return handovers.filter((handover) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        handover.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        handover.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        handover.createdByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        handover.residentName?.toLowerCase().includes(searchQuery.toLowerCase());

      // Priority filter
      const matchesPriority = !selectedPriority || handover.priority === selectedPriority;

      // Status filter
      const matchesStatus = !selectedStatus || handover.status === selectedStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [handovers, searchQuery, selectedPriority, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPriority(undefined);
    setSelectedStatus(undefined);
  };

  const unreadCount = handovers.filter((h) => h.status === 'unread').length;
  const totalCount = handovers.length;

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="h-6 w-6 text-carebase-blue" />
          <h1 className="text-2xl font-bold text-carebase-text-primary">申し送り一覧</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>総件数: {totalCount}件</span>
          <span>未読: {unreadCount}件</span>
          <span>表示中: {filteredHandovers.length}件</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              メインメニュー
            </Link>
          </Button>
        </div>

        <Button className="bg-carebase-blue hover:bg-carebase-blue-dark" asChild>
          <Link href="/handovers/new">
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            新規申し送り作成
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-6">
        <HandoverSearchBar
          onSearch={setSearchQuery}
          className="flex-1 max-w-md"
        />
        <HandoverFilters
          selectedPriority={selectedPriority}
          selectedStatus={selectedStatus}
          onPriorityChange={setSelectedPriority}
          onStatusChange={setSelectedStatus}
          onReset={handleResetFilters}
        />
      </div>

      {/* Table */}
      {filteredHandovers.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">申し送りが見つかりません</h3>
          <p className="text-gray-500">
            {searchQuery || selectedPriority || selectedStatus
              ? '検索条件に一致する申し送りがありません。条件を変更してお試しください。'
              : '申し送りが登録されていません。新規申し送りを作成してください。'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-32">申し送りID</TableHead>
                <TableHead className="w-32">作成日時</TableHead>
                <TableHead className="w-32">申し送り者</TableHead>
                <TableHead>件名</TableHead>
                <TableHead className="w-20">重要度</TableHead>
                <TableHead className="w-24">ステータス</TableHead>
                <TableHead className="w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHandovers.map((handover) => (
                <HandoverTableRow
                  key={handover.id}
                  handover={handover}
                  onStatusUpdate={onStatusUpdate}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};