import type { DocumentFolder } from '@/mocks/documents-data';
import type { FolderCreateFormData } from '@/validations/folder-validation';
import { folderCreateSchema } from '@/validations/folder-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FolderFormMode = 'create' | 'edit';

interface UseFolderFormProps {
  mode: FolderFormMode;
  onCreateFolder?: (folderName: string) => Promise<boolean>;
  onUpdateFolder?: (folderId: string, folderName: string) => Promise<boolean>;
  folder?: DocumentFolder | null;
  existingFolders: string[];
  onClose: () => void;
}

export const useFolderForm = ({
  mode,
  onCreateFolder,
  onUpdateFolder,
  folder,
  existingFolders,
  onClose,
}: UseFolderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FolderCreateFormData>({
    resolver: zodResolver(folderCreateSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, formState, reset, setValue, setError: setFieldError } = form;
  const { errors } = formState;

  // 編集モードでフォルダが変更されたら名前を更新
  useEffect(() => {
    if (mode === 'edit' && folder && folder !== null) {
      setValue('name', folder.name);
    }
  }, [mode, folder, setValue]);

  const handleFormSubmit = useCallback(
    async (data: FolderCreateFormData) => {
      const trimmedName = data.name.trim();

      // 重複チェック
      if (mode === 'create') {
        if (existingFolders.includes(trimmedName)) {
          setFieldError('name', {
            type: 'manual',
            message: '同じ名前のフォルダが既に存在します',
          });
          return;
        }
      } else if (mode === 'edit' && folder && folder !== null) {
        // 編集モードの場合、自分自身は除外
        if (trimmedName !== folder.name && existingFolders.includes(trimmedName)) {
          setFieldError('name', {
            type: 'manual',
            message: '同じ名前のフォルダが既に存在します',
          });
          return;
        }
      }

      setError(null);
      setIsSubmitting(true);

      try {
        let success = false;

        if (mode === 'create' && onCreateFolder) {
          success = await onCreateFolder(trimmedName);
        } else if (mode === 'edit' && onUpdateFolder && folder && folder !== null) {
          success = await onUpdateFolder(folder.id, trimmedName);
        }

        if (success) {
          if (mode === 'create') {
            reset();
          }
          onClose();
        } else {
          const errorMessage =
            mode === 'create'
              ? 'フォルダの作成に失敗しました。もう一度お試しください。'
              : 'フォルダの更新に失敗しました。もう一度お試しください。';
          setError(errorMessage);
        }
      } catch (error) {
        console.error(`Failed to ${mode} folder:`, error);
        setError('エラーが発生しました。もう一度お試しください。');
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, onCreateFolder, onUpdateFolder, folder, existingFolders, setFieldError, reset, onClose]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetForm = useCallback(() => {
    if (mode === 'edit' && folder && folder !== null) {
      setValue('name', folder.name);
    } else {
      reset();
    }
    setError(null);
  }, [mode, folder, setValue, reset]);

  return {
    ...form,
    onSubmit: handleSubmit(handleFormSubmit),
    isSubmitting,
    error,
    fieldErrors: errors,
    clearError,
    resetForm,
  };
};
