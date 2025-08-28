'use client';

import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { MedicalHistoryModal } from '@/components/3_organisms/modals/medical-history-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { MedicalHistory } from '@/mocks/care-board-data';
import { residentDataService } from '@/services/residentDataService';
import type { MedicalHistoryFormData } from '@/validations/resident-data-validation';
import { Building2, Calendar, Edit3, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface MedicalHistoryCardProps {
  history: MedicalHistory;
  residentId: number;
  residentName?: string;
  onHistoryUpdate?: (updatedHistory: MedicalHistory) => void;
  onHistoryDelete?: (historyId: string) => void;
}

export const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({
  history,
  residentId,
  residentName,
  onHistoryUpdate,
  onHistoryDelete,
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

  const handleEditSubmit = async (data: MedicalHistoryFormData): Promise<boolean> => {
    try {
      const updatedHistory = await residentDataService.updateMedicalHistory(
        residentId,
        history.id,
        data
      );
      onHistoryUpdate?.(updatedHistory);
      return true;
    } catch (error) {
      console.error('Failed to update medical history:', error);
      return false;
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await residentDataService.deleteMedicalHistory(residentId, history.id);
      onHistoryDelete?.(history.id);
      return true;
    } catch (error) {
      console.error('Failed to delete medical history:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case '治療中':
        return 'bg-blue-100 text-blue-700';
      case '完治':
        return 'bg-green-100 text-green-700';
      case '経過観察':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-semibold mb-1">病名</h3>
              <p className="text-xl font-bold text-carebase-blue">{history.diseaseName}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(history.treatmentStatus)}`}
            >
              {history.treatmentStatus}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
            <p>
              <Calendar className="inline h-4 w-4 mr-1 text-gray-500" />
              <strong>発症年月:</strong> {history.date}
            </p>
            {history.treatmentInstitution && (
              <p>
                <Building2 className="inline h-4 w-4 mr-1 text-gray-500" />
                <strong>治療機関:</strong> {history.treatmentInstitution}
              </p>
            )}
            {history.notes && (
              <p className="md:col-span-2 pt-2 mt-2 border-t">
                <strong>備考:</strong> {history.notes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <MedicalHistoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        history={history}
        residentName={residentName}
        mode="edit"
      />

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={history.diseaseName}
        itemType="既往歴情報"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};
