'use client';

import type React from 'react';
import { useState } from 'react';
import type { Medication } from '@/types/medication';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Edit3, Calendar, Building2, Trash2, Pill } from 'lucide-react';
import { MedicationModal } from '@/components/3_organisms/modals/medication-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { medicationService } from '@/services/medicationService';
import type { MedicationFormData } from '@/types/medication';

interface MedicationCardProps {
  medication: Medication;
  residentId: number;
  residentName?: string;
  onMedicationUpdate?: (updatedMedication: Medication) => void;
  onMedicationDelete?: (medicationId: string) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  residentId,
  residentName,
  onMedicationUpdate,
  onMedicationDelete,
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

  const isOngoing = !medication.endDate || new Date(medication.endDate) >= new Date();

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">薬剤名</h3>
              <p className="text-xl font-bold text-carebase-blue">{medication.medicationName}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isOngoing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isOngoing ? '服用中' : '服用終了'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleEditClick}>
              <Edit3 className="h-3 w-3 mr-1" />
              編集
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              削除
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-2">
              <div>
                <strong>用法・用量:</strong>
                <p className="mt-1 text-gray-700 whitespace-pre-line">{medication.dosageInstructions}</p>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="inline h-4 w-4 mr-1 text-gray-500" />
                <strong>処方医療機関:</strong> {medication.prescribingInstitution}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Calendar className="inline h-4 w-4 mr-1 text-gray-500" />
                <strong>服用開始日:</strong> {formatDate(medication.startDate)}
              </div>
              {medication.endDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="inline h-4 w-4 mr-1 text-gray-500" />
                  <strong>服用終了日:</strong> {formatDate(medication.endDate)}
                </div>
              )}
            </div>
            {medication.notes && (
              <div className="md:col-span-2 pt-2 mt-2 border-t">
                <strong>メモ:</strong>
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