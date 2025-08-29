'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCommunicationForm } from '@/hooks/useCommunicationForm';
import type { ContactPerson } from '@/mocks/care-board-data';
import { getAllStaff } from '@/mocks/staff-data';
import type { CommunicationFormData } from '@/validations/communication-validation';
import { AlertCircle, RefreshCw, User, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface CommunicationFormProps {
  onSubmit: (data: CommunicationFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<CommunicationFormData>;
  mode: 'create' | 'edit' | 'reply';
  contacts: ContactPerson[];
  className?: string;
}

export const CommunicationForm: React.FC<CommunicationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode,
  contacts,
  className = '',
}) => {
  const [currentStaffName, setCurrentStaffName] = useState('');

  const form = useCommunicationForm({ onSubmit, initialData, mode });
  const {
    formData,
    isSubmitting,
    error,
    hasUnsavedChanges,
    onSubmit: formSubmit,
    clearError,
    control,
    setValue,
    watch,
  } = form;

  const watchedContactPersonType = watch('contactPersonType');
  const watchedContactPersonId = watch('contactPersonId');

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

  // Get all staff for selection
  const allStaff = useMemo(() => getAllStaff(), []);

  // Contact person options
  const contactPersonOptions = useMemo(() => {
    return contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      relationship: contact.relationship,
    }));
  }, [contacts]);

  // Handle contact person selection
  useEffect(() => {
    if (watchedContactPersonType === 'family' && watchedContactPersonId) {
      const selectedContact = contactPersonOptions.find((c) => c.id === watchedContactPersonId);
      if (selectedContact) {
        setValue('contactPersonName', selectedContact.name);
      }
    }
  }, [watchedContactPersonType, watchedContactPersonId, contactPersonOptions, setValue]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formSubmit();
  };

  const isNetworkError = error?.includes('ネットワークエラー');

  return (
    <Form {...form}>
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
                  onClick={clearError}
                  disabled={isSubmitting}
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
            <span className="text-sm font-medium text-blue-800">
              記録作成者: {currentStaffName}
            </span>
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
              control={control}
              name="datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    日時 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={isSubmitting}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    対応者（職員） <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="対応した職員を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{staff.name}</span>
                            <span className="text-xs text-gray-500">({staff.role.name})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="contactPersonType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    連絡者タイプ <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // タイプが変更されたら連絡者情報をリセット
                      setValue('contactPersonId', '');
                      setValue('contactPersonName', '');
                    }}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="連絡者タイプを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="family">ご家族情報から選択</SelectItem>
                      <SelectItem value="manual">手動入力</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 連絡者選択（ご家族情報から） */}
            {watchedContactPersonType === 'family' && (
              <FormField
                control={control}
                name="contactPersonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      連絡者（ご家族） <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ご家族を選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contactPersonOptions.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{contact.name}</span>
                              <span className="text-xs text-gray-500">
                                ({contact.relationship})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 連絡者名（手動入力） */}
            {watchedContactPersonType === 'manual' && (
              <FormField
                control={control}
                name="contactPersonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      連絡者名 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="例：田中太郎（近所の方）"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={control}
              name="isImportant"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">重要なコミュニケーション</FormLabel>
                    <p className="text-xs text-gray-500">
                      緊急性が高い内容や申し送りが必要な場合はチェックしてください
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Right Column - Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              コミュニケーション内容
            </h3>

            <FormField
              control={control}
              name="communicationContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    コミュニケーション内容 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="ご家族や関係者からの連絡内容、相談内容を詳しく記入してください"
                      disabled={isSubmitting}
                      rows={6}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">{field.value.length}/2000文字</div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="responseContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    対応内容・備考 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="職員側の対応内容、回答内容、今後の対応予定などを記入してください"
                      disabled={isSubmitting}
                      rows={6}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">{field.value.length}/2000文字</div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            キャンセル
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
          >
            {isSubmitting
              ? '保存中...'
              : mode === 'create'
                ? '登録'
                : mode === 'reply'
                  ? '返信'
                  : '更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
