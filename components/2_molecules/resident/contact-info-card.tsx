'use client';

import { ContactEditModal } from '@/components/3_organisms/modals/contact-edit-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContactPerson } from '@/mocks/care-board-data';
import { contactService } from '@/services/contactService';
import type { ContactFormData } from '@/types/contact';
import { Edit3, Mail, MapPin, Phone, Trash2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface ContactCardProps {
  contact: ContactPerson;
  residentId: number;
  residentName: string;
  onUpdate: (contact: ContactPerson) => void;
  onDelete: (contactId: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  residentId,
  residentName,
  onUpdate,
  onDelete,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (data: ContactFormData): Promise<boolean> => {
    try {
      const success = await contactService.updateContact(residentId, contact.id, data);
      if (success !== undefined && success) {
        onUpdate({ ...contact, ...data } as ContactPerson);
        setIsEditModalOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update contact:', error);
      return false;
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const success = await contactService.deleteContact(residentId, contact.id);
      if (success !== undefined && success) {
        onDelete(contact.id);
        return true;
      } else {
        setDeleteError('削除に失敗しました。もう一度お試しください。');
        return false;
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      setDeleteError('ネットワークエラーが発生しました。接続を確認してもう一度お試しください。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '緊急連絡先':
        return 'bg-red-100 text-red-800 border-red-200';
      case '連絡先':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'その他':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Badge className={`${getTypeColor(contact.type)}`}>{contact.type}</Badge>
            <CardTitle className="text-lg">
              {contact.name}
              {contact.furigana && (
                <span className="text-sm text-gray-500">({contact.furigana})</span>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit3 className="h-3 w-3 mr-1" />
              編集
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              削除
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
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

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={contact.name}
        itemType="連絡先情報"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};
