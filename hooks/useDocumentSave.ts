/**
 * Document Save Hook
 *
 * Manages document save operations for both new and edit modes
 */

import { useAuth } from '@/hooks/useAuth';
import type { DocumentFormData } from '@/validations/document-validation';
import { useCallback } from 'react';

interface UseDocumentSaveOptions {
  documentId?: string;
  folderId?: string | null;
}

interface SaveData {
  formData: DocumentFormData;
  content: string;
  attachedFile?: File;
}

export const useDocumentSave = ({ documentId, folderId }: UseDocumentSaveOptions) => {
  const { selectedStaff } = useAuth();

  const saveDocument = useCallback(
    async (data: SaveData): Promise<boolean> => {
      try {
        // 実際のアプリケーションではAPIに送信
        const saveData = {
          documentId,
          folderId, // フォルダIDも保存データに含める
          createdBy: selectedStaff?.name || '現在のユーザー',
          ...data,
        };

        // 保存処理をシミュレート（新規作成は少し時間がかかる）
        const delay = documentId ? 500 : 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));

        return true;
      } catch (error) {
        console.error('Save failed:', error);
        return false;
      }
    },
    [documentId, folderId, selectedStaff?.name]
  );

  return {
    saveDocument,
  };
};
