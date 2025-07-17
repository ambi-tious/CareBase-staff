import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { careBoardData, careCategories, CareCategoryKey, CareEvent } from '@/mocks/care-board-data';
import React, { useCallback, useEffect, useState } from 'react';
import {
  CARE_CATEGORY_COLORS,
  CareEventStatusComponent as CareEventStatus,
  CareRecordModal,
  getEventStatus,
  ResidentInfoCell,
  rgbToString,
  type CareEventStatus as CareEventStatusType,
} from './care-board-utils';

export function UserBaseView() {
  const [isClient, setIsClient] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    event: CareEvent;
    residentId: number;
    residentName: string;
    status?: CareEventStatusType;
    isNew?: boolean;
  } | null>(null);
  const [careEvents, setCareEvents] = useState<Record<number, CareEvent[]>>({});

  // Set client-side flag to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);

    // Initialize care events from careBoardData
    const initialEvents: Record<number, CareEvent[]> = {};
    careBoardData.forEach((resident) => {
      initialEvents[resident.id] = [...resident.events];
    });
    setCareEvents(initialEvents);
  }, []);

  const handleEventClick = useCallback(
    (event: CareEvent, residentId: number, residentName: string) => {
      setSelectedEvent({
        event,
        residentId,
        residentName,
        status: getEventStatus(event),
      });
    },
    []
  );

  const handleCellClick = useCallback(
    (categoryKey: CareCategoryKey, residentId: number, residentName: string) => {
      // Create a new empty event
      const category = careCategories.find((c) => c.key === categoryKey);
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':00';
      
      const newEvent: CareEvent = {
        scheduledTime: currentTime,
        time: currentTime,
        icon: category?.icon || 'ClipboardList',
        label: '',
        categoryKey,
        details: '',
      };

      setSelectedEvent({
        event: newEvent,
        residentId,
        residentName,
        isNew: true,
      });
    },
    []
  );

  const handleSaveRecord = useCallback(
    (updatedEvent: CareEvent, residentId: number, isNew: boolean) => {
      setCareEvents((prev) => {
        const residentEvents = [...(prev[residentId] || [])];

        if (isNew) {
          // Add new event
          residentEvents.push(updatedEvent);
        } else {
          // Update existing event
          const index = residentEvents.findIndex(
            (e) => e.scheduledTime === selectedEvent?.event.scheduledTime && e.label === selectedEvent?.event.label
          );

          if (index !== -1) {
            residentEvents[index] = updatedEvent;
          }
        }

        return {
          ...prev,
          [residentId]: residentEvents,
        };
      });

      setSelectedEvent(null);
    },
    [selectedEvent]
  );

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md max-h-[calc(100vh-200px)]">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `200px repeat(${careCategories.length}, minmax(120px, 1fr))`,
          }}
        >
          <div className="sticky top-0 left-0 bg-carebase-blue text-white p-3 border-b border-r border-gray-300 z-20 flex items-center justify-center">
            <span className="text-base font-semibold">利用者名</span>
          </div>
          {careCategories.map((category) => (
            <div
              key={category.key}
              className="sticky top-0 bg-carebase-blue text-white border-b border-r border-gray-300 z-10 text-sm text-center flex flex-col items-center justify-center"
              style={{ backgroundColor: rgbToString(CARE_CATEGORY_COLORS[category.key]) }}
            >
              <div className="flex items-center justify-center">
                {React.createElement(getLucideIcon(category.icon), { className: 'h-5 w-5 mr-1' })}
                <span>{category.label}</span>
              </div>
            </div>
          ))}
          {careBoardData.map((resident) => (
            <div key={resident.id} className="contents">
              <div className="flex items-center gap-3 p-3 border-b border-r border-gray-200 bg-gray-50 sticky left-0 z-[5] hover:bg-gray-100 transition-colors">
                <ResidentInfoCell resident={resident} />
              </div>
              {careCategories.map((category) => {
                const eventsForCategory = (careEvents[resident.id] || resident.events).filter((e) => e.categoryKey === category.key);
                const event = eventsForCategory[0]; // 最初のイベントを使用
                const bgColor = category.key
                  ? CARE_CATEGORY_COLORS[category.key] + '10'
                  : '#f0f0f0';
                return (
                  <div
                    key={`${resident.id}-${category.key}`}
                    className="p-2 border-b border-r border-gray-200 text-sm text-center hover:bg-gray-50 transition-colors cursor-pointer min-h-16"
                    style={{ backgroundColor: event ? bgColor : 'transparent' }}
                    onClick={() => {
                      if (!event) {
                        handleCellClick(category.key, resident.id, resident.name);
                      }
                    }}
                  >
                    {event ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event, resident.id, resident.name);
                        }}
                      >
                        <CareEventStatus
                          event={event}
                          category={category.key}
                          status={getEventStatus(event)}
                        />
                      </div>
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
      {selectedEvent && (
        <CareRecordModal
          event={selectedEvent.event}
          residentId={selectedEvent.residentId}
          residentName={selectedEvent.residentName}
          status={selectedEvent.status}
          isNew={selectedEvent.isNew}
          onClose={() => setSelectedEvent(null)}
          onSave={handleSaveRecord}
        />
      )}
    </>
  );
}
