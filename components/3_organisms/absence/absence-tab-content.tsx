'use client';

import { AbsenceList } from '@/components/3_organisms/absence/absence-list';
import { getAbsencesByResident } from '@/mocks/absence-data';
import { absenceService } from '@/services/absenceService';
import type { Absence } from '@/types/absence';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface AbsenceTabContentProps {
  residentId: number;
  residentName: string;
  className?: string;
}

export interface AbsenceTabContentRef {
  openCreateModal: () => void;
}

export const AbsenceTabContent = forwardRef<AbsenceTabContentRef, AbsenceTabContentProps>(
  ({ residentId, residentName, className = '' }, ref) => {
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const absenceListRef = useRef<{ openCreateModal: () => void }>(null);

    // Load absence data
    useEffect(() => {
      const loadAbsences = async () => {
        try {
          setIsLoading(true);
          const residentAbsences = await absenceService.getResidentAbsences(residentId.toString());
          setAbsences(residentAbsences);
        } catch (error) {
          console.error('Failed to load absences:', error);
          // Fallback to mock data
          const mockAbsences = getAbsencesByResident(residentId.toString());
          setAbsences(mockAbsences);
        } finally {
          setIsLoading(false);
        }
      };

      loadAbsences();
    }, [residentId]);

    // Expose methods to parent component via ref
    useImperativeHandle(
      ref,
      () => ({
        openCreateModal: () => {
          absenceListRef.current?.openCreateModal();
        },
      }),
      []
    );

    const handleAbsenceCreate = (newAbsence: Absence) => {
      setAbsences((prev) => [newAbsence, ...prev]);
    };

    const handleAbsenceUpdate = (updatedAbsence: Absence) => {
      setAbsences((prev) =>
        prev.map((absence) => (absence.id === updatedAbsence.id ? updatedAbsence : absence))
      );
    };

    const handleAbsenceDelete = (absenceId: string) => {
      setAbsences((prev) => prev.filter((absence) => absence.id !== absenceId));
    };

    if (isLoading) {
      return (
        <div className={`flex justify-center items-center h-64 ${className}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carebase-blue mx-auto mb-4"></div>
            <p className="text-gray-500">不在情報を読み込み中...</p>
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        <AbsenceList
          ref={absenceListRef}
          absences={absences}
          residentId={residentId.toString()}
          residentName={residentName}
          onAbsenceCreate={handleAbsenceCreate}
          onAbsenceUpdate={handleAbsenceUpdate}
          onAbsenceDelete={handleAbsenceDelete}
        />
      </div>
    );
  }
);

AbsenceTabContent.displayName = 'AbsenceTabContent';
