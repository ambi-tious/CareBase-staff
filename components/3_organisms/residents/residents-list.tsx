'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ResidentsToolbar } from '@/components/2_molecules/residents/residents-toolbar';
import { ResidentCard } from '@/components/2_molecules/residents/resident-card';
import { careBoardData } from '@/mocks/care-board-data';
import { Users } from 'lucide-react';

export const ResidentsList: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDischargedResidents, setShowDischargedResidents] = useState(false);

  // Filter residents based on search query and discharge status
  const filteredResidents = useMemo(() => {
    return careBoardData.filter((resident) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === '' ||
        resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.furigana.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by discharge status
      const matchesStatus = showDischargedResidents || resident.admissionStatus !== '退所済';

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, showDischargedResidents]);

  const handleCreateResident = () => {
    router.push('/residents/new');
  };

  const activeResidentsCount = careBoardData.filter((r) => r.admissionStatus === '入居中').length;
  const dischargedResidentsCount = careBoardData.filter(
    (r) => r.admissionStatus === '退所済'
  ).length;

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-6 w-6 text-carebase-blue" />
          <h1 className="text-2xl font-bold text-carebase-text-primary">利用者一覧</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>入居中: {activeResidentsCount}名</span>
          <span>退所済: {dischargedResidentsCount}名</span>
          <span>表示中: {filteredResidents.length}名</span>
        </div>
      </div>

      {/* Toolbar */}
      <ResidentsToolbar
        onSearch={setSearchQuery}
        showDischargedResidents={showDischargedResidents}
        onToggleDischargedResidents={setShowDischargedResidents}
        onCreateResident={handleCreateResident}
        className="mb-6"
      />

      {/* Results */}
      {filteredResidents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">利用者が見つかりません</h3>
          <p className="text-gray-500">
            {searchQuery
              ? '検索条件に一致する利用者がいません。検索キーワードを変更してお試しください。'
              : '利用者が登録されていません。新規利用者を登録してください。'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredResidents.map((resident) => (
            <ResidentCard key={resident.id} resident={resident} />
          ))}
        </div>
      )}
    </div>
  );
};
