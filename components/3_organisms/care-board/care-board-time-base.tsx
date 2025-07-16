import { cn } from '@/lib/utils';
import { CareCategoryKey, CareEvent, careBoardData } from '@/mocks/care-board-data';
import { useEffect, useRef, useState } from 'react';
import { VitalSigns } from './care-board-utils';

// CareEventStatusコンポーネントは共通化するためutilsまたは別ファイルに分離推奨
import { CareEventStatus, ResidentInfoCell } from './care-board-utils';

export function TimeBaseView() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const currentTimeRowRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');

  // Set client-side flag and current time to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    const getCurrentTimeSlot = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const roundedMinute = Math.floor(minute / 60) * 60;
      return `${hour.toString().padStart(2, '0')}:${roundedMinute.toString().padStart(2, '0')}`;
    };
    setCurrentTime(getCurrentTimeSlot());
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
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
  }, [isClient, currentTime]);

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

  // 予定と実績をランダムに割り当てる関数（デモ用）
  const getEventStatus = (_event: CareEvent): 'scheduled' | 'completed' => {
    // 実際の実装では、APIからのデータに基づいてステータスを設定します
    // ここではデモのためにランダムに割り当てています
    // Server-side rendering時は一貫した値を返し、クライアント側でのみランダムを使用
    if (!isClient) {
      return 'scheduled';
    }
    return Math.random() > 0.5 ? 'completed' : 'scheduled';
  };

  function EventCell({ events, time }: { events: CareEvent[]; time: string }) {
    // バイタル関連のカテゴリキー
    const vitalCategories: CareCategoryKey[] = ['temperature', 'pulse', 'bloodPressure'];

    // バイタル以外のイベントをフィルタリング
    const nonVitalEvents = events.filter((event) => {
      if (!event.categoryKey || !vitalCategories.includes(event.categoryKey)) {
        if (event.time === 'N/A') {
          const hour = parseInt(time.split(':')[0]);
          if (event.categoryKey === 'breakfast' && hour >= 7 && hour < 9) return true;
          if (event.categoryKey === 'lunch' && hour >= 12 && hour < 14) return true;
          if (event.categoryKey === 'dinner' && hour >= 18 && hour < 20) return true;
          return false;
        }
        return event.time.startsWith(time.split(':')[0]);
      }
      return false;
    });

    // バイタルイベントをフィルタリング
    const vitalEvents = events.filter((event) => {
      if (event.time === 'N/A' && event.categoryKey) {
        return false; // N/Aのバイタルは表示しない
      }
      if (
        event.time.startsWith(time.split(':')[0]) &&
        event.categoryKey &&
        vitalCategories.includes(event.categoryKey)
      ) {
        return true;
      }
      return false;
    });

    // バイタルイベントがあるかどうか
    const hasVitalEvents = vitalEvents.length > 0;

    // バイタルのステータスを決定（すべてのバイタルイベントが同じステータスと仮定）
    const vitalStatus = hasVitalEvents ? getEventStatus(vitalEvents[0]) : 'scheduled';

    return (
      <div
        className={`min-h-16 border-b border-gray-200 p-1.5 flex flex-col items-start justify-start gap-1.5`}
      >
        {/* バイタルイベントがあれば統合表示 */}
        {hasVitalEvents && <VitalSigns events={vitalEvents} status={vitalStatus} />}

        {/* その他のイベントを個別表示 */}
        {nonVitalEvents.map((event) => {
          const category = event.categoryKey;
          // 各イベントに予定または実績のステータスを割り当て
          const status = getEventStatus(event);
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
              className={`contents ${isClient && time === currentTime ? 'current-time-row' : ''}`}
              ref={isClient && time === currentTime ? currentTimeRowRef : undefined}
            >
              <div
                className={cn(
                  'sticky left-0 flex items-center justify-center p-2 border-b border-r border-gray-200 text-sm font-medium z-10 h-16',
                  isClient && time === currentTime
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
                    isClient && time === currentTime ? 'bg-yellow-50' : '',
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
