'use client';

import type React from 'react';
import { useState } from 'react';
import type { ContactPerson } from '@/mocks/care-board-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, Phone, Mail, MapPin, Trash2 } from 'lucide-react';
import { ContactEditModal } from '@/components/3_organisms/modals/contact-edit-modal';
import { ContactDeleteModal } from '@/components/3_organisms/modals/contact-delete-modal';
import { contactService } from '@/services/contactService';
import type { ContactFormData } from '@/types/contact';

interface ContactCardProps {
  contact: ContactPerson;
  residentId: number;
  residentName?: string;
  onContactUpdate?: (updatedContact: ContactPerson) => void;
  onContactDelete?: (contactId: string) => void;
}

export const ContactInfoCard: React.FC<ContactCardProps> = ({
  contact,
  residentId,
  residentName,
  onContactUpdate,
  onContactDelete,
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

  const handleEditSubmit = async (contactData: ContactFormData): Promise<boolean> => {
    try {
      const updatedContact = await contactService.updateContact(
        residentId,
        contact.id,
        contactData
      );
      onContactUpdate?.(updatedContact);
      return true;
    } catch (error) {
      console.error('Failed to update contact:', error);
      return false;
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await contactService.deleteContact(residentId, contact.id);
      onContactDelete?.(contact.id);
      return true;
    } catch (error) {
      console.error('Failed to delete contact:', error);
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
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                contact.type === '緊急連絡先'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {contact.type}
            </span>
            <CardTitle className="text-lg">
              {contact.name} <span className="text-sm text-gray-500">({contact.furigana})</span>
            </CardTitle>
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
              <strong>続柄:</strong> {contact.relationship}
            </p>
            <p>
              <Phone className="inline h-4 w-4 mr-1 text-gray-500" />
              <strong>電話番号1:</strong> {contact.phone1}
            </p>
            {contact.phone2 && (
              <p>
                <Phone className="inline h-4 w-4 mr-1 text-gray-500" />
                <strong>電話番号2:</strong> {contact.phone2}
              </p>
            )}
            {contact.email && (
              <p>
                <Mail className="inline h-4 w-4 mr-1 text-gray-500" />
                <strong>メール:</strong> {contact.email}
              </p>
            )}
            <p className="md:col-span-2">
              <MapPin className="inline h-4 w-4 mr-1 text-gray-500" />
              <strong>住所:</strong> {contact.address}
            </p>
            {contact.notes && (
              <p className="md:col-span-2 pt-2 mt-2 border-t">
                <strong>備考:</strong> {contact.notes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <ContactEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        contact={contact}
        residentName={residentName}
      />

      <ContactDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        contactName={contact.name}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};
