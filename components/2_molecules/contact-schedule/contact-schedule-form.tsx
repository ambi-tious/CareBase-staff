'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContactScheduleForm } from '@/hooks/useContactScheduleForm';
import { careBoardData } from '@/mocks/care-board-data';
import type { ContactScheduleFormData } from '@/types/contact-schedule';
import { assignmentOptions, priorityOptions, typeOptions } from '@/types/contact-schedule';
import { AlertCircle, Save, Send, User } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface ContactScheduleFormProps {
  onSubmit: (data: ContactScheduleFormData, isDraft?: boolean) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<ContactScheduleFormData>;
  mode: 'create' | 'edit';
  className?: string;
}

export const ContactScheduleForm: React.FC<ContactScheduleFormProps> = ({
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
  } = useContactScheduleForm({ onSubmit, initialData, mode });

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
  const typeSelectOptions = useMemo(
    () => typeOptions.map((type) => ({ value: type.value, label: type.label })),
    []
  );

  const prioritySelectOptions = useMemo(
    () => priorityOptions.map((priority) => ({ value: priority.value, label: priority.label })),
    []
  );

  const assignmentSelectOptions = useMemo(
    () =>
      assignmentOptions.map((assignment) => ({ value: assignment.value, label: assignment.label })),
    []
  );

  const residentOptions = useMemo(
    () => [
      { value: 'none', label: '選択なし' },
      ...careBoardData
        .filter((resident) => resident.admissionStatus === '入居中')
        .map((resident) => ({
          value: resident.id.toString(),
          label: `${resident.name} (${resident.careLevel})`,
        })),
    ],
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
      console.log('Draft saved successfully');
    }
  }, [saveDraft]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Field update callbacks
  const handleTitleChange = useCallback(
    (value: string) => {
      updateField('title', value);
    },
    [updateField]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      updateField('type', value);
    },
    [updateField]
  );

  const handlePriorityChange = useCallback(
    (value: string) => {
      updateField('priority', value);
    },
    [updateField]
  );

  const handleAssignedToChange = useCallback(
    (value: string) => {
      updateField('assignedTo', value);
    },
    [updateField]
  );

  const handleDueDateChange = useCallback(
    (value: string) => {
      updateField('dueDate', value);
    },
    [updateField]
  );

  const handleStartTimeChange = useCallback(
    (value: string) => {
      updateField('startTime', value);
    },
    [updateField]
  );

  const handleEndTimeChange = useCallback(
    (value: string) => {
      updateField('endTime', value);
    },
    [updateField]
  );

  const handleRelatedResidentChange = useCallback(
    (value: string) => {
      // Convert 'none' to empty string for data consistency
      const residentId = value === 'none' ? '' : value;
      updateField('relatedResidentId', residentId);
    },
    [updateField]
  );

  const handleTagsChange = useCallback(
    (value: string) => {
      updateField('tags', value);
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
          <span className="text-sm font-medium text-blue-800">作成者: {currentStaffName}</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">ログイン中のユーザーが自動的に設定されます</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
            基本情報
          </h3>

          <FormField
            label="タイトル"
            id="title"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="例：夏季感染症対策について"
            required
            error={fieldErrors.title}
            disabled={isSubmitting || isSavingDraft}
          />

          <FormSelect
            label="種別"
            id="type"
            value={formData.type}
            onChange={handleTypeChange}
            options={typeSelectOptions}
            required
            error={fieldErrors.type}
            disabled={isSubmitting || isSavingDraft}
          />

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
            label="対象者"
            id="assignedTo"
            value={formData.assignedTo}
            onChange={handleAssignedToChange}
            options={assignmentSelectOptions}
            required
            error={fieldErrors.assignedTo}
            disabled={isSubmitting || isSavingDraft}
          />
        </div>

        {/* Right Column - Schedule Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
            日時・関連情報
          </h3>

          <FormField
            label="実施日"
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleDueDateChange}
            required
            error={fieldErrors.dueDate}
            disabled={isSubmitting || isSavingDraft}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="開始時刻"
              id="startTime"
              type="time"
              value={formData.startTime || ''}
              onChange={handleStartTimeChange}
              error={fieldErrors.startTime}
              disabled={isSubmitting || isSavingDraft}
            />

            <FormField
              label="終了時刻"
              id="endTime"
              type="time"
              value={formData.endTime || ''}
              onChange={handleEndTimeChange}
              error={fieldErrors.endTime}
              disabled={isSubmitting || isSavingDraft}
            />
          </div>

          <FormSelect
            label="関連利用者"
            id="relatedResidentId"
            value={
              !formData.relatedResidentId || formData.relatedResidentId === ''
                ? 'none'
                : formData.relatedResidentId
            }
            onChange={handleRelatedResidentChange}
            options={residentOptions}
            error={fieldErrors.relatedResidentId}
            disabled={isSubmitting || isSavingDraft}
          />

          <FormField
            label="タグ"
            id="tags"
            value={formData.tags || ''}
            onChange={handleTagsChange}
            placeholder="例：感染対策,夏季対策,健康管理"
            error={fieldErrors.tags}
            disabled={isSubmitting || isSavingDraft}
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium text-gray-700">
          内容 <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={handleContentChange}
          placeholder="連絡・予定の詳細内容を入力してください。&#10;&#10;例：&#10;・夏季に多発する感染性胃腸炎の予防対策を強化します&#10;・食事前後の手洗い徹底をお願いします&#10;・利用者様の体調変化に注意してください"
          disabled={isSubmitting || isSavingDraft}
          className={`min-h-32 ${fieldErrors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          rows={8}
        />
        {fieldErrors.content && (
          <p className="text-sm text-red-600" role="alert">
            {fieldErrors.content}
          </p>
        )}
        <div className="text-xs text-gray-500 mt-1">{formData.content.length}/1000文字</div>
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
          {isSubmitting ? '作成中...' : mode === 'create' ? '作成' : '更新'}
        </Button>
      </div>
    </form>
  );
};
