'use client';

import { ResidentCard } from '@/components/2_molecules/resident/resident-card';
import { ResidentsToolbar } from '@/components/2_molecules/resident/residents-toolbar';
import { careBoardData } from '@/mocks/care-board-data';
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
  const [showDischargedResidents, setShowDischargedResidents] = useState(false);
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

  // Filter residents based on search query, discharge status, and group/team
  const filteredResidents = useMemo(() => {
    return careBoardData.filter((resident) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === '' ||
        resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.furigana.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by discharge status
      const matchesStatus = showDischargedResidents || resident.admissionStatus !== '退所済';

      // Filter by group and team if selected staff data exists
      const matchesGroupTeam =
        !selectedStaffData ||
        (resident.floorGroup === selectedStaffData.groupName &&
          resident.unitTeam === selectedStaffData.teamName);

      return matchesSearch && matchesStatus && matchesGroupTeam;
    });
  }, [searchQuery, showDischargedResidents, selectedStaffData]);

  const handleCreateResident = () => {
    router.push('/residents/new');
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
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
