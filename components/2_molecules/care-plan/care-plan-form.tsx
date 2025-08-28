'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CareManagerCombobox } from '@/components/1_atoms/care-manager/care-manager-combobox';
import { useCarePlanForm } from '@/hooks/useCarePlanForm';
import { certificationStatusOptions, planTypeOptions, serviceTypeOptions } from '@/types/care-plan';
import type { CarePlanFormData, CarePlanServiceFormData } from '@/validations/care-plan-validation';
import { AlertCircle, Plus, RefreshCw, Save, Send, Trash2, User, X } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface CarePlanFormProps {
  onSubmit: (data: CarePlanFormData, isDraft?: boolean) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<CarePlanFormData>;
  mode: 'create' | 'edit';
  className?: string;
}

const careLevelOptions = [
  { value: '要介護1', label: '要介護1' },
  { value: '要介護2', label: '要介護2' },
  { value: '要介護3', label: '要介護3' },
  { value: '要介護4', label: '要介護4' },
  { value: '要介護5', label: '要介護5' },
];

export const CarePlanForm: React.FC<CarePlanFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode,
  className = '',
}) => {
  const [currentStaffName, setCurrentStaffName] = useState('');

  const carePlanForm = useCarePlanForm({ onSubmit, initialData, mode });

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
    control,
    handleSubmit: reactHookFormSubmit,
  } = carePlanForm;

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
  const serviceTypeSelectOptions = useMemo(
    () => serviceTypeOptions.map((type) => ({ value: type.value, label: type.label })),
    []
  );

  const planTypeSelectOptions = useMemo(
    () => planTypeOptions.map((type) => ({ value: type.value, label: type.label })),
    []
  );

  const certificationStatusSelectOptions = useMemo(
    () =>
      certificationStatusOptions.map((status) => ({ value: status.value, label: status.label })),
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

  // Goal management
  const addGoal = useCallback(() => {
    updateField('goals', [...formData.goals, '']);
  }, [formData.goals, updateField]);

  const updateGoal = useCallback(
    (index: number, value: string) => {
      const newGoals = [...formData.goals];
      newGoals[index] = value;
      updateField('goals', newGoals);
    },
    [formData.goals, updateField]
  );

  const removeGoal = useCallback(
    (index: number) => {
      if (formData.goals.length > 1) {
        const newGoals = formData.goals.filter((_, i) => i !== index);
        updateField('goals', newGoals);
      }
    },
    [formData.goals, updateField]
  );

  // Service management
  const addService = useCallback(() => {
    const newService: CarePlanServiceFormData = {
      serviceName: '',
      serviceType: 'home_care',
      frequency: '',
      duration: '',
      provider: '',
      startDate: '',
      endDate: '',
      notes: '',
    };
    updateField('services', [...formData.services, newService]);
  }, [formData.services, updateField]);

  const updateService = useCallback(
    (index: number, field: keyof CarePlanServiceFormData, value: string) => {
      const newServices = [...formData.services];
      newServices[index] = { ...newServices[index], [field]: value };
      updateField('services', newServices);
    },
    [formData.services, updateField]
  );

  const removeService = useCallback(
    (index: number) => {
      if (formData.services.length > 1) {
        const newServices = formData.services.filter((_, i) => i !== index);
        updateField('services', newServices);
      }
    },
    [formData.services, updateField]
  );

  const isNetworkError = error?.includes('ネットワークエラー');

  return (
    <div className={`space-y-6 ${className}`}>
      <Form {...carePlanForm}>
        <form onSubmit={onFormSubmit} className="space-y-6">
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

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  プラン名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.planTitle}
                  onChange={(e) => updateField('planTitle', e.target.value)}
                  placeholder="例：2025年度 第1期ケアプラン"
                  disabled={isSubmitting || isSavingDraft}
                  className={`${fieldErrors.planTitle ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {fieldErrors.planTitle && (
                  <p className="text-sm text-red-600" role="alert">
                    {fieldErrors.planTitle.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    プラン種別 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => updateField('planType', value)}
                    value={formData.planType}
                    disabled={isSubmitting || isSavingDraft}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="プラン種別を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {planTypeSelectOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.planType && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.planType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    紹介 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="flex items-center space-x-4 p-3 h-10 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isReferral-true"
                        checked={formData.isReferral === true}
                        onCheckedChange={() => updateField('isReferral', true)}
                        disabled={isSubmitting || isSavingDraft}
                      />
                      <Label htmlFor="isReferral-true" className="cursor-pointer">
                        紹介あり
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isReferral-false"
                        checked={formData.isReferral === false}
                        onCheckedChange={() => updateField('isReferral', false)}
                        disabled={isSubmitting || isSavingDraft}
                      />
                      <Label htmlFor="isReferral-false" className="cursor-pointer">
                        紹介なし
                      </Label>
                    </div>
                  </div>
                  {fieldErrors.isReferral && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.isReferral?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  要介護度 <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => updateField('careLevel', value)}
                  value={formData.careLevel}
                  disabled={isSubmitting || isSavingDraft}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="要介護度を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {careLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.careLevel && (
                  <p className="text-sm text-red-600" role="alert">
                    {fieldErrors.careLevel.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    認定状況 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => updateField('certificationStatus', value)}
                    value={formData.certificationStatus}
                    disabled={isSubmitting || isSavingDraft}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="認定状況を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {certificationStatusSelectOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.certificationStatus && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.certificationStatus.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    認定日 <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    value={formData.certificationDate}
                    onChange={(value) => updateField('certificationDate', value)}
                    disabled={isSubmitting || isSavingDraft}
                    placeholder="認定日を選択してください"
                    className={`${fieldErrors.certificationDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {fieldErrors.certificationDate && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.certificationDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    認定有効開始日 <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    value={formData.certValidityStart}
                    onChange={(value) => updateField('certValidityStart', value)}
                    disabled={isSubmitting || isSavingDraft}
                    placeholder="認定有効開始日を選択してください"
                    className={`${fieldErrors.certValidityStart ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {fieldErrors.certValidityStart && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.certValidityStart.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    認定有効終了日 <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    value={formData.certValidityEnd}
                    onChange={(value) => updateField('certValidityEnd', value)}
                    disabled={isSubmitting || isSavingDraft}
                    placeholder="認定有効終了日を選択してください"
                    className={`${fieldErrors.certValidityEnd ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {fieldErrors.certValidityEnd && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.certValidityEnd.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="careManager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        ケアマネージャー <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <CareManagerCombobox
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="ケアマネージャーを選択または入力してください"
                          disabled={isSubmitting || isSavingDraft}
                          allowCustomValue={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="careManagerOffice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        事業所名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="例：こうべケアプランセンター"
                          disabled={isSubmitting || isSavingDraft}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  次回見直し日 <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  value={formData.nextReviewDate}
                  onChange={(value) => updateField('nextReviewDate', value)}
                  disabled={isSubmitting || isSavingDraft}
                  placeholder="次回見直し日を選択してください"
                  className={`${fieldErrors.nextReviewDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {fieldErrors.nextReviewDate && (
                  <p className="text-sm text-red-600" role="alert">
                    {fieldErrors.nextReviewDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Goals and Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                ケア目標
              </h3>

              {/* Goals */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    ケア目標 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addGoal}
                    disabled={isSubmitting || isSavingDraft}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    目標を追加
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.goals.map((goal, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={goal}
                        onChange={(e) => updateGoal(index, e.target.value)}
                        placeholder={`ケア目標 ${index + 1}`}
                        disabled={isSubmitting || isSavingDraft}
                        className="flex-1"
                      />
                      {formData.goals.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeGoal(index)}
                          disabled={isSubmitting || isSavingDraft}
                          className="px-2 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {fieldErrors.goals && (
                  <p className="text-sm text-red-600" role="alert">
                    {fieldErrors.goals.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Intentions and Opinions Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              意向・意見
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Intentions */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="residentIntention" className="text-sm font-medium text-gray-700">
                    利用者の生活に対する意向 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="residentIntention"
                    value={formData.residentIntention}
                    onChange={(e) => updateField('residentIntention', e.target.value)}
                    placeholder="利用者様ご本人の生活に対する希望や意向を記入してください"
                    disabled={isSubmitting || isSavingDraft}
                    className={`min-h-24 ${fieldErrors.residentIntention ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    rows={4}
                  />
                  {fieldErrors.residentIntention && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.residentIntention.message}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.residentIntention.length}/1000文字
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familyIntention" className="text-sm font-medium text-gray-700">
                    家族の生活に対する意向 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="familyIntention"
                    value={formData.familyIntention}
                    onChange={(e) => updateField('familyIntention', e.target.value)}
                    placeholder="ご家族の生活に対する希望や意向を記入してください"
                    disabled={isSubmitting || isSavingDraft}
                    className={`min-h-24 ${fieldErrors.familyIntention ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    rows={4}
                  />
                  {fieldErrors.familyIntention && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.familyIntention.message}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.familyIntention.length}/1000文字
                  </div>
                </div>
              </div>

              {/* Right Column - Opinions and Guidance */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="assessmentCommitteeOpinion"
                    className="text-sm font-medium text-gray-700"
                  >
                    介護認定審査会の意見及びサービスの種類の指定{' '}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="assessmentCommitteeOpinion"
                    value={formData.assessmentCommitteeOpinion}
                    onChange={(e) => updateField('assessmentCommitteeOpinion', e.target.value)}
                    placeholder="介護認定審査会からの意見やサービス種類の指定について記入してください"
                    disabled={isSubmitting || isSavingDraft}
                    className={`min-h-24 ${fieldErrors.assessmentCommitteeOpinion ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    rows={4}
                  />
                  {fieldErrors.assessmentCommitteeOpinion && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.assessmentCommitteeOpinion.message}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.assessmentCommitteeOpinion.length}/1000文字
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="comprehensiveGuidance"
                    className="text-sm font-medium text-gray-700"
                  >
                    総合的な援助の指針 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="comprehensiveGuidance"
                    value={formData.comprehensiveGuidance}
                    onChange={(e) => updateField('comprehensiveGuidance', e.target.value)}
                    placeholder="総合的な援助方針について記入してください"
                    disabled={isSubmitting || isSavingDraft}
                    className={`min-h-24 ${fieldErrors.comprehensiveGuidance ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    rows={4}
                  />
                  {fieldErrors.comprehensiveGuidance && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.comprehensiveGuidance.message}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.comprehensiveGuidance.length}/1000文字
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Consent Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              備考・同意確認
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                    備考
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="特記事項や注意点があれば記入してください"
                    disabled={isSubmitting || isSavingDraft}
                    className="min-h-24"
                    rows={4}
                  />
                  {fieldErrors.notes && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.notes.message}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {(formData.notes || '').length}/1000文字
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Consent */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    同意確認 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <Checkbox
                      id="consentObtained"
                      checked={formData.consentObtained}
                      onCheckedChange={(checked) =>
                        updateField('consentObtained', checked === true)
                      }
                      disabled={isSubmitting || isSavingDraft}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="consentObtained"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        施設サービス計画について説明を行い同意を得た
                      </Label>
                      <p className="text-xs text-gray-500">
                        利用者様及びご家族に対してケアプランの内容について十分に説明し、
                        同意を得た場合にチェックしてください。
                      </p>
                    </div>
                  </div>
                  {fieldErrors.consentObtained && (
                    <p className="text-sm text-red-600" role="alert">
                      {fieldErrors.consentObtained.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section (moved) */}
          <div className="space-y-4 hidden">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  備考
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="特記事項や注意点があれば記入してください"
                  disabled={isSubmitting || isSavingDraft}
                  className="min-h-24"
                  rows={4}
                />
                {fieldErrors.notes && (
                  <p className="text-sm text-red-600" role="alert">
                    {fieldErrors.notes.message}
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {(formData.notes || '').length}/1000文字
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                利用サービス <span className="text-red-500 ml-1">*</span>
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={addService}
                disabled={isSubmitting || isSavingDraft}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                サービスを追加
              </Button>
            </div>

            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-medium text-gray-800">サービス {index + 1}</h4>
                    {formData.services.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeService(index)}
                        disabled={isSubmitting || isSavingDraft}
                        className="text-red-600 hover:bg-red-50 border-red-300"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        削除
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          サービス名 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={service.serviceName}
                          onChange={(e) => updateService(index, 'serviceName', e.target.value)}
                          placeholder="例：訪問介護"
                          disabled={isSubmitting || isSavingDraft}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          サービス種別 <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={service.serviceType}
                          onValueChange={(value) => updateService(index, 'serviceType', value)}
                          disabled={isSubmitting || isSavingDraft}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="サービス種別を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTypeSelectOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            頻度 <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={service.frequency}
                            onChange={(e) => updateService(index, 'frequency', e.target.value)}
                            placeholder="例：週3回"
                            disabled={isSubmitting || isSavingDraft}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            時間 <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={service.duration}
                            onChange={(e) => updateService(index, 'duration', e.target.value)}
                            placeholder="例：1時間/回"
                            disabled={isSubmitting || isSavingDraft}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          提供事業者 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={service.provider}
                          onChange={(e) => updateService(index, 'provider', e.target.value)}
                          placeholder="例：ハートケアサービス"
                          disabled={isSubmitting || isSavingDraft}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            開始日 <span className="text-red-500">*</span>
                          </Label>
                          <DatePicker
                            value={service.startDate}
                            onChange={(value) => updateService(index, 'startDate', value)}
                            disabled={isSubmitting || isSavingDraft}
                            placeholder="開始日を選択してください"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">終了日</Label>
                          <DatePicker
                            value={service.endDate || ''}
                            onChange={(value) => updateService(index, 'endDate', value)}
                            disabled={isSubmitting || isSavingDraft}
                            placeholder="終了日を選択してください"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">メモ</Label>
                        <Textarea
                          value={service.notes || ''}
                          onChange={(e) => updateService(index, 'notes', e.target.value)}
                          placeholder="サービスに関する特記事項"
                          disabled={isSubmitting || isSavingDraft}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {fieldErrors.services && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.services.message}
              </p>
            )}
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
              {isSubmitting
                ? '保存中...'
                : mode === 'create'
                  ? 'ケアプランを作成'
                  : 'ケアプランを更新'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
