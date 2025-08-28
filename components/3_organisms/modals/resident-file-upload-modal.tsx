'use client';

import { FileUploadForm } from '@/components/2_molecules/resident-files/file-upload-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ResidentFileFormData } from '@/validations/resident-file-validation';
import { Upload } from 'lucide-react';
import type React from 'react';

interface ResidentFileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResidentFileFormData, file: File) => Promise<boolean>;
  residentName: string;
}

export const ResidentFileUploadModal: React.FC<ResidentFileUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  residentName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary flex items-center gap-2">
            <Upload className="h-5 w-5" />
            ファイルのアップロード
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName}様のファイルをアップロードしてください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <FileUploadForm onSubmit={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};
