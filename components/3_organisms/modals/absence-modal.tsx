'use client';

import { AbsenceForm } from '@/components/2_molecules/absence/absence-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Absence } from '@/types/absence';
import type { AbsenceFormData } from '@/validations/absence-validation';
import { Calendar } from 'lucide-react';
import type React from 'react';

interface AbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AbsenceFormData) => Promise<boolean>;
  absence?: Absence;
  residentName?: string;
  mode: 'create' | 'edit';
}

export const AbsenceModal: React.FC<AbsenceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  absence,
  residentName,
  mode,
}) => {
  const initialData = absence
    ? {
        startDateTime: absence.startDateTime.slice(0, 16), // Remove seconds for datetime-local
        endDateTime: absence.endDateTime.slice(0, 16),
        reason: absence.reason,
        customReason: absence.customReason || '',
        notes: absence.notes || '',
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto tablet:max-w-[95vw] tablet:max-h-[95vh]"
        data-testid="absence-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary tablet:text-tablet-xl flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {mode === 'create' ? '不在情報の登録' : '不在情報の編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 tablet:text-tablet-base tablet:mt-3">
            {residentName && `${residentName}様の`}不在情報を
            {mode === 'create' ? '登録' : '編集'}してください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <div className="tablet:mt-6">
          <AbsenceForm 
            onSubmit={onSubmit} 
            onCancel={onClose} 
            initialData={initialData}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};