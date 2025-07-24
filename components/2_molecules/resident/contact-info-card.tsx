'use client';

import { ContactEditModal } from '@/components/3_organisms/modals/contact-edit-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
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
  onUpdate: () => void;
}

export const ContactInfoCard: React.FC<ContactCardProps> = ({
  contact,
  residentId,
  residentName,
  onUpdate,
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
        onUpdate();
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
        onUpdate();
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
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-900">{contact.name}</CardTitle>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-md border ${getTypeColor(
                  contact.type
                )}`}
              >
                {contact.type}
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {contact.furigana && <p className="text-sm text-gray-500 mt-1">{contact.furigana}</p>}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700 min-w-16">続柄:</span>
              <span className="text-gray-900">{contact.relationship}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-700 min-w-16">電話:</span>
              <span className="text-gray-900">{contact.phone1}</span>
            </div>

            {contact.phone2 && contact.phone2 !== '-' && (
              <div className="flex items-center gap-2 text-sm pl-6">
                <span className="font-medium text-gray-700 min-w-16">電話2:</span>
                <span className="text-gray-900">{contact.phone2}</span>
              </div>
            )}

            {contact.email && contact.email !== '-' && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-700 min-w-16">メール:</span>
                <span className="text-gray-900 break-all">{contact.email}</span>
              </div>
            )}

            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <span className="font-medium text-gray-700 min-w-16">住所:</span>
              <span className="text-gray-900 leading-relaxed">{contact.address}</span>
            </div>

            {contact.notes && contact.notes !== '-' && (
              <div className="flex items-start gap-2 text-sm">
                <span className="font-medium text-gray-700 min-w-16">備考:</span>
                <span className="text-gray-900 leading-relaxed">{contact.notes}</span>
              </div>
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
