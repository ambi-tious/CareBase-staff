import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { MedicalInstitutionModal } from '@/components/3_organisms/modals/medical-institution-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { MedicalInstitution } from '@/mocks/care-board-data';
import { residentDataService } from '@/services/residentDataService';
import type { MedicalInstitutionFormData } from '@/validations/resident-data-validation';
import { Edit3, MapPin, Phone, Trash2 } from 'lucide-react';
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

  const handleDeleteClick = () => {
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
      await residentDataService.deleteMedicalInstitution(residentId, institution.id);
      onInstitutionDelete?.(institution.id);
      return true;
    } catch (error) {
      console.error('Failed to delete medical institution:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <h3 className="text-lg font-semibold mb-1">病院名</h3>
            <p className="text-xl font-bold text-carebase-blue">{institution.institutionName}</p>
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
              <strong>医師名:</strong> {institution.doctorName}
            </p>
            <p>
              <Phone className="inline h-4 w-4 mr-1 text-gray-500" />
              <strong>電話番号:</strong> {institution.phone}
            </p>
            <p>
              <strong>FAX:</strong> {institution.fax}
            </p>
            <p className="md:col-span-2">
              <MapPin className="inline h-4 w-4 mr-1 text-gray-500" />
              <strong>住所:</strong> {institution.address}
            </p>
            {institution.notes && (
              <p className="md:col-span-2 pt-2 mt-2 border-t">
                <strong>備考:</strong> {institution.notes}
              </p>
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
        itemType="医療機関情報"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};
