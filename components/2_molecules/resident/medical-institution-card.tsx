'use client';

import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { MedicalInstitutionModal } from '@/components/3_organisms/modals/medical-institution-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { MedicalInstitution } from '@/mocks/care-board-data';
import { residentDataService } from '@/services/residentDataService';
import type { MedicalInstitutionFormData } from '@/validations/resident-data-validation';
import { Edit3, MapPin, Phone, Printer, Unlink } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface MedicalInstitutionCardProps {
  institution: MedicalInstitution;
  residentId: number;
  residentName?: string;
  onInstitutionUpdate?: (updatedInstitution: MedicalInstitution) => void;
  onInstitutionDelete?: (institutionId: string) => void;
}

export const MedicalInstitutionCard: React.FC<MedicalInstitutionCardProps> = ({
  institution,
  residentId,
  residentName,
  onInstitutionUpdate,
  onInstitutionDelete,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleUnlinkClick = () => {
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (data: MedicalInstitutionFormData): Promise<boolean> => {
    try {
      const updatedInstitution = await residentDataService.updateMedicalInstitution(
        residentId,
        institution.id,
        data
      );
      onInstitutionUpdate?.(updatedInstitution);
      return true;
    } catch (error) {
      console.error('Failed to update medical institution:', error);
      return false;
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      // 利用者からの紐付けを解除（マスタからは削除しない）
      await residentDataService.dissociateMedicalInstitutionFromResident(
        residentId,
        institution.id
      );
      onInstitutionDelete?.(institution.id);
      return true;
    } catch (error) {
      console.error('Failed to dissociate medical institution:', error);
      setDeleteError(error instanceof Error ? error.message : '紐付け解除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-carebase-blue">
              {institution.institutionName}
            </h3>
            <div className="flex items-center gap-2">
              <strong className="text-sm text-gray-500">医師: {institution.doctorName}</strong>
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
              onClick={handleUnlinkClick}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              <Unlink className="h-3 w-3 mr-1" />
              紐付け解除
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{institution.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-gray-500" />
                <span>{institution.fax}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{institution.address}</span>
              </div>
            </div>

            {institution.notes && (
              <div className="md:col-span-2 pt-2 mt-2 border-t">
                <p className="mt-1 text-gray-700 whitespace-pre-line">{institution.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MedicalInstitutionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        institution={institution}
        residentName={residentName}
        mode="edit"
      />

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={institution.institutionName}
        itemType="医療機関の紐付け"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};
