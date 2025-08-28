'use client';

import { AbsenceCard } from '@/components/2_molecules/absence/absence-card';
import { AbsenceFilters } from '@/components/2_molecules/absence/absence-filters';
import { AbsenceModal } from '@/components/3_organisms/modals/absence-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { absenceService } from '@/services/absenceService';
import type { Absence, AbsenceReason, AbsenceStatus } from '@/types/absence';
import type { AbsenceFormData } from '@/validations/absence-validation';
import { Calendar, CalendarPlus, MapPin } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AbsenceListProps {
  absences: Absence[];
  residentId: string;
  residentName: string;
  onAbsenceUpdate?: (updatedAbsence: Absence) => void;
  onAbsenceDelete?: (absenceId: string) => void;
  onAbsenceCreate?: (newAbsence: Absence) => void;
  className?: string;
}

export const AbsenceList: React.FC<AbsenceListProps> = ({
  absences,
  residentId,
  residentName,
  onAbsenceUpdate,
  onAbsenceDelete,
  onAbsenceCreate,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AbsenceStatus | undefined>();
  const [selectedReason, setSelectedReason] = useState<AbsenceReason | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);

  // Filter and search absences
  const filteredAbsences = useMemo(() => {
    return absences.filter((absence) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        absence.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        absence.customReason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        absence.createdByName.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = !selectedStatus || absence.status === selectedStatus;

      // Reason filter
      const matchesReason = !selectedReason || absence.reason === selectedReason;

      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [absences, searchQuery, selectedStatus, selectedReason]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus(undefined);
    setSelectedReason(undefined);
  };

  const handleCreateAbsence = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditAbsence = (absence: Absence) => {
    setEditingAbsence(absence);
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (data: AbsenceFormData): Promise<boolean> => {
    try {
      const newAbsence = await absenceService.createAbsence(residentId, data);
      onAbsenceCreate?.(newAbsence);
      setIsCreateModalOpen(false);

      // Show success toast
      toast.success('不在情報の登録が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to create absence:', error);
      return false;
    }
  };

  const handleEditSubmit = async (data: AbsenceFormData): Promise<boolean> => {
    if (!editingAbsence) return false;

    try {
      const updatedAbsence = await absenceService.updateAbsence(
        residentId,
        editingAbsence.id,
        data
      );
      onAbsenceUpdate?.(updatedAbsence);
      setIsEditModalOpen(false);
      setEditingAbsence(null);

      // Show success toast
      toast.success('不在情報の更新が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to update absence:', error);
      return false;
    }
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingAbsence(null);
  };

  // Statistics
  const totalCount = absences.length;
  const ongoingCount = absences.filter((a) => a.status === 'ongoing').length;
  const scheduledCount = absences.filter((a) => a.status === 'scheduled').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">
              {residentName}様の不在履歴
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>総件数: {totalCount}件</span>
            {ongoingCount > 0 && (
              <span className="text-yellow-600 font-medium">不在中: {ongoingCount}件</span>
            )}
            {scheduledCount > 0 && (
              <span className="text-blue-600 font-medium">予定: {scheduledCount}件</span>
            )}
            <span>表示中: {filteredAbsences.length}件</span>
          </div>
        </div>

        <Button 
          className="bg-carebase-blue hover:bg-carebase-blue-dark" 
          onClick={handleCreateAbsence}
        >
          <CalendarPlus className="h-4 w-4 mr-2" />
          新規不在登録
        </Button>
      </div>

      {/* Search and Filters */}
      <AbsenceFilters
        searchQuery={searchQuery}
        selectedStatus={selectedStatus}
        selectedReason={selectedReason}
        onSearchChange={setSearchQuery}
        onStatusChange={setSelectedStatus}
        onReasonChange={setSelectedReason}
        onReset={handleResetFilters}
      />

      {/* Absence List */}
      {filteredAbsences.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || selectedStatus || selectedReason
                ? '検索条件に一致する不在記録がありません'
                : '不在記録がありません'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedStatus || selectedReason
                ? '検索条件を変更するか、新しい不在記録を登録してください。'
                : '利用者様の外出や通院などの不在記録を管理できます。'}
            </p>
            <Button
              onClick={handleCreateAbsence}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              最初の不在記録を登録
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAbsences.map((absence) => (
            <AbsenceCard
              key={absence.id}
              absence={absence}
              residentId={residentId}
              residentName={residentName}
              onAbsenceUpdate={onAbsenceUpdate}
              onAbsenceDelete={onAbsenceDelete}
              onEdit={handleEditAbsence}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AbsenceModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleCreateSubmit}
        residentName={residentName}
        mode="create"
      />

      <AbsenceModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleEditSubmit}
        absence={editingAbsence || undefined}
        residentName={residentName}
        mode="edit"
      />
    </div>
  );
};