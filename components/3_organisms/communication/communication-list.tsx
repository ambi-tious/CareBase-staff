'use client';

import { CommunicationRecordCard } from '@/components/2_molecules/communication/communication-record-card';
import { CommunicationThreadView } from '@/components/2_molecules/communication/communication-thread-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CommunicationRecord, CommunicationThread } from '@/types/communication';
import { MessageCircle, MessageSquare, Plus, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

interface CommunicationListProps {
  records: CommunicationRecord[];
  threads: CommunicationThread[];
  residentId: number;
  residentName: string;
  onRecordUpdate?: (updatedRecord: CommunicationRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordCreate?: (newRecord: CommunicationRecord) => void;
  onEdit?: (record: CommunicationRecord) => void;
  onReply?: (record: CommunicationRecord) => void;
  onCreateHandover?: (record: CommunicationRecord) => void;
  onAddToThread?: (threadId: string) => void;
  className?: string;
}

export interface CommunicationListRef {
  openCreateModal: () => void;
}

export const CommunicationList = forwardRef<CommunicationListRef, CommunicationListProps>(
  (
    {
      records,
      threads,
      residentId,
      residentName,
      onRecordUpdate,
      onRecordDelete,
      onRecordCreate,
      onEdit,
      onReply,
      onCreateHandover,
      onAddToThread,
      className = '',
    },
    ref
  ) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showImportantOnly, setShowImportantOnly] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    // Expose methods to parent component via ref
    useImperativeHandle(
      ref,
      () => ({
        openCreateModal: () => {
          router.push(`/residents/${residentId}/communications/new`);
        },
      }),
      [router, residentId]
    );

    // Filter records and threads
    const filteredRecords = useMemo(() => {
      return records.filter((record) => {
        // Search filter
        const matchesSearch =
          searchQuery === '' ||
          record.communicationContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.responseContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.contactPersonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.staffName.toLowerCase().includes(searchQuery.toLowerCase());

        // Importance filter
        const matchesImportance = !showImportantOnly || record.isImportant;

        return matchesSearch && matchesImportance;
      });
    }, [records, searchQuery, showImportantOnly]);

    const filteredThreads = useMemo(() => {
      return threads.filter((thread) => {
        // Search filter
        const matchesSearch =
          searchQuery === '' ||
          thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.records.some(
            (record) =>
              record.communicationContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
              record.responseContent.toLowerCase().includes(searchQuery.toLowerCase())
          );

        // Importance filter
        const matchesImportance = !showImportantOnly || thread.isImportant;

        return matchesSearch && matchesImportance;
      });
    }, [threads, searchQuery, showImportantOnly]);

    // Get standalone records (not part of any thread)
    const standaloneRecords = useMemo(() => {
      return filteredRecords.filter((record) => !record.threadId);
    }, [filteredRecords]);

    const handleCreateRecord = () => {
      router.push(`/residents/${residentId}/communications/new`);
    };

    const clearSearch = () => {
      setSearchQuery('');
    };

    const totalRecords = records.length;
    const importantRecords = records.filter((r) => r.isImportant).length;

    return (
      <div className={`space-y-6 ${className}`}>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="コミュニケーション記録を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 w-80"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="important-only"
                checked={showImportantOnly}
                onCheckedChange={setShowImportantOnly}
              />
              <Label htmlFor="important-only" className="text-sm">
                重要な記録のみ表示
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>総件数: {totalRecords}件</span>
            <span className="text-red-600 font-medium">重要: {importantRecords}件</span>
            <span>表示中: {activeTab === 'threads' ? filteredThreads.length : filteredRecords.length}件</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              すべての記録
            </TabsTrigger>
            <TabsTrigger value="threads" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              スレッド表示
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredRecords.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery || showImportantOnly
                      ? '検索条件に一致するコミュニケーション記録がありません'
                      : 'コミュニケーション記録がありません'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || showImportantOnly
                      ? '検索条件を変更するか、新しいコミュニケーション記録を登録してください。'
                      : 'ご家族や関係者とのコミュニケーション記録を管理できます。'}
                  </p>
                  <Button
                    onClick={handleCreateRecord}
                    className="bg-carebase-blue hover:bg-carebase-blue-dark"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    最初のコミュニケーション記録を登録
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <CommunicationRecordCard
                    key={record.id}
                    record={record}
                    residentId={residentId}
                    residentName={residentName}
                    onRecordUpdate={onRecordUpdate}
                    onRecordDelete={onRecordDelete}
                    onEdit={onEdit}
                    onReply={onReply}
                    onCreateHandover={onCreateHandover}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="threads" className="space-y-4">
            {filteredThreads.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery || showImportantOnly
                      ? '検索条件に一致するスレッドがありません'
                      : 'コミュニケーションスレッドがありません'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    関連するコミュニケーション記録がスレッドとして表示されます。
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredThreads.map((thread) => (
                  <CommunicationThreadView
                    key={thread.id}
                    thread={thread}
                    residentId={residentId}
                    residentName={residentName}
                    onRecordUpdate={onRecordUpdate}
                    onRecordDelete={onRecordDelete}
                    onEdit={onEdit}
                    onReply={onReply}
                    onCreateHandover={onCreateHandover}
                    onAddToThread={onAddToThread}
                  />
                ))}
              </div>
            )}

            {/* Standalone records */}
            {standaloneRecords.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                  個別の記録
                </h3>
                {standaloneRecords.map((record) => (
                  <CommunicationRecordCard
                    key={record.id}
                    record={record}
                    residentId={residentId}
                    residentName={residentName}
                    onRecordUpdate={onRecordUpdate}
                    onRecordDelete={onRecordDelete}
                    onEdit={onEdit}
                    onReply={onReply}
                    onCreateHandover={onCreateHandover}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);

CommunicationList.displayName = 'CommunicationList';