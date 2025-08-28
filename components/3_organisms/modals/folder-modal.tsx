'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFolderForm } from '@/hooks/useFolderForm';
import type { DocumentFolder } from '@/mocks/documents-data';
import { AlertCircle, Edit, Folder, Loader2 } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';

type FolderModalMode = 'create' | 'edit';

interface FolderModalProps {
  mode: FolderModalMode;
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder?: (folderName: string) => Promise<boolean>;
  onUpdateFolder?: (folderId: string, folderName: string) => Promise<boolean>;
  folder?: DocumentFolder | null;
  existingFolders: string[];
}

export const FolderModal: React.FC<FolderModalProps> = ({
  mode,
  isOpen,
  onClose,
  onCreateFolder,
  onUpdateFolder,
  folder,
  existingFolders,
}) => {
  const form = useFolderForm({
    mode,
    onCreateFolder,
    onUpdateFolder,
    folder: mode === 'edit' ? folder : undefined,
    existingFolders,
    onClose,
  });

  const { onSubmit, isSubmitting, error, resetForm, control } = form;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // モーダルが開かれたときにフォームをリセット
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const isCreate = mode === 'create';
  const isEdit = mode === 'edit';

  const title = isCreate ? '新規フォルダの作成' : 'フォルダ名の編集';
  const description = isCreate
    ? '新しいフォルダの名前を入力してください。'
    : 'フォルダの新しい名前を入力してください。';
  const icon = isCreate ? (
    <Folder className="h-5 w-5 text-carebase-blue" />
  ) : (
    <Edit className="h-5 w-5 text-carebase-blue" />
  );
  const submitLabel = isCreate ? '作成' : '更新';
  const submittingLabel = isCreate ? '作成中...' : '更新中...';
  const placeholder = isCreate ? '新しいフォルダ' : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit}>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 py-2">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      フォルダ名 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={placeholder}
                        autoFocus
                        disabled={isSubmitting || (isEdit && !folder)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (isEdit && !folder)}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {submittingLabel}
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
