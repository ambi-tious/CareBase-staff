'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import {
  careBoardData,
  careCategories,
  type CareCategoryKey,
  type CareEvent,
} from '@/mocks/care-board-data';
import { addDays, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  BookOpen,
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardEdit,
  Clock as ClockIcon,
  Filter,
  Printer,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

type ActiveTabView = 'time' | 'user';

// ケア種別ごとの色定義
const CARE_CATEGORY_COLORS: Record<CareCategoryKey, string> = {
  drinking: '#3498DB', // 飲水: 青色系
  excretion: '#795548', // 排泄: 茶色系
  breakfast: '#F39C12', // 朝食: オレンジ系
  lunch: '#F39C12', // 昼食: オレンジ系
  snack: '#F1C40F', // おやつ: 黄色系
  dinner: '#F39C12', // 夕食: オレンジ系
  bedtimeMeal: '#F39C12', // 眠前食: オレンジ系
  medication: '#9B59B6', // 服薬: 紫色系
  oralCare: '#9B59B6', // 口腔ケア: 紫色系
  eyeDrops: '#9B59B6', // 点眼: 紫色系
  bathing: '#4A90E2', // 入浴: 水色系
  temperature: '#E74C3C', // 体温: 赤色系
  pulse: '#E74C3C', // 脈拍: 赤色系
  bloodPressure: '#E74C3C', // 血圧: 赤色系
  respiration: '#E74C3C', // 呼吸: 赤色系
  spo2: '#E74C3C', // SpO2: 赤色系
};

// ケアイベントの実施ステータス
type CareEventStatus = 'scheduled' | 'completed' | 'in-progress' | 'missed';

// ケアイベントのステータス表示用コンポーネント
interface CareEventStatusProps {
  event: CareEvent;
  category?: CareCategoryKey;
  status?: CareEventStatus;
}

const CareEventStatus: React.FC<CareEventStatusProps> = ({ 
  event, 
  category,
  status = 'scheduled' // デフォルトは予定状態
}) => {
  const Icon = getLucideIcon(event.icon);
  const baseColor = category ? CARE_CATEGORY_COLORS[category] : '#333333';
  
  // ステータスに応じたスタイルを設定
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          background: `${baseColor}30`, // 濃い背景色（透明度30%）
          border: `2px solid ${baseColor}`,
          borderStyle: 'solid',
        };
      case 'in-progress':
        return {
          background: `${baseColor}20`, // 中間の背景色（透明度20%）
          border: `2px solid ${baseColor}`,
          borderStyle: 'dashed',
        };
      case 'missed':
        return {
          background: '#FFE5E5', // 薄い赤色背景
          border: '2px solid #FF6B6B',
          borderStyle: 'solid',
        };
      default: // scheduled
        return {
          background: `${baseColor}10`, // 薄い背景色（透明度10%）
          border: `1px solid ${baseColor}`,
          borderStyle: 'dotted',
        };
    }
  };
  
  const statusStyles = getStatusStyles();
  
  return (
    <div
      className="flex items-center gap-1 p-1.5 rounded-md text-xs relative transition-all duration-200"
      style={{ 
        backgroundColor: statusStyles.background,
        border: statusStyles.border,
        borderStyle: statusStyles.borderStyle as any,
        color: baseColor,
      }}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="font-medium truncate">{event.label}</span>
      {event.time !== 'N/A' && <span className="text-xs opacity-75 ml-auto">{event.time}</span>}
      
      {/* 実施済みの場合はチェックマークを表示 */}
      {status === 'completed' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

// Component for Time Base View - 24時間縦スクロール対応
function TimeBaseView() {
  // スクロールコンテナへの参照
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // 現在時刻の行への参照
  const currentTimeRowRef = useRef<HTMLDivElement | null>(null);

  // 画面読み込み完了後に現在時刻の行へスクロールする
  useEffect(() => {
    // 少し遅延させてDOMが完全に描画された後に実行
    const scrollTimer = setTimeout(() => {
      if (scrollContainerRef.current && currentTimeRowRef.current) {
        // 現在時刻の行の位置を取得
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const rowRect = currentTimeRowRef.current.getBoundingClientRect();

        // スクロール位置を計算（現在時刻の行が上部に来るように）
        const scrollTop = rowRect.top - containerRect.top - 20; // 20pxのオフセットで少し上に表示

        // スムーズにスクロール
        scrollContainerRef.current.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      }
    }, 300); // 300ms遅延

    return () => clearTimeout(scrollTimer);
  }, []);

  // 24時間分のタイムスロットを生成（30分間隔）
  const generateTimeSlots = (interval = 60) => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots(60); // 1時間間隔

  // 現在時刻を取得
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    // 現在時刻を最も近い時間スロットに丸める
    const roundedMinute = Math.floor(minute / 60) * 60;
    return `${hour.toString().padStart(2, '0')}:${roundedMinute.toString().padStart(2, '0')}`;
  };

  const currentTime = getCurrentTimeSlot();

  // イベントのステータスをランダムに生成（デモ用）
  const getRandomStatus = (): CareEventStatus => {
    const statuses: CareEventStatus[] = ['scheduled', 'completed', 'in-progress', 'missed'];
    const randomIndex = Math.floor(Math.random() * 4);
    return statuses[randomIndex];
  };

  function EventCell({ events, time }: { events: CareEvent[]; time: string }) {
    // 時間帯に関連するイベントをフィルタリング
    const relevantEvents = events.filter((event) => {
      // 'N/A'の場合はカテゴリで判断
      if (event.time === 'N/A' && event.categoryKey) {
        // 特定のカテゴリのイベントを特定の時間帯に表示
        const hour = parseInt(time.split(':')[0]);
        if (event.categoryKey === 'breakfast' && hour >= 7 && hour < 9) return true;
        if (event.categoryKey === 'lunch' && hour >= 12 && hour < 14) return true;
        if (event.categoryKey === 'dinner' && hour >= 18 && hour < 20) return true;
        return false;
      }
      // 時間指定がある場合は時間で判断
      return event.time.startsWith(time.split(':')[0]);
    });

    return (
      <div
        className={`h-16 border-b border-gray-200 p-1.5 flex flex-col items-start justify-start gap-1.5 overflow-y-auto`}
      >
        {relevantEvents.map((event) => {
          const category = event.categoryKey;
          // デモ用にランダムなステータスを生成
          const status = getRandomStatus();
          return (
            <CareEventStatus
              key={`${event.time}-${event.label}`}
              event={event}
              category={category}
              status={status}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-auto max-h-[calc(100vh-200px)]" ref={scrollContainerRef}>
        <div
          className="grid relative" // relative for sticky positioning context
          style={{
            gridTemplateColumns: `80px repeat(${careBoardData.length}, minmax(160px, 1fr))`,
          }} // Adjusted minmax for resident column
        >
          {/* Top-left corner (empty or title) */}
          <div className="sticky top-0 left-0 bg-carebase-blue text-white z-30 flex items-center justify-center p-3 border-b border-r border-gray-300">
            <span className="font-semibold text-base">時間</span>
          </div>

          {/* Resident names header (sticky top) */}
          {careBoardData.map((resident) => (
            <div
              key={resident.id}
              className="sticky top-0 bg-carebase-blue text-white z-20 flex flex-col items-center py-2 border-b border-r border-gray-300 p-2"
            >
              <Link
                href={`/residents/${resident.id}`}
                className="flex items-center gap-2 group w-full"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  {' '}
                  <Image
                    src={resident.avatarUrl || '/placeholder.svg'}
                    alt={resident.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-medium">{resident.name}</span>
                  <span className="text-xs">{resident.careLevel}</span>
                </div>
              </Link>
            </div>
          ))}

          {/* Time slots and events */}
          {allTimeSlots.map((time) => (
            <div
              key={time}
              className={`contents ${time === currentTime ? 'current-time-row' : ''}`}
              ref={time === currentTime ? currentTimeRowRef : undefined}
            >
              {/* Time slot label (sticky left) */}
              <div
                className={cn(
                  'sticky left-0 flex items-center justify-center p-2 border-b border-r border-gray-200 text-sm font-medium z-10 h-16',
                  time === currentTime
                    ? 'bg-yellow-100 text-yellow-800 font-bold border-l-4 border-yellow-500'
                    : 'bg-gray-50 text-gray-700'
                )}
              >
                {time}
              </div>
              {/* Event cells for each resident */}
              {careBoardData.map((resident) => (
                <div
                  key={`${resident.id}-${time}`}
                  className={cn(
                    'border-r border-gray-200 relative',
                    time === currentTime ? 'bg-yellow-50' : '',
                    // 偶数時間帯に薄い背景色を適用
                    parseInt(time.split(':')[0]) % 2 === 0 ? 'bg-gray-50/50' : ''
                  )}
                >
                  <EventCell events={resident.events} time={time} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Component for User Base View (new logic)
function UserBaseView() {
  const getEventForCategory = (
    residentEvents: CareEvent[],
    categoryKey: CareCategoryKey
  ): CareEvent | undefined => {
    return residentEvents.find((event) => event.categoryKey === categoryKey);
  };

  // イベントのステータスをランダムに生成（デモ用）
  const getRandomStatus = (): CareEventStatus => {
    const statuses: CareEventStatus[] = ['scheduled', 'completed', 'in-progress', 'missed'];
    const randomIndex = Math.floor(Math.random() * 4);
    return statuses[randomIndex];
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `220px repeat(${careCategories.length}, minmax(120px, 1fr))`,
        }} // Adjusted column widths
      >
        <div className="sticky top-0 left-0 bg-carebase-blue text-white p-3 border-b border-r border-gray-300 z-20 flex items-center justify-center h-16">
          <span className="text-base font-semibold">利用者名</span>
        </div>
        {careCategories.map((category) => (
          <div
            key={category.key}
            className="sticky top-0 bg-carebase-blue text-white p-3 border-b border-r border-gray-300 z-10 text-sm text-center flex flex-col items-center justify-center h-16"
            style={{ backgroundColor: CARE_CATEGORY_COLORS[category.key] }}
          >
            <div className="flex items-center justify-center mb-1">
              {React.createElement(getLucideIcon(category.icon), { className: 'h-5 w-5 mr-1' })}
              <span>{category.label}</span>
            </div>
          </div>
        ))}
        {careBoardData.map((resident) => (
          <div key={resident.id} className="contents">
            <div className="flex items-center gap-3 p-3 border-b border-r border-gray-200 bg-gray-50 sticky left-0 z-[5] hover:bg-gray-100 transition-colors">
              <Link
                href={`/residents/${resident.id}`}
                className="flex items-center gap-2 group w-full"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  {' '}
                  <Image
                    src={resident.avatarUrl || '/placeholder.svg'}
                    alt={resident.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-medium">{resident.name}</span>
                  <span className="text-xs text-gray-500">{resident.careLevel}</span>
                </div>
              </Link>
            </div>
            {careCategories.map((category) => {
              const event = getEventForCategory(resident.events, category.key);
              const bgColor = category.key ? CARE_CATEGORY_COLORS[category.key] + '10' : '#f0f0f0'; // 10は透明度
              // デモ用にランダムなステータスを生成
              const status = event ? getRandomStatus() : undefined;

              return (
                <div
                  key={`${resident.id}-${category.key}`}
                  className="p-2 border-b border-r border-gray-200 text-sm text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ backgroundColor: event ? bgColor : 'transparent' }}
                >
                  {event ? (
                    <CareEventStatus 
                      event={event} 
                      category={category.key} 
                      status={status}
                    />
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CareBoard() {
  const [activeView, setActiveView] = useState<ActiveTabView>('time');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // 現在の時刻を取得（デバッグ用）
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  return (
    <div data-testid="care-board" className="p-4 md:p-6 bg-carebase-bg max-h-screen">
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
          </div>
          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
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
          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
          >
            <Printer className="h-4 w-4 mr-2 text-carebase-blue" />
            印刷
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* デバッグ情報（開発時のみ表示） */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mr-2">
              現在時刻: {currentHour}:{currentMinute < 10 ? `0${currentMinute}` : currentMinute}
            </div>
          )}

          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
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
                {format(selectedDate, 'M月d日 (E)', { locale: ja })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
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
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
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
              <h3 className="text-sm font-medium mb-2">ケア種別</h3>
              <div className="flex flex-wrap gap-2">
                {careCategories.slice(0, 6).map((category) => (
                  <Button
                    key={category.key}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    style={{
                      borderColor: CARE_CATEGORY_COLORS[category.key],
                      color: CARE_CATEGORY_COLORS[category.key],
                    }}
                  >
                    {React.createElement(getLucideIcon(category.icon), {
                      className: 'h-3 w-3 mr-1',
                    })}
                    {category.label}
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

      {activeView === 'time' ? <TimeBaseView /> : <UserBaseView />}
    </div>
  );
}
