'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCareRecordForm } from '@/hooks/useCareRecordForm';
import { careBoardData } from '@/mocks/care-board-data';
import { categoryOptions, priorityOptions, statusOptions } from '@/types/care-record';
import type { CareRecordFormData } from '@/validations/care-record-validation';
import { AlertCircle, RefreshCw, Save, Send, User } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface CareRecordFormProps {
  onSubmit: (data: CareRecordFormData, isDraft?: boolean) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<CareRecordFormData>;
  mode: 'create' | 'edit';
  className?: string;
}

export const CareRecordForm: React.FC<CareRecordFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode,
  className = '',
}) => {
  const [currentStaffName, setCurrentStaffName] = useState('');

  const {
    formData,
    updateField,
    isSubmitting,
    isSavingDraft,
    error,
    fieldErrors,
    hasUnsavedChanges,
    submitFinal,
    saveDraft,
    clearError,
  } = useCareRecordForm({ onSubmit, initialData, mode });

  // Load current staff information
  useEffect(() => {
    try {
      const staffDataStr = localStorage.getItem('carebase_selected_staff_data');
      if (staffDataStr) {
        const staffData = JSON.parse(staffDataStr);
        setCurrentStaffName(staffData.staff.name);
      } else {
        setCurrentStaffName('田中 花子'); // Fallback
      }
    } catch (error) {
      console.error('Failed to load staff data:', error);
      setCurrentStaffName('田中 花子');
    }
  }, []);

  // Memoize options to prevent unnecessary re-renders
  const categorySelectOptions = useMemo(
    () => categoryOptions.map((cat) => ({ value: cat.value, label: cat.label })),
    []
  );

  const prioritySelectOptions = useMemo(
    () => priorityOptions.map((pri) => ({ value: pri.value, label: pri.label })),
    []
  );

  const statusSelectOptions = useMemo(
    () => statusOptions.map((status) => ({ value: status.value, label: status.label })),
    []
  );

  const residentOptions = useMemo(
    () =>
      careBoardData
        .filter((resident) => resident.admissionStatus === '入居中')
        .map((resident) => ({
          value: resident.id.toString(),
          label: `${resident.name} (${resident.careLevel})`,
        })),
    []
  );

  const onFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await submitFinal();
      if (success) {
        onCancel(); // Close form on success
      }
    },
    [submitFinal, onCancel]
  );

  const handleSaveDraft = useCallback(async () => {
    const success = await saveDraft();
    if (success) {
      // Show success message but don't close form
    }
  }, [saveDraft]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Memoize field update callbacks to prevent re-renders
  const handleResidentChange = useCallback(
    (value: string) => {
      updateField('residentId', value);
    },
    [updateField]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      updateField('category', value);
    },
    [updateField]
  );

  const handleTitleChange = useCallback(
    (value: string) => {
      updateField('title', value);
    },
    [updateField]
  );

  const handleRecordedAtChange = useCallback(
    (value: string) => {
      updateField('recordedAt', value);
    },
    [updateField]
  );

  const handlePriorityChange = useCallback(
    (value: string) => {
      updateField('priority', value);
    },
    [updateField]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      updateField('status', value);
    },
    [updateField]
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateField('content', e.target.value);
    },
    [updateField]
  );

  const isNetworkError = error?.includes('ネットワークエラー');

  // Get selected resident info
  const selectedResident = formData.residentId
    ? careBoardData.find((r) => r.id.toString() === formData.residentId)
    : null;

  return (
    <form onSubmit={onFormSubmit} className={`space-y-6 ${className}`}>
      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 flex items-center justify-between">
            <span>{error}</span>
            {isNetworkError && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearError}
                disabled={isSubmitting || isSavingDraft}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                リトライ
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Current Staff Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">担当職員: {currentStaffName}</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">ログイン中のユーザーが自動的に設定されます</p>
      </div>

      {/* Selected Resident Info */}
      {selectedResident && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              対象利用者: {selectedResident.name}
            </span>
          </div>
          <div className="text-xs text-green-600 mt-1 space-x-4">
            <span>年齢: {selectedResident.age}歳</span>
            <span>性別: {selectedResident.sex}</span>
            <span>介護度: {selectedResident.careLevel}</span>
            <span>部屋: {selectedResident.roomInfo || '未設定'}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
            基本情報
          </h3>

          <FormSelect
            label="対象利用者"
            id="residentId"
            value={formData.residentId}
            onChange={handleResidentChange}
            options={residentOptions}
            placeholder="利用者を選択してください"
            required
            error={fieldErrors.residentId}
            disabled={isSubmitting || isSavingDraft}
          />

          <FormSelect
            label="記録種別"
            id="category"
            value={formData.category}
            onChange={handleCategoryChange}
            options={categorySelectOptions}
            required
            error={fieldErrors.category}
            disabled={isSubmitting || isSavingDraft}
          />

          <FormField
            label="タイトル"
            id="title"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="例：朝食摂取記録"
            required
            error={fieldErrors.title}
            disabled={isSubmitting || isSavingDraft}
          />

          <FormField
            label="記録日時"
            id="recordedAt"
            type="datetime-local"
            value={formData.recordedAt}
            onChange={handleRecordedAtChange}
            required
            error={fieldErrors.recordedAt}
            disabled={isSubmitting || isSavingDraft}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="重要度"
              id="priority"
              value={formData.priority}
              onChange={handlePriorityChange}
              options={prioritySelectOptions}
              required
              error={fieldErrors.priority}
              disabled={isSubmitting || isSavingDraft}
            />

            <FormSelect
              label="ステータス"
              id="status"
              value={formData.status}
              onChange={handleStatusChange}
              options={statusSelectOptions}
              required
              error={fieldErrors.status}
              disabled={isSubmitting || isSavingDraft}
            />
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
            記録内容
          </h3>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              詳細な記録内容 <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="詳細な介護記録を入力してください。&#10;&#10;例：&#10;・朝食を8割程度摂取&#10;・食欲良好で、特に問題なし&#10;・水分摂取も十分&#10;・次回の注意点：なし"
              disabled={isSubmitting || isSavingDraft}
              className={`min-h-32 ${fieldErrors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              rows={12}
            />
            {fieldErrors.content && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.content}
              </p>
            )}
            <div className="text-xs text-gray-500 mt-1">{formData.content.length}/1000文字</div>
          </div>

          {/* Care Content Guidelines */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">記録内容のガイドライン</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 客観的事実を正確に記録してください</li>
              <li>• 利用者様の状態変化があれば詳しく記載してください</li>
              <li>• 次回の介護に必要な申し送り事項があれば明記してください</li>
              <li>• 家族への報告が必要な事項があれば記載してください</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">未保存の変更があります</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting || isSavingDraft}
        >
          キャンセル
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting || isSavingDraft}
          className="border-gray-400 text-gray-700 hover:bg-gray-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSavingDraft ? '保存中...' : '下書き保存'}
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || isSavingDraft}
          className="bg-carebase-blue hover:bg-carebase-blue-dark"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? '保存中...' : mode === 'create' ? '記録を作成' : '記録を更新'}
        </Button>
      </div>
    </form>
  );
};
