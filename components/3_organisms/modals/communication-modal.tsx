'use client';

import { CommunicationForm } from '@/components/2_molecules/communication/communication-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ContactPerson } from '@/mocks/care-board-data';
import type { CommunicationRecord } from '@/types/communication';
import type { CommunicationFormData } from '@/validations/communication-validation';
import { MessageCircle } from 'lucide-react';
import type React from 'react';

interface CommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CommunicationFormData) => Promise<boolean>;
  record?: CommunicationRecord;
  residentName?: string;
  contacts: ContactPerson[];
  mode: 'create' | 'edit' | 'reply';
  threadId?: string;
  parentId?: string;
}

export const CommunicationModal: React.FC<CommunicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  record,
  residentName,
  contacts,
  mode,
  threadId,
  parentId,
}) => {
  const initialData = record
    ? {
        datetime: record.datetime.slice(0, 16), // Remove seconds for datetime-local
        staffId: record.staffId,
        contactPersonId: record.contactPersonId || '',
        contactPersonName: record.contactPersonName,
        contactPersonType: record.contactPersonType,
        communicationContent: mode === 'reply' ? '' : record.communicationContent,
        responseContent: mode === 'reply' ? '' : record.responseContent,
        isImportant: record.isImportant,
        threadId: threadId || record.threadId || '',
        parentId: mode === 'reply' ? record.id : parentId || record.parentId || '',
      }
    : {
        threadId: threadId || '',
        parentId: parentId || '',
      };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'コミュニケーション記録の登録';
      case 'edit':
        return 'コミュニケーション記録の編集';
      case 'reply':
        return 'コミュニケーション記録への返信';
      default:
        return 'コミュニケーション記録';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'create':
        return 'ご家族や関係者とのコミュニケーション記録を登録してください。';
      case 'edit':
        return 'コミュニケーション記録の内容を編集してください。';
      case 'reply':
        return '既存のコミュニケーション記録に返信を追加してください。';
      default:
        return 'コミュニケーション記録を管理してください。';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto tablet:max-w-[95vw] tablet:max-h-[95vh]"
        data-testid="communication-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary tablet:text-tablet-xl flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-gray-600 tablet:text-tablet-base tablet:mt-3">
            {residentName && `${residentName}様の`}
            {getDescription()} 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <div className="tablet:mt-6">
          <CommunicationForm
            onSubmit={onSubmit}
            onCancel={onClose}
            initialData={initialData}
            mode={mode}
            contacts={contacts}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
