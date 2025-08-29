'use client';

import { ResidentCard } from '@/components/2_molecules/resident/resident-card';
import {
  ResidentsToolbar,
  type SortOption,
} from '@/components/2_molecules/resident/residents-toolbar';
import { careBoardData } from '@/mocks/care-board-data';
import { getResidentStatus, type ResidentStatus } from '@/utils/resident-status-helpers';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

interface SelectedStaffData {
  staff: {
    id: string;
    name: string;
  };
  groupName: string;
  teamName: string;
}

export const ResidentsList: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ResidentStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [selectedStaffData, setSelectedStaffData] = useState<SelectedStaffData | null>(null);

  // Load selected staff data from localStorage
  useEffect(() => {
    const loadSelectedStaffData = () => {
      try {
        const data = localStorage.getItem('carebase_selected_staff_data');
        if (data) {
          setSelectedStaffData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Failed to load selected staff data:', error);
      }
    };

    loadSelectedStaffData();

    // Listen for storage changes (when staff selection changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'carebase_selected_staff_data') {
        loadSelectedStaffData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filter and sort residents
  const filteredAndSortedResidents = useMemo(() => {
    // First, filter residents
    const filtered = careBoardData.filter((resident) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === '' ||
        resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.furigana.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const currentStatus = resident.status || getResidentStatus(resident);
      const matchesStatusFilter =
        statusFilter === 'all'
          ? currentStatus !== '退所' // 「全て」の場合は退所済以外を表示
          : (statusFilter === null && currentStatus === null) || currentStatus === statusFilter;

      // Filter by group and team if selected staff data exists
      const matchesGroupTeam =
        !selectedStaffData ||
        (resident.floorGroup === selectedStaffData.groupName &&
          resident.unitTeam === selectedStaffData.teamName);

      return matchesSearch && matchesStatusFilter && matchesGroupTeam;
    });

    // Then, sort residents
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          // Sort by furigana (reading) for proper Japanese sorting
          return a.furigana.localeCompare(b.furigana, 'ja');
        case 'room': {
          // Sort by room info, handling undefined values
          const roomA = a.roomInfo || '';
          const roomB = b.roomInfo || '';
          return roomA.localeCompare(roomB, 'ja', { numeric: true });
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, statusFilter, sortBy, selectedStaffData]);

  const handleCreateResident = () => {
    router.push('/residents/new');
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Toolbar */}
      <ResidentsToolbar
        onSearch={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onCreateResident={handleCreateResident}
        className="mb-6"
      />

      {/* Results */}
      {filteredAndSortedResidents.length === 0 ? (
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
          {filteredAndSortedResidents.map((resident) => (
            <ResidentCard key={resident.id} resident={resident} />
          ))}
        </div>
      )}
    </div>
  );
};
