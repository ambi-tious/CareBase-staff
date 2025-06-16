'use client';

import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  careBoardData,
  careCategories,
  type CareEvent,
  type CareCategoryKey,
} from '@/mocks/care-board-data';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ClipboardEdit,
  BookOpen,
  CalendarIcon,
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';

type ActiveTabView = 'time' | 'user';

// Component for Time Base View - 24時間縦スクロール対応
function TimeBaseView() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 24時間分のタイムスロットを生成（30分間隔）
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  // 現在時刻を取得
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const roundedMinute = minute < 30 ? 0 : 30;
    return `${hour.toString().padStart(2, '0')}:${roundedMinute.toString().padStart(2, '0')}`;
  };

  const currentTime = getCurrentTimeSlot();

  useEffect(() => {
    // 少し遅延させて現在時刻の位置にスクロール
    setTimeout(() => {
      const currentTimeElement = document.getElementById('current-time-row');
      if (currentTimeElement && scrollContainerRef.current) {
        const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
        const elementTop = currentTimeElement.getBoundingClientRect().top;
        const offset =
          elementTop -
          containerTop -
          scrollContainerRef.current.clientHeight / 2 +
          currentTimeElement.clientHeight / 2;
        scrollContainerRef.current.scrollTop += offset;
      }
    }, 100);
  }, []);

  function EventCell({ events, time }: { events: CareEvent[]; time: string }) {
    const relevantEvents = events.filter((event) => event.time.startsWith(time.split(':')[0]));
    return (
      <div
        className={`h-10 border-b border-gray-200 p-1 flex flex-col flex-wrap items-start justify-start gap-0.5`}
      >
        {relevantEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <event.icon className="h-2.5 w-2.5 text-carebase-blue" />
            <span className="truncate text-[10px]">{event.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-auto max-h-[calc(100vh-220px)]" ref={scrollContainerRef}>
        {' '}
        {/* Adjusted max-height */}
        <div
          className="grid relative" // relative for sticky positioning context
          style={{
            gridTemplateColumns: `80px repeat(${careBoardData.length}, minmax(120px, 1fr))`,
          }} // Adjusted minmax for resident column
        >
          {/* Top-left corner (empty or title) */}
          <div className="sticky top-0 left-0 bg-carebase-blue text-white z-30 flex items-center justify-center p-2 border-b border-r border-gray-300">
            <span className="font-semibold text-sm">時間</span>
          </div>

          {/* Resident names header (sticky top) */}
          {careBoardData.map((resident) => (
            <div
              key={resident.id}
              className="sticky top-0 bg-carebase-blue text-white z-20 flex flex-col items-center p-2 border-b border-r border-gray-300"
            >
              <Link
                href={`/residents/${resident.id}`}
                className="flex flex-col items-center text-white hover:text-gray-200"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden mb-1">
                  {' '}
                  {/* Adjusted avatar size */}
                  <Image
                    src={
                      resident.avatarUrl ||
                      '/placeholder.svg?height=32&width=32&query=default+avatar'
                    }
                    alt={resident.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                  />
                </div>
                <span className="text-xs text-center font-medium">{resident.name}</span>
              </Link>
            </div>
          ))}

          {/* Time slots and events */}
          {allTimeSlots.map((time) => (
            <div
              key={time}
              className={`contents ${time === currentTime ? 'bg-yellow-50' : ''}`}
              id={time === currentTime ? 'current-time-row' : undefined}
            >
              {/* Time slot label (sticky left) */}
              <div
                className={`sticky left-0 flex items-center justify-center p-1 border-b border-r border-gray-200 text-xs font-medium z-10 h-10 ${time === currentTime ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-50 text-gray-700'}`} // Adjusted padding and height
              >
                {time}
              </div>
              {/* Event cells for each resident */}
              {careBoardData.map((resident) => (
                <div
                  key={`${resident.id}-${time}`}
                  className={`border-r border-gray-200 ${time === currentTime ? 'bg-yellow-50' : ''}`}
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
        style={{ gridTemplateColumns: `180px repeat(${careCategories.length}, minmax(90px, 1fr))` }} // Adjusted column widths
      >
        <div className="sticky top-0 left-0 bg-carebase-blue text-white p-2 border-b border-r border-gray-300 z-20 flex items-center justify-center">
          利用者名
        </div>
        {careCategories.map((category) => (
          <div
            key={category.key}
            className="sticky top-0 bg-carebase-blue text-white p-2 border-b border-r border-gray-300 z-10 text-xs text-center flex items-center justify-center"
          >
            {category.label}
          </div>
        ))}
        {careBoardData.map((resident) => (
          <div key={resident.id} className="contents">
            <div className="flex items-center gap-2 p-2 border-b border-r border-gray-200 bg-gray-50 sticky left-0 z-[5]">
              <Link href={`/residents/${resident.id}`} className="flex items-center gap-2 group">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  {' '}
                  {/* Container for consistent image size */}
                  <Image
                    src={
                      resident.avatarUrl ||
                      '/placeholder.svg?height=32&width=32&query=default+avatar'
                    }
                    alt={resident.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-full"
                  />
                </div>
                <span className="text-sm group-hover:underline">{resident.name}</span>
              </Link>
            </div>
            {careCategories.map((category) => {
              const event = getEventForCategory(resident.events, category.key);
              return (
                <div
                  key={`${resident.id}-${category.key}`}
                  className="p-2 border-b border-r border-gray-200 text-xs text-center whitespace-pre-line"
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

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          <div className="flex items-center gap-0.5 rounded-lg bg-gray-200 p-0.5">
            <Button
              onClick={() => setActiveView('time')}
              className={`px-3 py-2 font-medium text-sm ${activeView === 'time' ? 'bg-carebase-blue hover:bg-carebase-blue-dark text-white' : 'bg-transparent text-gray-700 hover:bg-gray-300'}`}
            >
              時間ベース
            </Button>
            <Button
              onClick={() => setActiveView('user')}
              className={`px-3 py-2 font-medium text-sm ${activeView === 'user' ? 'bg-carebase-blue hover:bg-carebase-blue-dark text-white' : 'bg-transparent text-gray-700 hover:bg-gray-300'}`}
            >
              ご利用者ベース
            </Button>
          </div>
          {activeView === 'user' && (
            <>
              <Button
                variant="outline"
                className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-2 py-1.5 text-xs"
              >
                <ClipboardEdit className="h-3 w-3 mr-1 text-carebase-blue" />
                まとめて記録
              </Button>
              <Button
                variant="outline"
                className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-2 py-1.5 text-xs"
              >
                <BookOpen className="h-3 w-3 mr-1 text-carebase-blue" />
                マニュアルガイド
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-2 py-1.5 text-xs"
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          >
            <ChevronLeft className="h-3 w-3 mr-0.5" />
            前日
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className="w-[140px] justify-start text-left font-medium text-carebase-text-primary text-sm bg-white border-carebase-blue hover:bg-carebase-blue-light px-2 py-1.5"
              >
                <CalendarIcon className="mr-1 h-3 w-3 text-carebase-blue" />
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
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-2 py-1.5 text-xs"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            翌日
            <ChevronRight className="h-3 w-3 ml-0.5" />
          </Button>
        </div>
      </div>

      {activeView === 'time' ? <TimeBaseView /> : <UserBaseView />}

      <div className="fixed bottom-6 right-6 z-10">
        <Button className="h-16 w-16 rounded-full bg-carebase-blue shadow-lg hover:bg-carebase-blue-dark md:h-12 md:w-auto md:px-6 md:py-3 font-semibold">
          <Clock className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline">クイック作成</span>
        </Button>
      </div>
    </div>
  );
}
