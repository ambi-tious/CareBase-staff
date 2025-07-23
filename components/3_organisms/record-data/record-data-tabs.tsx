'use client';

import { DateFilter } from '@/components/2_molecules/record-data/date-filter';
import { RecordTypeFilter } from '@/components/2_molecules/record-data/record-type-filter';
import { SearchFilter } from '@/components/2_molecules/record-data/search-filter';
import { DailyRecordView } from '@/components/3_organisms/record-data/daily-record-view';
import { MonthlyRecordView } from '@/components/3_organisms/record-data/monthly-record-view';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getResidentRecordData, getResidentMonthlyData } from '@/mocks/record-data';
import type { RecordType, ViewMode } from '@/types/record-data';
import { format } from 'date-fns';
import { RotateCcw } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface RecordDataTabsProps {
  residentId: string;
}

export const RecordDataTabs: React.FC<RecordDataTabsProps> = ({ residentId }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState<RecordType[]>(['care', 'nursing', 'handover']);
  const [searchQuery, setSearchQuery] = useState('');

  // Get data based on current selection
  const currentRecords = useMemo(() => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    return getResidentRecordData(residentId, dateString);
  }, [residentId, selectedDate]);

  const currentMonthlyData = useMemo(() => {
    const monthString = format(selectedDate, 'yyyy-MM');
    return getResidentMonthlyData(residentId, monthString);
  }, [residentId, selectedDate]);

  // Handle filter reset
  const handleResetFilters = () => {
    setSelectedDate(new Date());
    setSelectedTypes(['care', 'nursing', 'handover']);
    setSearchQuery('');
  };

  // Check if filters are applied
  const hasActiveFilters = useMemo(() => {
    const today = new Date();
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    const allTypesSelected = selectedTypes.length === 3;
    const noSearchQuery = searchQuery.trim() === '';
    
    return !isToday || !allTypesSelected || !noSearchQuery;
  }, [selectedDate, selectedTypes, searchQuery]);

  // Mock handlers for actions
  const handleAddRecord = () => {
    console.log('Add record clicked');
    // In a real app, this would open a modal or navigate to a form
  };

  const handleEditRecord = (record: any) => {
    console.log('Edit record:', record.id);
    // In a real app, this would open an edit modal
  };

  const handleDeleteRecord = (recordId: string) => {
    console.log('Delete record:', recordId);
    // In a real app, this would show a confirmation dialog
  };

  const handleExport = () => {
    console.log('Export data for:', viewMode);
    // In a real app, this would trigger a download
  };

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="bg-gray-200 p-1.5 rounded-xl w-fit">
            <TabsTrigger
              value="daily"
              className="data-[state=active]:bg-carebase-blue data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 px-6 py-2.5 text-sm font-medium rounded-lg"
            >
              日次表示
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-carebase-blue data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 px-6 py-2.5 text-sm font-medium rounded-lg"
            >
              月次表示
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <DateFilter
                date={selectedDate}
                onDateChange={setSelectedDate}
                viewMode={viewMode}
              />
              
              {viewMode === 'daily' && (
                <>
                  <RecordTypeFilter
                    selectedTypes={selectedTypes}
                    onTypesChange={setSelectedTypes}
                  />
                  
                  <SearchFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </>
              )}
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 self-start sm:self-auto"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                リセット
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <TabsContent value="daily" className="mt-6">
          <DailyRecordView
            records={currentRecords}
            searchQuery={searchQuery}
            selectedTypes={selectedTypes}
            onAddRecord={handleAddRecord}
            onEditRecord={handleEditRecord}
            onDeleteRecord={handleDeleteRecord}
            onExport={handleExport}
          />
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <MonthlyRecordView
            monthlyData={currentMonthlyData}
            onExport={handleExport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};