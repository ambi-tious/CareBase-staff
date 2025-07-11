'use client';

import type React from 'react';
import { useState } from 'react';
import type { MedicationStatus } from '@/types/medication-status';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Edit3, Calendar, FileText, Trash2 } from 'lucide-react';
import { MedicationStatusModal } from '@/components/3_organisms/modals/medication-status-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { medicationStatusService } from '@/services/medicationStatusService';
import type { MedicationStatusFormData } from '@/types/medication-status';

interface MedicationStatusCardProps {
  medicationStatus: MedicationStatus;
  residentId: number;
  residentName?: string;
  onStatusUpdate?: (updatedStatus: MedicationStatus) => void;
  onStatusDelete?: (statusId: string) => void;
}

export const MedicationStatusCard: React.FC<MedicationStatusCardProps> = ({
  medicationStatus,
  residentId,
  residentName,
  onStatusUpdate,
  onStatusDelete,
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

  const handleEditSubmit = async (data: MedicationStatusFormData): Promise<boolean> => {
    try {
      const updatedStatus = await medicationStatusService.updateMedicationStatus(
        residentId,
        medicationStatus.id,
        data
      );
      onStatusUpdate?.(updatedStatus);
      return true;
    } catch (error) {
      console.error('Failed to update medication status:', error);
      return false;
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await medicationStatusService.deleteMedicationStatus(residentId, medicationStatus.id);
      onStatusDelete?.(medicationStatus.id);
      return true;
    } catch (error) {
      console.error('Failed to delete medication status:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">服薬状況記録</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(medicationStatus.date)}</span>
              </div>
            </div>
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
          <div className="space-y-3">
            <div>
              <strong>内容:</strong>
              <p className="mt-1 text-gray-700 whitespace-pre-line">{medicationStatus.content}</p>
            </div>
            {medicationStatus.notes && (
              <div className="pt-2 border-t">
                <strong>メモ:</strong>
                <p className="mt-1 text-gray-700 whitespace-pre-line">{medicationStatus.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MedicationStatusModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        medicationStatus={medicationStatus}
        residentName={residentName}
        mode="edit"
      />

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={`${formatDate(medicationStatus.date)}の服薬状況記録`}
        itemType="服薬状況情報"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};