'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { careBoardData, careCategoryGroups, CareEvent } from '@/mocks/care-board-data';
import { addDays, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardEdit,
  Clock as ClockIcon,
  Filter,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BulkCareRecordModal } from './bulk-care-record-modal';
import { TimeBaseView } from './care-board-time-base';
import { UserBaseView } from './care-board-user-base';
import { ResponsiveCareboardWeekView } from './care-board-responsive-week';
import { rgbToString } from './care-board-utils';

type ActiveTabView = 'time' | 'user' | 'week';

export function CareBoard() {
  const [activeView, setActiveView] = useState<ActiveTabView>('time');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showBulkRecordModal, setShowBulkRecordModal] = useState<boolean>(false);

  // Set current date on client side to avoid hydration mismatch
  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  // 一括記録の保存処理
  const handleSaveBulkRecords = (records: { residentId: number; event: CareEvent }[]) => {
    // 実際の実装では、APIを呼び出してデータを保存します
    // TODO: API呼び出しの実装

    // モックデータの更新（実際の実装ではAPIを使用）
    records.forEach(({ residentId, event }) => {
      const residentIndex = careBoardData.findIndex((r) => r.id === residentId);
      if (residentIndex !== -1) {
        careBoardData[residentIndex].events.push(event);
      }
    });

    // 成功メッセージ（実際の実装ではトースト通知などを使用）
    toast.success(`${records.length}件の記録を保存しました`);
  };

  return (
    <div data-testid="care-board" className="p-4 bg-carebase-bg max-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 rounded-lg bg-gray-200 p-1 shadow-sm">
            <Button
              onClick={() => setActiveView('time')}
              className={`px-4 py-2.5 font-medium text-base ${
                activeView === 'time'
                  ? 'bg-carebase-blue hover:bg-carebase-blue-dark text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ClockIcon className="h-4 w-4 mr-2" />
              時間ベース
            </Button>
            <Button
              onClick={() => setActiveView('user')}
              className={`px-4 py-2.5 font-medium text-base ${
                activeView === 'user'
                  ? 'bg-carebase-blue hover:bg-carebase-blue-dark text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              ご利用者ベース
            </Button>
            <Button
              onClick={() => setActiveView('week')}
              className={`px-4 py-2.5 font-medium text-base ${
                activeView === 'week'
                  ? 'bg-carebase-blue hover:bg-carebase-blue-dark text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-300'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              週間表示
            </Button>
          </div>
          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
            onClick={() => setShowBulkRecordModal(true)}
          >
            <ClipboardEdit className="h-4 w-4 mr-2 text-carebase-blue" />
            まとめて記録
          </Button>
          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2 text-carebase-blue" />
            フィルター
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
            onClick={() => selectedDate && setSelectedDate(addDays(selectedDate, -1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            前日
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className="w-[160px] justify-start text-left font-medium text-carebase-text-primary text-base bg-white border-carebase-blue hover:bg-carebase-blue-light px-3 py-2 shadow-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-carebase-blue" />
                {selectedDate
                  ? format(selectedDate, 'M月d日 (E)', { locale: ja })
                  : '読み込み中...'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                initialFocus
                locale={ja}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
            onClick={() => selectedDate && setSelectedDate(addDays(selectedDate, 1))}
          >
            翌日
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* フィルターパネル */}
      {showFilters && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">ケアカテゴリ</h3>
              <div className="flex flex-wrap gap-2">
                {careCategoryGroups.map((group) => (
                  <Button
                    key={group.key}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    style={{
                      borderColor: rgbToString([...group.color]),
                      color: rgbToString([...group.color]),
                    }}
                  >
                    {React.createElement(getLucideIcon(group.icon), {
                      className: 'h-3 w-3 mr-1',
                    })}
                    {group.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">実施状況</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-green-500 text-green-600"
                >
                  <Check className="h-3 w-3 mr-1" />
                  実施済
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-red-500 text-red-600">
                  未実施
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-400 text-gray-600"
                >
                  予定のみ
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">表示設定</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  全て表示
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  現在時刻付近
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'time' && <TimeBaseView />}
      {activeView === 'user' && <UserBaseView />}
      {activeView === 'week' && (
        <ResponsiveCareboardWeekView
          selectedDate={selectedDate || new Date()}
          onDateChange={setSelectedDate}
          onEventClick={(event, resident) => {
            console.log('Event clicked:', event, resident);
            // TODO: イベント詳細モーダルを表示
          }}
          onTimeSlotClick={(time, date) => {
            console.log('Time slot clicked:', time, date);
            // TODO: 新規イベント作成モーダルを表示
          }}
        />
      )}

      {/* 一括記録モーダル */}
      <BulkCareRecordModal
        isOpen={showBulkRecordModal}
        onClose={() => setShowBulkRecordModal(false)}
        residents={careBoardData.filter((r) => r.admissionStatus === '入居中')}
        onSave={handleSaveBulkRecords}
      />
    </div>
  );
}
