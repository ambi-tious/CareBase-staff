'use client';

import {
  ActionDropdownMenu,
  type ActionDropdownConfig,
} from '@/components/1_atoms/buttons/action-dropdown-menu';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { MedicationModal } from '@/components/3_organisms/modals/medication-modal';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { MedicalInstitution } from '@/mocks/residents-data';
import { medicationService } from '@/services/medicationService';
import type { Medication } from '@/types/medication';
import type { MedicationFormData } from '@/validations/medication-validation';
import { Building2, Calendar, Copy, Edit3, Pill, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';

interface MedicationCardProps {
  medication: Medication;
  residentId: number;
  residentName?: string;
  medicalInstitutions: MedicalInstitution[];
  onMedicationUpdate?: (updatedMedication: Medication) => void;
  onMedicationDelete?: (medicationId: string) => void;
  onMedicationDuplicate?: (medication: Medication) => void;
  isFiltered?: boolean;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  residentId,
  residentName,
  medicalInstitutions,
  onMedicationUpdate,
  onMedicationDelete,
  onMedicationDuplicate,
  isFiltered = false,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDuplicateClick = () => {
    onMedicationDuplicate?.(medication);
  };

  const handleEditSubmit = async (data: MedicationFormData): Promise<boolean> => {
    try {
      const updatedMedication = await medicationService.updateMedication(
        residentId,
        medication.id,
        data
      );
      onMedicationUpdate?.(updatedMedication);
      return true;
    } catch (error) {
      console.error('Failed to update medication:', error);
      return false;
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await medicationService.deleteMedication(residentId, medication.id);
      onMedicationDelete?.(medication.id);
      return true;
    } catch (error) {
      console.error('Failed to delete medication:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  // 服用終了日が入力されていても、期間内であれば「服用中」
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = medication.endDate ? new Date(medication.endDate) : null;
  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }
  const isOngoing = !endDate || endDate >= today;

  const actionButtons: ActionDropdownConfig[] = [
    {
      id: 'edit',
      label: '編集',
      icon: Edit3,
      onClick: handleEditClick,
    },
    {
      id: 'duplicate',
      label: '複製',
      icon: Copy,
      onClick: handleDuplicateClick,
    },
    {
      id: 'delete',
      label: '削除',
      icon: Trash2,
      onClick: handleDeleteClick,
      variant: 'destructive',
    },
  ];

  return (
    <>
      <Card
        className={`${!isOngoing && !isFiltered ? 'opacity-50' : ''} transition-opacity duration-200`}
      >
        <CardHeader className="flex flex-row items-start justify-between pb-3 space-y-0">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {medication.thumbnailUrl ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-200">
                  <Image
                    src={medication.thumbnailUrl}
                    alt="薬剤サムネイル"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Pill className="h-6 w-6 text-blue-600" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  isOngoing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isOngoing ? '服用中' : '服用終了'}
              </span>
              <p className="text-xl font-bold text-carebase-blue">{medication.medicationName}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Building2 className="inline h-4 w-4 mr-1 text-gray-500" />
                {medication.prescribingInstitution}
              </div>
            </div>
          </div>
          <ActionDropdownMenu actions={actionButtons} />
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex items-center gap-1">
              <strong>用法・用量:</strong>
              {medication.dosageInstructions}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="inline h-4 w-4 mr-1 text-gray-500" />
              {medication.startDate && formatDate(medication.startDate)}
              {medication.endDate && ` - ${formatDate(medication.endDate)}`}
            </div>
            {medication.notes && (
              <div className="md:col-span-2 pt-2 mt-2 border-t">
                <p className="mt-1 text-gray-700 whitespace-pre-line">{medication.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MedicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        medication={medication}
        residentName={residentName}
        medicalInstitutions={medicalInstitutions}
        mode="edit"
      />

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={medication.medicationName}
        itemType="お薬情報"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};
