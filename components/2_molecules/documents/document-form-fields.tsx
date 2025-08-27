'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { DocumentLocationRegisterModal } from '@/components/2_molecules/documents/document-location-register-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getFolderPath, rootFolders, subFolders } from '@/mocks/hierarchical-documents';
import type { DocumentFormData } from '@/validations/document-validation';
import { Folder } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface DocumentFormFieldsProps {
  formData: DocumentFormData;
  updateField: (field: keyof DocumentFormData, value: string) => void;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof DocumentFormData, string>>;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
  className?: string;
  folderName?: string; // フォルダ名（表示用）
}

export const DocumentFormFields: React.FC<DocumentFormFieldsProps> = ({
  formData,
  updateField,
  isSubmitting,
  error,
  fieldErrors,
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

  // 全てのフォルダを取得
  const getAllFolders = () => {
    const folders: { id: string; name: string; type: 'folder'; parentId: string | null }[] = [];

    // ルートフォルダを追加
    rootFolders.forEach((folder) => {
      folders.push({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        parentId: folder.parentId,
      });
    });

    // サブフォルダを追加
    subFolders.forEach((folder) => {
      folders.push({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        parentId: folder.parentId,
      });
    });

    return folders;
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

  const folders = getAllFolders();

  // 現在選択されているフォルダのパスを取得
  const selectedFolderPath = getFolderDisplayPath(
    formData.folderId === 'root' ? null : formData.folderId || null
  );

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
    updateField('folderId' as keyof DocumentFormData, selectedId);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className={`space-y-4 ${className}`}>
        {/* Folder Location Info */}
        {formData.folderId && formData.folderId !== 'root' && (
          <Alert className="border-blue-200 bg-blue-50">
            <Folder className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              保存場所: {selectedFolderPath}
            </AlertDescription>
          </Alert>
        )}

        {/* 基本情報 */}
        <div className="space-y-4">
          <FormField
            label="書類タイトル"
            id="title"
            value={formData.title}
            onChange={(value) => updateField('title', value)}
            placeholder="書類のタイトルを入力してください"
            required
            error={fieldErrors.title}
            disabled={isSubmitting}
          />

          {/* 保存場所フォーム */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">保存場所</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={getFolderDisplayPath(
                  formData.folderId === 'root' ? null : formData.folderId || null
                )}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
              <button
                type="button"
                onClick={handleOpenModal}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="保存場所を選択"
              >
                <Folder className="h-4 w-4 text-blue-500" />
              </button>
            </div>
            <p className="text-xs text-gray-500">書類が保存されるフォルダの場所です</p>
          </div>

          <FormField
            label="タグ"
            id="tags"
            value={formData.tags}
            onChange={(value) => updateField('tags', value)}
            placeholder="カンマ区切りでタグを入力（例: 会議,報告,2025年度）"
            error={fieldErrors.tags}
            disabled={isSubmitting}
          />
        </div>
      </form>

      {/* 保存場所選択モーダル */}
      <DocumentLocationRegisterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentFolderId={formData.folderId === 'root' ? null : formData.folderId || null}
        onSelectFolder={handleSelectFolder}
      />
    </>
  );
};
