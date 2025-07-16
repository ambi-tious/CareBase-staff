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
  ChevronLeft,
  ChevronRight,
  ClipboardEdit,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { useEffect, useRef, useState } from 'react';

type ActiveTabView = 'time' | 'user';

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
          behavior: 'smooth'
        });
      }
    }, 300); // 300ms遅延
    
    return () => clearTimeout(scrollTimer);
  }, []);

  // 24時間分のタイムスロットを生成（30分間隔）
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  // 現在時刻を取得
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hour = now.getHours();
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const currentTime = getCurrentTimeSlot();

  function EventCell({ events, time }: { events: CareEvent[]; time: string }) {
    const relevantEvents = events.filter((event) => event.time.startsWith(time.split(':')[0]));
    return (
      <div
        className={`h-14 border-b border-gray-200 p-1.5 flex flex-col flex-wrap items-start justify-start gap-1`}
      >
        {relevantEvents.map((event) => {
          const Icon = getLucideIcon(event.icon);
          return (
            <div key={event.label} className="flex items-center gap-1">
              <Icon className="h-4 w-4 text-carebase-blue" />
              <span className="truncate text-xs font-medium">{event.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div
        className="overflow-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        ref={scrollContainerRef}
      > 
        {/* Adjusted max-height */}
        <div
          className="grid relative" // relative for sticky positioning context
          style={{
            gridTemplateColumns: `80px repeat(${careBoardData.length}, minmax(150px, 1fr))`,
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
              className="sticky top-0 bg-carebase-blue text-white z-20 flex flex-col items-center py-2 border-b border-r border-gray-300"
            >
              <Link href={`/residents/${resident.id}`} className="flex items-center gap-2 group">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  {' '}
                  {/* Container for consistent image size */}
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
                <span className="text-base font-medium">{resident.name}</span>
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
                  'sticky left-0 flex items-center justify-center p-2 border-b border-r border-gray-200 text-sm font-medium z-10 h-14',
                  time === currentTime
                    ? 'bg-yellow-100 text-yellow-800 font-bold'
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
                    'border-r border-gray-200',
                    time === currentTime ? 'bg-yellow-50' : ''
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

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `220px repeat(${careCategories.length}, minmax(110px, 1fr))`,
        }} // Adjusted column widths
      >
        <div className="sticky top-0 left-0 bg-carebase-blue text-white p-3 border-b border-r border-gray-300 z-20 flex items-center justify-center">
          <span className="text-base font-semibold">利用者名</span>
        </div>
        {careCategories.map((category) => (
          <div
            key={category.key}
            className="sticky top-0 bg-carebase-blue text-white p-3 border-b border-r border-gray-300 z-10 text-sm text-center flex items-center justify-center"
          >
            {category.label}
          </div>
        ))}
        {careBoardData.map((resident) => (
          <div key={resident.id} className="contents">
            <div className="flex items-center gap-3 p-3 border-b border-r border-gray-200 bg-gray-50 sticky left-0 z-[5]">
              <Link href={`/residents/${resident.id}`} className="flex items-center gap-2 group">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  {' '}
                  {/* Container for consistent image size */}
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
                <span className="text-base font-medium">{resident.name}</span>
              </Link>
            </div>
            {careCategories.map((category) => {
              const event = getEventForCategory(resident.events, category.key);
              return (
                <div
                  key={`${resident.id}-${category.key}`}
                  className="p-3 border-b border-r border-gray-200 text-sm text-center whitespace-pre-line"
                >
                  {event ? (
                    event.details ? (
                      <>
                        {event.label}
                        <br />
                        {event.details}
                      </>
                    ) : (
                      event.label
                    )
                  ) : (
                    '-'
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

  // 現在の時刻を取得（デバッグ用）
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  return (
    <div data-testid="care-board" className="p-4 md:p-6 bg-carebase-bg max-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          <div className="flex items-center gap-1 rounded-lg bg-gray-200 p-1">
            <Button
              onClick={() => setActiveView('time')}
              className={`px-4 py-2.5 font-medium text-base ${activeView === 'time' ? 'bg-carebase-blue hover:bg-carebase-blue-dark text-white' : 'bg-transparent text-gray-700 hover:bg-gray-300'}`}
            >
              時間ベース
            </Button>
            <Button
              onClick={() => setActiveView('user')}
              className={`px-4 py-2.5 font-medium text-base ${activeView === 'user' ? 'bg-carebase-blue hover:bg-carebase-blue-dark text-white' : 'bg-transparent text-gray-700 hover:bg-gray-300'}`}
            >
              ご利用者ベース
            </Button>
          </div>
          {activeView === 'user' && (
            <>
              <Button
                variant="outline"
                className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm"
              >
                <ClipboardEdit className="h-4 w-4 mr-2 text-carebase-blue" />
                まとめて記録
              </Button>
              <Button
                variant="outline"
                className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm"
              >
                <BookOpen className="h-4 w-4 mr-2 text-carebase-blue" />
                マニュアルガイド
              </Button>
            </>
          )}
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
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm"
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            前日
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className="w-[160px] justify-start text-left font-medium text-carebase-text-primary text-base bg-white border-carebase-blue hover:bg-carebase-blue-light px-3 py-2"
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
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            翌日
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {activeView === 'time' ? <TimeBaseView /> : <UserBaseView />}

    </div>
  );
}
