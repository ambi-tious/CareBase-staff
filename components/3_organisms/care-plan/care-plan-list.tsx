'use client';

import { CarePlanCard } from '@/components/2_molecules/care-plan/care-plan-card';
import { CarePlanFilters } from '@/components/2_molecules/care-plan/care-plan-filters';
import { CarePlanSearchBar } from '@/components/2_molecules/care-plan/care-plan-search-bar';
import { Button } from '@/components/ui/button';
import type { CarePlan, CarePlanStatus } from '@/types/care-plan';
import { FileText, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useMemo, useState } from 'react';

interface CarePlanListProps {
  carePlans: CarePlan[];
  residentId: string;
  residentName: string;
  className?: string;
}

export const CarePlanList: React.FC<CarePlanListProps> = ({
  carePlans,
  residentId,
  residentName,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CarePlanStatus | undefined>();
  const [selectedCareLevel, setSelectedCareLevel] = useState<string | undefined>();

  // Filter and search care plans
  const filteredCarePlans = useMemo(() => {
    return carePlans.filter((plan) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        plan.planTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.careManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.careManagerOffice.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = !selectedStatus || plan.status === selectedStatus;

      // Care level filter
      const matchesCareLevel = !selectedCareLevel || plan.careLevel === selectedCareLevel;

      return matchesSearch && matchesStatus && matchesCareLevel;
    });
  }, [carePlans, searchQuery, selectedStatus, selectedCareLevel]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus(undefined);
    setSelectedCareLevel(undefined);
  };

  const activeCarePlans = carePlans.filter((plan) => plan.status === 'active');
  const totalCount = carePlans.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">
              {residentName}様のケアプラン
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>総件数: {totalCount}件</span>
            <span className="text-green-600 font-medium">有効: {activeCarePlans.length}件</span>
            <span>表示中: {filteredCarePlans.length}件</span>
          </div>
        </div>

        <Button className="bg-carebase-blue hover:bg-carebase-blue-dark" asChild>
          <Link href={`/residents/${residentId}/care-plans/new`}>
            <PlusCircle className="h-4 w-4 mr-2" />
            新規ケアプラン作成
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <CarePlanSearchBar onSearch={setSearchQuery} className="flex-1 max-w-md" />
        <CarePlanFilters
          selectedStatus={selectedStatus}
          selectedCareLevel={selectedCareLevel}
          onStatusChange={setSelectedStatus}
          onCareLevelChange={setSelectedCareLevel}
          onReset={handleResetFilters}
        />
      </div>

      {/* Care Plan List */}
      {filteredCarePlans.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ケアプランが見つかりません</h3>
          <p className="text-gray-500">
            {searchQuery || selectedStatus || selectedCareLevel
              ? '検索条件に一致するケアプランがありません。条件を変更してお試しください。'
              : 'ケアプランが登録されていません。新規ケアプランを作成してください。'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCarePlans.map((carePlan) => (
            <CarePlanCard key={carePlan.id} carePlan={carePlan} />
          ))}
        </div>
      )}
    </div>
  );
};