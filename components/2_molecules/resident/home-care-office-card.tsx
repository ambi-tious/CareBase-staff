'use client';

import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { HomeCareOfficeModal } from '@/components/3_organisms/modals/home-care-office-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { HomeCareOffice } from '@/mocks/care-board-data';
import { residentDataService } from '@/services/residentDataService';
import type { HomeCareOfficeFormData } from '@/validations/resident-data-validation';
import { Edit3, MapPin, Phone, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface HomeCareOfficeCardProps {
  office: HomeCareOffice;
  residentId: number;
  residentName?: string;
  onOfficeUpdate?: (updatedOffice: HomeCareOffice) => void;
  onOfficeDelete?: (officeId: string) => void;
}

export const HomeCareOfficeCard: React.FC<HomeCareOfficeCardProps> = ({
  office,
  residentId,
  residentName,
  onOfficeUpdate,
  onOfficeDelete,
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

  const handleEditSubmit = async (data: HomeCareOfficeFormData): Promise<boolean> => {
    try {
      const updatedOffice = await residentDataService.updateHomeCareOffice(
        residentId,
        office.id,
        data
      );
      onOfficeUpdate?.(updatedOffice);
      return true;
    } catch (error) {
      console.error('Failed to update home care office:', error);
      return false;
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await residentDataService.deleteHomeCareOffice(residentId, office.id);
      onOfficeDelete?.(office.id);
      return true;
    } catch (error) {
      console.error('Failed to delete home care office:', error);
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
            <h3 className="text-lg font-semibold mb-1">事業所名</h3>
            <p className="text-xl font-bold text-carebase-blue">{office.businessName}</p>
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
              <strong>ケアマネージャー:</strong> {office.careManager}
            </p>
            <p>
              <Phone className="inline h-4 w-4 mr-1 text-gray-500" />
              <strong>電話番号:</strong> {office.phone}
            </p>
            <p>
              <strong>FAX:</strong> {office.fax}
            </p>
            <p className="md:col-span-2">
              <MapPin className="inline h-4 w-4 mr-1 text-gray-500" />
              <strong>住所:</strong> {office.address}
            </p>
            {office.notes && (
              <p className="md:col-span-2 pt-2 mt-2 border-t">
                <strong>備考:</strong> {office.notes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <HomeCareOfficeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        office={office}
        residentName={residentName}
        mode="edit"
      />

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={office.businessName}
        itemType="居宅介護支援事業所の紐付け"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};
