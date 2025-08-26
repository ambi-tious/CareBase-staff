'use client';

import { ContactForm } from '@/components/2_molecules/forms/contact-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ContactPerson } from '@/mocks/care-board-data';
import type { ContactFormData } from '@/validations/contact-validation';
import type React from 'react';

interface ContactEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<boolean>;
  contact: ContactPerson;
  residentName?: string;
}

export const ContactEditModal: React.FC<ContactEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contact,
  residentName,
}) => {
  // Convert ContactPerson to ContactFormData format
  const initialData: Partial<ContactFormData> = {
    name: contact.name,
    furigana: contact.furigana || '',
    relationship: contact.relationship,
    phone1: contact.phone1,
    phone2: contact.phone2 || '',
    email: contact.email || '',
    address: contact.address,
    notes: contact.notes || '',
    type: contact.type,
    hasAlert: contact.hasAlert || false,
    alertReason: contact.alertReason || '',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            ご家族情報の編集
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName && `${residentName}様の`}ご家族・連絡先情報を編集してください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <ContactForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};
