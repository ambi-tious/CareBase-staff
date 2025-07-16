import { cn } from '@/lib/utils';
import { CareCategoryKey, CareEvent, careBoardData } from '@/mocks/care-board-data';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { CareEventStatus, CareRecordModal, ResidentInfoCell, VitalSigns } from './care-board-utils';

export function TimeBaseView() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const currentTimeRowRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState(''); // 空文字で初期化
  const [selectedEvent, setSelectedEvent] = useState<{
    event: CareEvent;
    residentId: number;
    residentName: string;
    isNew?: boolean;
  } | null>(null);
  const [careEvents, setCareEvents] = useState<Record<number, CareEvent[]>>({});

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

  // Initialize care events from careBoardData
  useEffect(() => {
    if (isClient) {
      const initialEvents: Record<number, CareEvent[]> = {};
      careBoardData.forEach(resident => {
        initialEvents[resident.id] = [...resident.events];
      });
      setCareEvents(initialEvents);
    }
  }, [isClient]);

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

  const handleEventClick = useCallback((event: CareEvent, residentId: number, residentName: string) => {
    setSelectedEvent({
      event,
      residentId,
      residentName
    });
  }, []);

  const handleCellClick = useCallback((time: string, residentId: number, residentName: string) => {
    // Create a new empty event
    const newEvent: CareEvent = {
      time,
      icon: 'ClipboardList',
      label: '',
      categoryKey: undefined,
      details: '',
    };
    
    setSelectedEvent({
      event: newEvent,
      residentId,
      residentName,
      isNew: true
    });
  }, []);

  const handleSaveRecord = useCallback((updatedEvent: CareEvent, residentId: number, isNew: boolean) => {
    setCareEvents(prev => {
      const residentEvents = [...(prev[residentId] || [])];
      
      if (isNew) {
        // Add new event
        residentEvents.push(updatedEvent);
      } else {
        // Update existing event
        const index = residentEvents.findIndex(e => 
          e.time === selectedEvent?.event.time && 
          e.label === selectedEvent?.event.label
        );
        
        if (index !== -1) {
          residentEvents[index] = updatedEvent;
        }
      }
      
      return {
        ...prev,
        [residentId]: residentEvents
      };
    });
    
    setSelectedEvent(null);
  }, [selectedEvent]);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const [residentId, eventTime, eventLabel] = draggableId.split('::');
    const newTime = destination.droppableId;
    
    setCareEvents(prev => {
      const residentEvents = [...(prev[Number(residentId)] || [])];
      const eventIndex = residentEvents.findIndex(e => 
        e.time === eventTime && e.label === eventLabel
      );
      
      if (eventIndex !== -1) {
        const updatedEvent = {...residentEvents[eventIndex], time: newTime};
        residentEvents[eventIndex] = updatedEvent;
      }
      
      return {
        ...prev,
        [Number(residentId)]: residentEvents
      };
    });
  }, []);

  const allTimeSlots = generateTimeSlots(60);

  // 予定と実績をランダムに割り当てる関数（デモ用）
  const getEventStatus = (_event: CareEvent): 'scheduled' | 'completed' => {
    // 実際の実装では、APIからのデータに基づいてステータスを設定します
    // ここではデモのためにランダムに割り当てています
    // Server-side rendering時は固定値を返し、クライアント側でのみランダムを使用
    if (!isClient) {
      return 'scheduled';
    }
    
    // 固定のシード値を使用して決定論的な結果を生成
    const eventId = _event.time + _event.label;
    const hash = [...eventId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 2 === 0 ? 'completed' : 'scheduled';
  };

  function EventCell({ events, time, residentId, residentName }: { 
    events: CareEvent[]; 
    time: string;
    residentId: number;
    residentName: string;
  }) {
    // バイタル関連のカテゴリキー
    const vitalCategories: CareCategoryKey[] = ['temperature', 'pulse', 'bloodPressure'];

    // バイタル以外のイベントをフィルタリング
    const nonVitalEvents = events.filter((event) => {
      if (!event.categoryKey || !vitalCategories.includes(event.categoryKey)) {
        if (event.time === 'N/A' || !event.time) {
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
      if ((event.time === 'N/A' || !event.time) && event.categoryKey) {
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
      <Droppable droppableId={time}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-16 border-b border-gray-200 p-1.5 flex flex-col items-start justify-start gap-1.5`}
            onClick={() => nonVitalEvents.length === 0 && !hasVitalEvents && handleCellClick(time, residentId, residentName)}
          >
        {/* バイタルイベントがあれば統合表示 */}
            {hasVitalEvents && (
              <div onClick={(e) => {
                e.stopPropagation();
                handleEventClick(vitalEvents[0], residentId, residentName);
              }}>
                <VitalSigns events={vitalEvents} status={vitalStatus} />
              </div>
            )}

        {/* その他のイベントを個別表示 */}
            {nonVitalEvents.map((event, index) => {
          const category = event.categoryKey;
          // 各イベントに予定または実績のステータスを割り当て
          const status = getEventStatus(event);
          return (
              <Draggable 
                key={`${event.time || 'no-time'}-${event.label}`} 
                draggableId={`${residentId}::${event.time}::${event.label}`} 
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event, residentId, residentName);
                    }}
                  >
                    <CareEventStatus
                      event={event}
                      category={category}
                      status={status}
                    />
                  </div>
                )}
              </Draggable>
          );
        })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }

  return (
    <>
    {!isClient ? (
      // Server-side rendering fallback
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">読み込み中...</div>
          </div>
        </div>
      </div>
    ) : (
      <DragDropContext onDragEnd={handleDragEnd}>
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
                  <EventCell 
                    events={careEvents[resident.id] || resident.events} 
                    time={time} 
                    residentId={resident.id}
                    residentName={resident.name}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    {selectedEvent && (
      <CareRecordModal
        event={selectedEvent.event}
        residentId={selectedEvent.residentId}
        residentName={selectedEvent.residentName}
        isNew={selectedEvent.isNew}
        onClose={() => setSelectedEvent(null)}
        onSave={handleSaveRecord}
      />
    )}
      </DragDropContext>
    )}
    </>
  );
}
