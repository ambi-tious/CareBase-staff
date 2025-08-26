'use client';

import { DocumentFormFields } from '@/components/2_molecules/documents/document-form-fields';
import { DocumentEditor } from '@/components/2_molecules/editor/document-editor';
import { DocumentToolbar } from '@/components/2_molecules/editor/document-toolbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDocumentForm } from '@/hooks/useDocumentForm';
import { getFolder } from '@/mocks/hierarchical-documents';
import { getCategoryFromFolderId, getFolderIdFromSearchParams } from '@/utils/folder-utils';
import type { DocumentFormData } from '@/validations/document-validation';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  File,
  FileText,
  Save,
  Upload,
  X,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface DocumentFormEditorProps {
  documentId?: string;
  initialDocument?: {
    id?: string;
    title: string;
    content: string;
    category: string;
    description: string;
    status: 'draft' | 'published' | 'archived';
    tags: string;
    createdAt: Date;
    updatedAt: Date;
    attachedFile?: {
      name: string;
      size: number;
      type: string;
      url: string;
    };
  };
  onSave?: (data: {
    formData: DocumentFormData;
    content: string;
    attachedFile?: File;
  }) => Promise<boolean>;
  className?: string;
}

type ContentInputMode = 'manual' | 'attachment';

export const DocumentFormEditor: React.FC<DocumentFormEditorProps> = ({
  documentId,
  initialDocument,
  onSave,
  className = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = !!documentId;

  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(initialDocument?.content || '');
  const [contentInputMode, setContentInputMode] = useState<ContentInputMode>('manual');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 初期化時に既存の添付ファイルがある場合は添付モードに設定
  useEffect(() => {
    if (initialDocument?.attachedFile) {
      setContentInputMode('attachment');
    }
  }, [initialDocument]);

  // フォルダIDとカテゴリの自動判定
  const folderId = getFolderIdFromSearchParams(searchParams);
  const autoCategory = getCategoryFromFolderId(folderId);
  const isAutoCategory = !!folderId && !isEditMode;

  // フォルダ情報の取得
  const [folderName, setFolderName] = useState<string>('');
  useEffect(() => {
    if (folderId) {
      try {
        const folder = getFolder(folderId);
        if (folder) {
          setFolderName(folder.name);
        }
      } catch (error) {
        console.error('Failed to get folder info:', error);
      }
    }
  }, [folderId]);

  // ファイルアップロード処理
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズ制限（10MB）
    if (file.size > 10 * 1024 * 1024) {
      setSaveError('ファイルサイズは10MB以下にしてください');
      return;
    }

    // サポートされているファイル形式
    const supportedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
    ];

    if (!supportedTypes.includes(file.type)) {
      setSaveError(
        'サポートされていないファイル形式です。PDF、Word文書、テキストファイル、または画像ファイルを選択してください'
      );
      return;
    }

    setAttachedFile(file);
    setSaveError(null);

    // テキストファイルの場合はプレビューを生成
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string;
        setFilePreview(text);
      };
      reader.readAsText(file);
    } else {
      setFilePreview('');
    }
  }, []);

  // ファイル削除処理
  const handleFileRemove = useCallback(() => {
    setAttachedFile(null);
    setFilePreview('');
  }, []);

  // フォームデータの初期値を設定
  const initialFormData: DocumentFormData = {
    title: initialDocument?.title || '',
    description: initialDocument?.description || '',
    status: initialDocument?.status || 'draft',
    tags: initialDocument?.tags || '',
    folderId: folderId || undefined,
    category: initialDocument?.category || '',
  };

  const { formData, updateField, isSubmitting, error, fieldErrors, handleSubmit } = useDocumentForm(
    {
      initialData: initialFormData,
      onSubmit: async (data) => {
        setIsSaving(true);
        setSaveError(null);

        try {
          let success = false;

          // 内容の検証
          if (contentInputMode === 'manual' && !content.trim()) {
            setSaveError('文書内容を入力してください');
            setIsSaving(false);
            return false;
          }

          if (
            contentInputMode === 'attachment' &&
            !attachedFile &&
            !initialDocument?.attachedFile
          ) {
            setSaveError('ファイルを添付してください');
            setIsSaving(false);
            return false;
          }

          if (onSave) {
            const finalContent = contentInputMode === 'manual' ? content : '';
            const finalFile =
              contentInputMode === 'attachment' ? attachedFile || undefined : undefined;
            success = await onSave({
              formData: data,
              content: finalContent,
              attachedFile: finalFile,
            });
          } else {
            // デフォルトの保存処理
            await new Promise((resolve) => setTimeout(resolve, 500));
            success = true;
          }

          if (success) {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

            // 保存成功後の遷移
            if (isEditMode) {
              router.push(`/documents/view/${documentId}`);
            } else {
              if (folderId) {
                router.push(`/documents?folder=${folderId}`);
              } else {
                router.push('/documents');
              }
            }
          }

          return success;
        } catch (error) {
          console.error('Failed to save document:', error);
          setSaveError('保存に失敗しました。もう一度お試しください。');
          return false;
        } finally {
          setIsSaving(false);
        }
      },
    }
  );

  // 文書フォーマット処理
  const handleFormatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  // 統合保存処理
  const handleSaveAll = async () => {
    const success = await handleSubmit();
    return success;
  };

  const handleCancel = () => {
    if (folderId) {
      router.push(`/documents?folder=${folderId}`);
    } else {
      router.back();
    }
  };

  const pageTitle = isEditMode ? '書類編集' : '新規書類作成';

  const isProcessing = isSubmitting || isSaving;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`min-h-screen bg-carebase-bg ${className}`}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
              disabled={isProcessing}
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-carebase-blue" />
              <h1 className="text-2xl font-bold text-carebase-text-primary">{pageTitle}</h1>
            </div>
          </div>
          <p className="text-gray-600">
            {isEditMode ? (
              <>
                書類の情報と内容を編集してください。必須項目（
                <span className="text-red-500">*</span>
                ）は必ず入力してください。
              </>
            ) : (
              <>
                書類の基本情報を入力してください。必須項目（
                <span className="text-red-500">*</span>
                ）は必ず入力してください。
                {isAutoCategory && (
                  <> カテゴリは「{folderName}」フォルダに基づいて自動設定されます。</>
                )}
              </>
            )}
          </p>
        </div>

        {/* アラート表示 */}
        {saveSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              文書が正常に保存されました
            </AlertDescription>
          </Alert>
        )}

        {saveError && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{saveError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* メインコンテンツ */}
          <div className="flex gap-4">
            {/* 基本情報フォーム */}
            <Card className="w-1/3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  基本情報
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentFormFields
                  formData={formData}
                  updateField={updateField}
                  isSubmitting={isProcessing}
                  error={error}
                  fieldErrors={fieldErrors}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  folderId={folderId || undefined}
                  folderName={folderName}
                />
              </CardContent>
            </Card>

            {/* エディタ / ファイル添付 */}
            <Card className="w-2/3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  文書内容
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 入力方法選択 */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">入力方法を選択してください</Label>
                  <RadioGroup
                    value={contentInputMode}
                    onValueChange={(value) => setContentInputMode(value as ContentInputMode)}
                    className="flex gap-6"
                    disabled={isProcessing}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual" className="cursor-pointer">
                        手動入力
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="attachment" id="attachment" />
                      <Label htmlFor="attachment" className="cursor-pointer">
                        ファイル添付
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* 手動入力モード */}
                {contentInputMode === 'manual' && (
                  <div className="space-y-0">
                    <DocumentToolbar
                      onFormatText={handleFormatText}
                      fontFamily={fontFamily}
                      fontSize={fontSize}
                      textColor={textColor}
                      disabled={isProcessing}
                    />
                    <div className="border-t">
                      <DocumentEditor
                        content={content}
                        onContentChange={setContent}
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                )}

                {/* ファイル添付モード */}
                {contentInputMode === 'attachment' && (
                  <div className="space-y-4">
                    {/* ファイルアップロード */}
                    <div className="space-y-2">
                      <Label htmlFor="file-upload" className="text-sm font-medium">
                        ファイルを選択 <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="file-upload"
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                          disabled={isProcessing}
                          className="flex-1"
                        />
                        <Upload className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500">
                        対応形式: PDF, Word文書(.doc, .docx), テキストファイル(.txt),
                        画像ファイル(.jpg, .png, .gif) | 最大10MB
                      </p>
                    </div>

                    {/* 既存ファイル情報（編集モード） */}
                    {isEditMode && initialDocument?.attachedFile && !attachedFile && (
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <File className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-sm">
                                {initialDocument.attachedFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(initialDocument.attachedFile.size)} •{' '}
                                {initialDocument.attachedFile.type}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(initialDocument.attachedFile?.url, '_blank')}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            プレビュー
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* アップロードされたファイル情報 */}
                    {attachedFile && (
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <File className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium text-sm">{attachedFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(attachedFile.size)} • {attachedFile.type}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleFileRemove}
                            disabled={isProcessing}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                            削除
                          </Button>
                        </div>

                        {/* テキストファイルのプレビュー */}
                        {filePreview && (
                          <div className="mt-3 p-3 bg-white border rounded max-h-48 overflow-y-auto">
                            <p className="text-xs text-gray-500 mb-2">プレビュー:</p>
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                              {filePreview}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-3 p-4 bg-white rounded-lg border">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              キャンセル
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={isProcessing}
              className="bg-carebase-blue hover:bg-carebase-blue-dark flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isProcessing ? '保存中...' : isEditMode ? '更新' : '保存'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
