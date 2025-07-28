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
import { Clock, Eye, FileText, MessageCircle, Trash2 } from 'lucide-react';
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
  const [selectedCareRecords, setSelectedCareRecords] = useState<string[]>([]);
  const [selectedNursingRecords, setSelectedNursingRecords] = useState<string[]>([]);
  const [selectedHandovers, setSelectedHandovers] = useState<string[]>([]);

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

  const handleCareRecordSelection = (recordId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCareRecords((prev) => [...prev, recordId]);
    } else {
      setSelectedCareRecords((prev) => prev.filter((id) => id !== recordId));
    }
  };

  const handleNursingRecordSelection = (recordId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedNursingRecords((prev) => [...prev, recordId]);
    } else {
      setSelectedNursingRecords((prev) => prev.filter((id) => id !== recordId));
    }
  };

  const handleSelectAllCareRecords = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedCareRecords(dailyCareRecords.map((record) => record.id));
    } else {
      setSelectedCareRecords([]);
    }
  };

  const handleSelectAllNursingRecords = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedNursingRecords(dailyCareRecords.map((record) => record.id));
    } else {
      setSelectedNursingRecords([]);
    }
  };

  const handleHandoverSelection = (handoverId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedHandovers((prev) => [...prev, handoverId]);
    } else {
      setSelectedHandovers((prev) => prev.filter((id) => id !== handoverId));
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
        <Button
          variant="outline"
          size="sm"
          className="ml-auto border-red-300 text-red-600 hover:bg-red-50"
          disabled={selectedCareRecords.length === 0 && selectedHandovers.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          選択削除
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-carebase-blue" />
              ケア記録
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {dailyCareRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">この日のケア記録はありません。</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          dailyCareRecords.length > 0 &&
                          selectedCareRecords.length === dailyCareRecords.length
                        }
                        indeterminate={
                          selectedCareRecords.length > 0 &&
                          selectedCareRecords.length < dailyCareRecords.length
                        }
                        onCheckedChange={handleSelectAllCareRecords}
                      />
                    </TableHead>
                    <TableHead className="w-[5.5rem]">時間</TableHead>
                    <TableHead className="w-[7rem]">記録者</TableHead>
                    <TableHead className="w-[9.5rem]">分類</TableHead>
                    <TableHead className="max-w-xs">内容</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyCareRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell className="w-[50px]">
                        <Checkbox
                          checked={selectedCareRecords.includes(record.id)}
                          onCheckedChange={(checked) =>
                            handleCareRecordSelection(record.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm w-[5.5rem]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(record.recordedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm w-[7rem]">{record.createdByName}</TableCell>
                      <TableCell className="w-[9.5rem]">
                        <CategoryBadge
                          category={record.category}
                          className="w-[9.5rem] justify-start"
                        />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium text-sm line-clamp-1">{record.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{record.summary}</div>
                      </TableCell>
                      <TableCell className="w-[80px]">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/care-records/${record.id}`}>
                            <Eye className="h-3 w-3" />
                            詳細
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
              <FileText className="h-5 w-5 text-carebase-blue" />
              介護記録
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {dailyCareRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">この日の介護記録はありません。</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          dailyCareRecords.length > 0 &&
                          selectedNursingRecords.length === dailyCareRecords.length
                        }
                        indeterminate={
                          selectedNursingRecords.length > 0 &&
                          selectedNursingRecords.length < dailyCareRecords.length
                        }
                        onCheckedChange={handleSelectAllNursingRecords}
                      />
                    </TableHead>
                    <TableHead className="w-[5.5rem]">時間</TableHead>
                    <TableHead className="w-[7rem]">記録者</TableHead>
                    <TableHead className="w-[9.5rem]">分類</TableHead>
                    <TableHead className="max-w-xs">内容</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyCareRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell className="w-[50px]">
                        <Checkbox
                          checked={selectedNursingRecords.includes(record.id)}
                          onCheckedChange={(checked) =>
                            handleNursingRecordSelection(record.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm w-[5.5rem]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(record.recordedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm w-[7rem]">{record.createdByName}</TableCell>
                      <TableCell className="w-[9.5rem]">
                        <CategoryBadge
                          category={record.category}
                          className="w-[9.5rem] justify-start"
                        />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium text-sm line-clamp-1">{record.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{record.summary}</div>
                      </TableCell>
                      <TableCell className="w-[80px]">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/care-records/${record.id}`}>
                            <Eye className="h-3 w-3" />
                            詳細
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
              <MessageCircle className="h-5 w-5 text-carebase-blue" />
              申し送り
            </CardTitle>
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
                  <TableRow className="bg-gray-50">
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
                    <TableHead className="w-[5.5rem]">時間</TableHead>
                    <TableHead className="w-[7rem]">記録者</TableHead>
                    <TableHead className="w-[9.5rem]">分類</TableHead>
                    <TableHead className="max-w-xs">内容</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyHandovers.map((handover) => (
                    <TableRow key={handover.id} className="hover:bg-gray-50">
                      <TableCell className="w-[50px]">
                        <Checkbox
                          checked={selectedHandovers.includes(handover.id)}
                          onCheckedChange={(checked) =>
                            handleHandoverSelection(handover.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm w-[5.5rem]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {handover.scheduledTime || formatDateTime(handover.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm w-[7rem]">{handover.createdByName}</TableCell>
                      <TableCell className="w-[9.5rem]">
                        <HandoverCategoryBadge
                          category={handover.category}
                          className="w-[9.5rem] justify-start"
                        />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium text-sm line-clamp-1">{handover.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{handover.content}</div>
                        <div className="flex items-center gap-2">
                          <HandoverPriorityBadge priority={handover.priority} />
                          <HandoverStatusBadge status={handover.status} />
                        </div>
                      </TableCell>
                      <TableCell className="w-[80px]">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/handovers/${handover.id}`}>
                            <Eye className="h-3 w-3" />
                            詳細
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
