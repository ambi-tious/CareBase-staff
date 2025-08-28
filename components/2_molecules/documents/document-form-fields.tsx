'use client';

import { DocumentLocationRegisterModal } from '@/components/2_molecules/documents/document-location-register-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getFolderPath } from '@/mocks/hierarchical-documents';
import type { DocumentFormData } from '@/validations/document-validation';
import { Folder } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';

interface DocumentFormFieldsProps {
  form: UseFormReturn<DocumentFormData>;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
  className?: string;
  folderName?: string; // フォルダ名（表示用）
}

export const DocumentFormFields: React.FC<DocumentFormFieldsProps> = ({
  form,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
  className = '',
  folderName,
}) => {
  // モーダル状態管理
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  // フォルダパス表示用
  const getFolderDisplayPath = (folderId: string | null): string => {
    if (!folderId || folderId === 'root') return 'ルート';

    try {
      const folderPath = getFolderPath(folderId);
      return (
        folderPath
          .filter((item) => item.id !== 'root')
          .map((item) => item.name)
          .join(' > ') || 'ルート'
      );
    } catch (error) {
      console.error('Failed to get folder path:', error);
      return 'ルート';
    }
  };

  // モーダルを開く
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // フォルダ選択完了時の処理
  const handleSelectFolder = (folderId: string | null) => {
    const selectedId = folderId === 'root' ? 'root' : folderId || 'root';
    form.setValue('folderId', selectedId, { shouldDirty: true });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className={`space-y-4 ${className}`}>
          {/* Folder Location Info */}
          <FormField
            control={form.control}
            name="folderId"
            render={({ field }) => {
              const currentFolderId = field.value;
              const selectedFolderPath = getFolderDisplayPath(
                currentFolderId === 'root' ? null : currentFolderId || null
              );

              if (currentFolderId && currentFolderId !== 'root') {
                return (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Folder className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      保存場所: {selectedFolderPath}
                    </AlertDescription>
                  </Alert>
                );
              }
              return <div></div>;
            }}
          />

          {/* 基本情報 */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    書類タイトル <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="書類のタイトルを入力してください"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 保存場所フォーム */}
            <FormField
              control={form.control}
              name="folderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>保存場所</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        value={getFolderDisplayPath(
                          field.value === 'root' ? null : field.value || null
                        )}
                        disabled
                        className="bg-gray-50 text-gray-600"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleOpenModal}
                      disabled={isSubmitting}
                      className="shrink-0"
                      title="保存場所を選択"
                    >
                      <Folder className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">書類が保存されるフォルダの場所です</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タグ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="カンマ区切りでタグを入力（例: 会議,報告,2025年度）"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      {/* 保存場所選択モーダル */}
      <DocumentLocationRegisterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentFolderId={form.watch('folderId') === 'root' ? null : form.watch('folderId') || null}
        onSelectFolder={handleSelectFolder}
      />
    </>
  );
};
