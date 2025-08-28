'use client';

import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { HomeCareOfficeModal } from '@/components/3_organisms/modals/home-care-office-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { HomeCareOffice } from '@/mocks/care-board-data';
import { residentDataService } from '@/services/residentDataService';
import type { HomeCareOfficeFormData } from '@/validations/resident-data-validation';
import { Edit3, MapPin, Phone, Printer, Unlink, User } from 'lucide-react';
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

  const handleUnlinkClick = () => {
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
      // 利用者からの紐付けを解除（マスタからは削除しない）
      await residentDataService.dissociateHomeCareOfficeFromResident(residentId, office.id);
      onOfficeDelete?.(office.id);
      return true;
    } catch (error) {
      console.error('Failed to dissociate home care office:', error);
      setDeleteError(error instanceof Error ? error.message : '紐付け解除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{office.businessName}</h3>
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
                <span>{office.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-gray-500" />
                <span>{office.fax}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                {office.careManager}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{office.address}</span>
              </div>
            </div>

            {office.notes && (
              <div className="md:col-span-2 pt-2 mt-2 border-t">
                <p className="mt-1 text-gray-700 whitespace-pre-line">{office.notes}</p>
              </div>
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
