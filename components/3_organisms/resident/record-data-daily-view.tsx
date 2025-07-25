'use client';

import { CategoryBadge } from '@/components/1_atoms/care-record/category-badge';
import { CategoryBadge as HandoverCategoryBadge } from '@/components/1_atoms/handover/category-badge';
import { PriorityBadge as HandoverPriorityBadge } from '@/components/1_atoms/handover/priority-badge';
import { StatusBadge as HandoverStatusBadge } from '@/components/1_atoms/handover/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Resident } from '@/mocks/care-board-data';
import type { CareRecord } from '@/types/care-record';
import type { Handover } from '@/types/handover';
import { format, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Clock, Eye, MessageCircle, Plus, Trash2, Utensils } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useMemo, useState } from 'react';

interface RecordDataDailyViewProps {
  resident: Resident;
  selectedDate: Date | null;
  careRecords: CareRecord[];
  handovers: Handover[];
}

export const RecordDataDailyView: React.FC<RecordDataDailyViewProps> = ({
  resident,
  selectedDate,
  careRecords,
  handovers,
}) => {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [selectedHandovers, setSelectedHandovers] = useState<string[]>([]);
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const dailyCareRecords = useMemo(() => {
    if (!selectedDate) return [];
    return careRecords.filter((record) => isSameDay(new Date(record.recordedAt), selectedDate));
  }, [careRecords, selectedDate]);

  const dailyHandovers = useMemo(() => {
    if (!selectedDate) return [];
    return handovers.filter((handover) => {
      if (handover.scheduledDate) {
        return isSameDay(new Date(handover.scheduledDate), selectedDate);
      }
      return isSameDay(new Date(handover.createdAt), selectedDate);
    });
  }, [handovers, selectedDate]);

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: ja });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: ja });
  };

  const handleRecordSelection = (recordId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedRecords((prev) => [...prev, recordId]);
    } else {
      setSelectedRecords((prev) => prev.filter((id) => id !== recordId));
    }
  };

  const handleHandoverSelection = (handoverId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedHandovers((prev) => [...prev, handoverId]);
    } else {
      setSelectedHandovers((prev) => prev.filter((id) => id !== handoverId));
    }
  };

  const handleSelectAllRecords = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedRecords(dailyCareRecords.map((record) => record.id));
    } else {
      setSelectedRecords([]);
    }
  };

  const handleSelectAllHandovers = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedHandovers(dailyHandovers.map((handover) => handover.id));
    } else {
      setSelectedHandovers([]);
    }
  };

  if (!selectedDate) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="time-filter" checked={showTimeFilter} onCheckedChange={setShowTimeFilter} />
          <label htmlFor="time-filter" className="text-sm font-medium">
            時系列
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="category-filter"
            checked={showCategoryFilter}
            onCheckedChange={setShowCategoryFilter}
          />
          <label htmlFor="category-filter" className="text-sm font-medium">
            項目別
          </label>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto border-red-300 text-red-600 hover:bg-red-50"
          disabled={selectedRecords.length === 0 && selectedHandovers.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          選択削除
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-orange-600" />
              ケア記録
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
              asChild
            >
              <Link href="/care-records/new">
                <Plus className="h-4 w-4 mr-2" />
                新規作成
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dailyCareRecords.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">この日のケア記録はありません。</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          dailyCareRecords.length > 0 &&
                          selectedRecords.length === dailyCareRecords.length
                        }
                        indeterminate={
                          selectedRecords.length > 0 &&
                          selectedRecords.length < dailyCareRecords.length
                        }
                        onCheckedChange={handleSelectAllRecords}
                      />
                    </TableHead>
                    <TableHead>時間</TableHead>
                    <TableHead>記録者</TableHead>
                    <TableHead>利用者</TableHead>
                    <TableHead>分類</TableHead>
                    <TableHead>内容</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyCareRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={(checked) => handleRecordSelection(record.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-orange-600" />
                          {formatTime(record.recordedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.createdByName}</TableCell>
                      <TableCell className="text-sm font-medium">{record.residentName}</TableCell>
                      <TableCell>
                        <CategoryBadge category={record.category} />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="space-y-1">
                          <div className="font-medium text-sm line-clamp-1">{record.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-2">{record.summary}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/care-records/${record.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              申し送り
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
              asChild
            >
              <Link href="/handovers/new">
                <Plus className="h-4 w-4 mr-2" />
                新規作成
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dailyHandovers.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">この日の申し送りはありません。</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          dailyHandovers.length > 0 &&
                          selectedHandovers.length === dailyHandovers.length
                        }
                        indeterminate={
                          selectedHandovers.length > 0 &&
                          selectedHandovers.length < dailyHandovers.length
                        }
                        onCheckedChange={handleSelectAllHandovers}
                      />
                    </TableHead>
                    <TableHead>時間</TableHead>
                    <TableHead>記録者</TableHead>
                    <TableHead>利用者</TableHead>
                    <TableHead>分類</TableHead>
                    <TableHead>内容</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyHandovers.map((handover) => (
                    <TableRow
                      key={handover.id}
                      className={`hover:bg-gray-50 ${
                        handover.status === 'unread' ? 'bg-blue-50' : ''
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedHandovers.includes(handover.id)}
                          onCheckedChange={(checked) =>
                            handleHandoverSelection(handover.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-600" />
                          {handover.scheduledTime || formatDateTime(handover.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{handover.createdByName}</TableCell>
                      <TableCell className="text-sm font-medium">
                        {handover.residentName || resident.name}
                      </TableCell>
                      <TableCell>
                        <HandoverCategoryBadge category={handover.category} />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="space-y-1">
                          <div className="font-medium text-sm line-clamp-1">{handover.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-2">
                            {handover.content.substring(0, 100)}
                            {handover.content.length > 100 ? '...' : ''}
                          </div>
                          <div className="flex items-center gap-2">
                            <HandoverPriorityBadge priority={handover.priority} />
                            <HandoverStatusBadge status={handover.status} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/handovers/${handover.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
