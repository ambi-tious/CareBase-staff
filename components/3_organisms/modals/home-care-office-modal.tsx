'use client';

import { HomeCareOfficeForm } from '@/components/2_molecules/forms/home-care-office-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { HomeCareOffice } from '@/mocks/care-board-data';
import type { HomeCareOfficeFormData } from '@/validations/resident-data-validation';
import type React from 'react';

interface HomeCareOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HomeCareOfficeFormData) => Promise<boolean>;
  office?: HomeCareOffice;
  residentName?: string;
  mode: 'create' | 'edit';
}

export const HomeCareOfficeModal: React.FC<HomeCareOfficeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  office,
  residentName,
  mode,
}) => {
  const initialData = office
    ? {
        businessName: office.businessName,
        careManager: office.careManager,
        phone: office.phone,
        fax: office.fax || '',
        address: office.address,
        notes: office.notes || '',
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            {mode === 'create' ? '居宅介護支援事業所の登録' : '居宅介護支援事業所の編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName && `${residentName}様の`}居宅介護支援事業所情報を
            {mode === 'create' ? '登録' : '編集'}してください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <HomeCareOfficeForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};
