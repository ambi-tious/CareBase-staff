'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Resident } from '@/mocks/care-board-data';
import { addDays, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';
import { RecordDataDailyView } from './record-data-daily-view';
import { RecordDataMonthlyView } from './record-data-monthly-view';
// import { careRecordData } from '@/mocks/care-record-data'; // File not found - using empty array
const careRecordData: any[] = [];
// import { handoverData } from '@/mocks/handover-data'; // File not found - using empty array
const handoverData: any[] = [];

interface RecordDataViewProps {
  resident: Resident;
}

export const RecordDataView: React.FC<RecordDataViewProps> = ({ resident }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const residentCareRecords = careRecordData.filter(
    (record) => record.residentId === resident.id.toString()
  );

  const residentHandovers = handoverData.filter(
    (handover) => handover.residentId === resident.id.toString()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link href={`/residents/${resident.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-carebase-blue" />
          <h1 className="text-2xl font-bold text-carebase-text-primary">
            {resident.name}様の記録データ
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'daily' | 'monthly')}
        >
          <TabsList className="bg-gray-200 p-1.5 rounded-xl">
            <TabsTrigger
              value="daily"
              className="data-[state=active]:bg-carebase-blue data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 px-6 py-2.5 text-sm font-medium rounded-lg"
            >
              <Clock className="h-4 w-4 mr-2" />
              日次表示
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-carebase-blue data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 px-6 py-2.5 text-sm font-medium rounded-lg"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              月次表示
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
            onClick={() =>
              selectedDate &&
              setSelectedDate(addDays(selectedDate, activeTab === 'daily' ? -1 : -30))
            }
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {activeTab === 'daily' ? '前日' : '前月'}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className="w-[160px] justify-start text-left font-medium text-carebase-text-primary text-base bg-white border-carebase-blue hover:bg-carebase-blue-light px-3 py-2 shadow-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-carebase-blue" />
                {selectedDate
                  ? format(selectedDate, activeTab === 'daily' ? 'M月d日 (E)' : 'yyyy年M月', {
                      locale: ja,
                    })
                  : '読み込み中...'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
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
            onClick={() =>
              selectedDate && setSelectedDate(addDays(selectedDate, activeTab === 'daily' ? 1 : 30))
            }
          >
            {activeTab === 'daily' ? '翌日' : '翌月'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="daily">
          <RecordDataDailyView
            resident={resident}
            selectedDate={selectedDate}
            careRecords={residentCareRecords}
            handovers={residentHandovers}
          />
        </TabsContent>
        <TabsContent value="monthly">
          <RecordDataMonthlyView
            resident={resident}
            selectedDate={selectedDate}
            careRecords={residentCareRecords}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
