import React, { useEffect, useRef } from 'react';
import { CareEvent, careBoardData } from '@/mocks/care-board-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { Check } from 'lucide-react';
import { CARE_CATEGORY_COLORS } from './care-board-utils';

// CareEventStatusコンポーネントは共通化するためutilsまたは別ファイルに分離推奨
import { CareEventStatus } from './care-board-utils';
import { ResidentInfoCell } from './care-board-utils';

export function TimeBaseView() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const currentTimeRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      if (scrollContainerRef.current && currentTimeRowRef.current) {
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const rowRect = currentTimeRowRef.current.getBoundingClientRect();
        const scrollTop = rowRect.top - containerRect.top - 20;
        scrollContainerRef.current.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      }
    }, 300);
    return () => clearTimeout(scrollTimer);
  }, []);

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

  const allTimeSlots = generateTimeSlots(60);

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const roundedMinute = Math.floor(minute / 60) * 60;
    return `${hour.toString().padStart(2, '0')}:${roundedMinute.toString().padStart(2, '0')}`;
  };

  const currentTime = getCurrentTimeSlot();

  // getRandomStatus関数とその利用を削除
  // CareEventStatusのstatusは'scheduled'固定で渡す
  function EventCell({ events, time }: { events: CareEvent[]; time: string }) {
    const relevantEvents = events.filter((event) => {
      if (event.time === 'N/A' && event.categoryKey) {
        const hour = parseInt(time.split(':')[0]);
        if (event.categoryKey === 'breakfast' && hour >= 7 && hour < 9) return true;
        if (event.categoryKey === 'lunch' && hour >= 12 && hour < 14) return true;
        if (event.categoryKey === 'dinner' && hour >= 18 && hour < 20) return true;
        return false;
      }
      return event.time.startsWith(time.split(':')[0]);
    });

    return (
      <div
        className={`min-h-16 border-b border-gray-200 p-1.5 flex flex-col items-start justify-start gap-1.5`}
      >
        {relevantEvents.map((event) => {
          const category = event.categoryKey;
          return (
            <CareEventStatus
              key={`${event.time}-${event.label}`}
              event={event}
              category={category}
              status={'scheduled'}
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
          className="grid relative"
          style={{
            gridTemplateColumns: `80px repeat(${careBoardData.length}, minmax(160px, 1fr))`,
          }}
        >
          <div className="sticky top-0 left-0 bg-gray-100 z-30 flex items-center justify-center p-3 border-b border-r border-gray-300">
            <span className="font-semibold text-base">時間</span>
          </div>
          {careBoardData.map((resident) => (
            <div
              key={resident.id}
              className="sticky top-0 bg-gray-100 z-20 flex flex-col items-center py-2 border-b border-r border-gray-300 p-2"
            >
              <ResidentInfoCell resident={resident} />
            </div>
          ))}
          {allTimeSlots.map((time) => (
            <div
              key={time}
              className={`contents ${time === currentTime ? 'current-time-row' : ''}`}
              ref={time === currentTime ? currentTimeRowRef : undefined}
            >
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
              {careBoardData.map((resident) => (
                <div
                  key={`${resident.id}-${time}`}
                  className={cn(
                    'border-r border-gray-200 relative h-auto',
                    time === currentTime ? 'bg-yellow-50' : '',
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
