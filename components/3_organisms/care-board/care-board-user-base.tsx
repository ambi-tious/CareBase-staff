import React from 'react';
import { CareEvent, careBoardData, careCategories, CareCategoryKey } from '@/mocks/care-board-data';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { CARE_CATEGORY_COLORS, rgbToString } from './care-board-utils';
import Link from 'next/link';
import Image from 'next/image';
import { CareEventStatus } from './care-board-utils';
import { ResidentInfoCell } from './care-board-utils';

type CareEventStatusType = 'scheduled' | 'completed' | 'in-progress' | 'missed';

export function UserBaseView() {
  const getEventForCategory = (
    residentEvents: CareEvent[],
    categoryKey: CareCategoryKey
  ): CareEvent | undefined => {
    return residentEvents.find((event) => event.categoryKey === categoryKey);
  };

  return (
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
              const event = getEventForCategory(resident.events, category.key);
              const bgColor = category.key ? CARE_CATEGORY_COLORS[category.key] + '10' : '#f0f0f0';
              return (
                <div
                  key={`${resident.id}-${category.key}`}
                  className="p-2 border-b border-r border-gray-200 text-sm text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ backgroundColor: event ? bgColor : 'transparent' }}
                >
                  {event ? (
                    <CareEventStatus event={event} category={category.key} status={'scheduled'} />
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
