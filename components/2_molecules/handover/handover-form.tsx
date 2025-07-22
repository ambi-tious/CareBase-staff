'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useHandoverForm } from '@/hooks/useHandoverForm';
import type { HandoverFormData } from '@/types/handover';
import { categoryOptions, priorityOptions } from '@/types/handover';
import { AlertCircle, RefreshCw, Save, Send, User } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResidentSelector } from './resident-selector';
import { StaffSelector } from './staff-selector';

interface HandoverFormProps {
  onSubmit: (data: HandoverFormData, isDraft?: boolean) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<HandoverFormData>;
  mode: 'create' | 'edit';
  className?: string;
}

export const HandoverForm: React.FC<HandoverFormProps> = ({
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
  } = useHandoverForm({ onSubmit, initialData, mode });

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
  const categorySelectOptions = useMemo(() => 
    categoryOptions.map(cat => ({ value: cat.value, label: cat.label })), 
    []
  );

  const prioritySelectOptions = useMemo(() => 
    priorityOptions.map(pri => ({ value: pri.value, label: pri.label })), 
    []
  );

  const onFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitFinal();
    if (success) {
      onCancel(); // Close form on success
    }
  }, [submitFinal, onCancel]);

  const handleSaveDraft = useCallback(async () => {
    const success = await saveDraft();
    if (success) {
      // Show success message but don't close form
      console.log('Draft saved successfully');
    }
  }, [saveDraft]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Memoize field update callbacks to prevent re-renders
  const handleTitleChange = useCallback((value: string) => {
    updateField('title', value);
  }, [updateField]);

  const handleCategoryChange = useCallback((value: string) => {
    updateField('category', value);
  }, [updateField]);

  const handlePriorityChange = useCallback((value: string) => {
    updateField('priority', value);
  }, [updateField]);

  const handleScheduledDateChange = useCallback((value: string) => {
    updateField('scheduledDate', value);
  }, [updateField]);

  const handleScheduledTimeChange = useCallback((value: string) => {
    updateField('scheduledTime', value);
  }, [updateField]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField('content', e.target.value);
  }, [updateField]);

  const handleStaffSelectionChange = useCallback((staffIds: string[]) => {
    updateField('targetStaffIds', staffIds);
  }, [updateField]);

  const handleResidentSelectionChange = useCallback((residentId?: string) => {
    updateField('residentId', residentId || '');
  }, [updateField]);

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
          <span className="text-sm font-medium text-blue-800">申し送り者: {currentStaffName}</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          ログイン中のユーザーが自動的に設定されます
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
            基本情報
          </h3>

          <FormField
            label="件名"
            id="title"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="例：佐藤様の血圧について"
            required
            error={fieldErrors.title}
            disabled={isSubmitting || isSavingDraft}
          />

          <FormSelect
            label="カテゴリ"
            id="category"
            value={formData.category}
            onChange={handleCategoryChange}
            options={categorySelectOptions}
            required
            error={fieldErrors.category}
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="実施予定日"
              id="scheduledDate"
              type="date"
              value={formData.scheduledDate || ''}
              onChange={handleScheduledDateChange}
              error={fieldErrors.scheduledDate}
              disabled={isSubmitting || isSavingDraft}
            />

            <FormField
              label="実施予定時刻"
              id="scheduledTime"
              type="time"
              value={formData.scheduledTime || ''}
              onChange={handleScheduledTimeChange}
              error={fieldErrors.scheduledTime}
              disabled={isSubmitting || isSavingDraft}
            />
          </div>
        </div>

        {/* Right Column - Target Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
            申し送り先・対象者
          </h3>

          <StaffSelector
            selectedStaffIds={formData.targetStaffIds}
            onSelectionChange={handleStaffSelectionChange}
            error={fieldErrors.targetStaffIds}
          />

          <ResidentSelector
            selectedResidentId={formData.residentId}
            onSelectionChange={handleResidentSelectionChange}
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium text-gray-700">
          申し送り内容 <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={handleContentChange}
          placeholder="申し送り内容を詳しく記入してください。&#10;&#10;例：&#10;・本日朝のバイタル測定時に血圧が156/110と高値でした&#10;・かかりつけ医への連絡を検討してください&#10;・次回測定時も注意深く観察をお願いします"
          disabled={isSubmitting || isSavingDraft}
          className={`min-h-32 ${fieldErrors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
          rows={8}
        />
        {fieldErrors.content && (
          <p className="text-sm text-red-600" role="alert">
            {fieldErrors.content}
          </p>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {formData.content.length}/1000文字
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
          {isSubmitting ? '送信中...' : mode === 'create' ? '申し送りを送信' : '更新して送信'}
        </Button>
      </div>
    </form>
  );
};
