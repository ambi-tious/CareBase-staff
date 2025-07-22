import { getLucideIcon } from '@/lib/lucide-icon-registry';
import {
  careBoardData,
  CareCategoryGroupKey,
  careCategoryGroups,
  CareCategoryKey,
  CareEvent,
  getCategoriesByGroup,
} from '@/mocks/care-board-data';
import React, { useCallback, useEffect, useState } from 'react';
import {
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
    (groupKey: CareCategoryGroupKey, residentId: number, residentName: string) => {
      // グループの最初のカテゴリで新規イベントを作成
      const groupCategories = getCategoriesByGroup(groupKey);
      const firstCategory = groupCategories[0];
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':00';

      const newEvent: CareEvent = {
        scheduledTime: currentTime,
        time: currentTime,
        icon: firstCategory?.icon || 'ClipboardList',
        label: '',
        categoryKey: firstCategory?.key,
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
            (e) =>
              e.scheduledTime === selectedEvent?.event.scheduledTime &&
              e.label === selectedEvent?.event.label
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

  // グループに属するイベントを取得する関数
  const getEventsForGroup = (events: CareEvent[], groupKey: CareCategoryGroupKey): CareEvent[] => {
    const groupCategories = getCategoriesByGroup(groupKey);
    const groupCategoryKeys = groupCategories.map((cat) => cat.key);

    return events.filter(
      (event) => event.categoryKey && groupCategoryKeys.includes(event.categoryKey)
    );
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md max-h-[calc(100vh-180px)]">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `200px repeat(${careCategoryGroups.length}, minmax(160px, 1fr))`,
          }}
        >
          {/* ヘッダー行 */}
          <div className="sticky top-0 left-0 bg-gray-100 p-3 border-b border-r border-gray-300 z-20 flex items-center justify-center">
            <span className="text-base font-semibold">利用者名</span>
          </div>
          {careCategoryGroups.map((group) => (
            <div
              key={group.key}
              className="sticky top-0 bg-gray-100 border-b border-r border-gray-300 z-10 text-sm text-center flex flex-col items-center justify-center p-2"
            >
              <div className="flex items-center justify-center">
                {React.createElement(getLucideIcon(group.icon), {
                  className: 'h-5 w-5 mr-1',
                  style: { color: rgbToString([...group.color]) },
                })}
                <span className="font-medium">{group.label}</span>
              </div>
            </div>
          ))}

          {/* 利用者行 */}
          {careBoardData.map((resident) => (
            <div key={resident.id} className="contents">
              <div className="flex items-center gap-3 p-3 border-b border-r border-gray-200 bg-gray-50 sticky left-0 z-[5] hover:bg-gray-100 transition-colors">
                <ResidentInfoCell resident={resident} />
              </div>
              {careCategoryGroups.map((group) => {
                const residentEvents = careEvents[resident.id] || resident.events;
                const groupEvents = getEventsForGroup(residentEvents, group.key);

                return (
                  <div
                    key={`${resident.id}-${group.key}`}
                    className="p-2 border-b border-r border-gray-200 text-sm hover:bg-gray-50 transition-colors cursor-pointer min-h-16"
                    style={{
                      backgroundColor:
                        groupEvents.length > 0
                          ? rgbToString([...group.color]) + '10'
                          : 'transparent',
                    }}
                    onClick={() => {
                      if (groupEvents.length === 0) {
                        handleCellClick(group.key, resident.id, resident.name);
                      }
                    }}
                  >
                    {groupEvents.length > 0 ? (
                      groupEvents.map((event, index) => (
                        <div
                          key={index}
                          className="text-xs p-1 rounded hover:bg-white/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event, resident.id, resident.name);
                          }}
                        >
                          <CareEventStatus
                            event={event}
                            category={event.categoryKey as CareCategoryKey}
                            status={getEventStatus(event)}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-300">-</span>
                      </div>
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
