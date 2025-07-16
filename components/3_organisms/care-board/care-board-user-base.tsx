import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { careBoardData, careCategories, CareCategoryKey, CareEvent } from '@/mocks/care-board-data';
import React, { useCallback, useEffect, useState } from 'react';
import { CARE_CATEGORY_COLORS, CareEventStatus, CareRecordModal, ResidentInfoCell, rgbToString, VitalSigns, rgbToRgba } from './care-board-utils';

export function UserBaseView() {
  const [isClient, setIsClient] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    event: CareEvent;
    residentId: number;
    residentName: string;
    status?: CareEventStatus;
    isNew?: boolean;
  } | null>(null);
  const [careEvents, setCareEvents] = useState<Record<number, CareEvent[]>>({});

  // Set client-side flag to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    
    // Initialize care events from careBoardData
    const initialEvents: Record<number, CareEvent[]> = {};
    careBoardData.forEach(resident => {
      initialEvents[resident.id] = [...resident.events];
    });
    setCareEvents(initialEvents);
  }, []);

  // 予定と実績をランダムに割り当てる関数（デモ用）
  const getEventStatus = (_event: CareEvent): 'scheduled' | 'completed' => {
    // 実際の実装では、APIからのデータに基づいてステータスを設定します
    // ここではデモのためにランダムに割り当てています
    // 固定のシード値を使用して決定論的な結果を生成
    const eventId = _event.time + _event.label;
    const hash = [...eventId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 2 === 0 ? 'completed' : 'scheduled';
  };

  const handleEventClick = useCallback((event: CareEvent, residentId: number, residentName: string) => {
    setSelectedEvent({
      event,
      residentId,
      residentName,
      status: getEventStatus(event)
    });
  }, []);

  const handleCellClick = useCallback((categoryKey: CareCategoryKey, residentId: number, residentName: string) => {
    // Create a new empty event
    const category = careCategories.find(c => c.key === categoryKey);
    const newEvent: CareEvent = {
      time: new Date().getHours().toString().padStart(2, '0') + ':00',
      icon: category?.icon || 'ClipboardList',
      label: '',
      categoryKey,
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

  // バイタル関連のカテゴリキー
  const vitalCategories: CareCategoryKey[] = ['temperature', 'pulse', 'bloodPressure'];

  // 通常のイベントを取得する関数
  const getNonVitalEventForCategory = (
    residentEvents: CareEvent[],
    categoryKey: CareCategoryKey
  ): CareEvent | undefined => {
    // バイタルカテゴリの場合はnullを返す
    if (vitalCategories.includes(categoryKey)) {
      return undefined;
    }
    return residentEvents.find((event) => event.categoryKey === categoryKey);
  };

  // バイタルイベントを取得する関数
  const getVitalEventsForResident = (residentEvents: CareEvent[]): CareEvent[] => {
    return residentEvents.filter(
      (event) => event.categoryKey && vitalCategories.includes(event.categoryKey)
    );
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `220px repeat(${careCategories.length}, minmax(120px, 1fr))`,
          }}
        >
          <div className="sticky top-0 left-0 bg-carebase-blue text-white p-3 border-b border-r border-gray-300 z-20 flex items-center justify-center h-16">
            <span className="text-base font-semibold">利用者名</span>
          </div>
          {careCategories.map((category) => (
            <div
              key={category.key}
              className="sticky top-0 bg-carebase-blue text-white p-3 border-b border-r border-gray-300 z-10 text-sm text-center flex flex-col items-center justify-center h-16"
              style={{ backgroundColor: rgbToString(CARE_CATEGORY_COLORS[category.key]) }}
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
                <ResidentInfoCell resident={resident} />
              </div>
              {careCategories.map((category) => {
                // バイタルカテゴリの特別処理
                if (category.key === 'temperature') {
                  const vitalEvents = getVitalEventsForResident(resident.events);
                  const hasVitalEvents = vitalEvents.length > 0;
                  const vitalStatus = hasVitalEvents ? getEventStatus(vitalEvents[0]) : 'scheduled';

                  return (
                    <div
                      key={`${resident.id}-vitals`}
                      className="p-2 border-b border-r border-gray-200 text-sm text-center hover:bg-gray-50 transition-colors cursor-pointer min-h-16"
                      style={{
                        backgroundColor: hasVitalEvents ? 'rgba(231, 76, 60, 0.05)' : 'transparent',
                      }}
                      onClick={() => {
                        if (!hasVitalEvents) {
                          handleCellClick('temperature', resident.id, resident.name);
                        }
                      }}
                    >
                      {hasVitalEvents ? (
                        <div onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(vitalEvents[0], resident.id, resident.name);
                        }}>
                          <VitalSigns events={vitalEvents} status={vitalStatus} />
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  );
                }
                // 血圧と脈拍のカテゴリはスキップ（バイタルにまとめるため）
                else if (category.key === 'pulse' || category.key === 'bloodPressure') {
                  return (
                    <div
                      key={`${resident.id}-${category.key}`}
                      className="p-2 border-b border-r border-gray-200 text-sm text-center hover:bg-gray-50 transition-colors cursor-pointer min-h-16"
                    >
                      <span className="text-gray-300">-</span>
                    </div>
                  );
                }
                // その他の通常カテゴリ
                else {
                  const event = getNonVitalEventForCategory(resident.events, category.key);
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
                        <div onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event, resident.id, resident.name);
                        }}>
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
                }
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