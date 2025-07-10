'use client';

import { useState, useCallback } from 'react';
import type { ResidentBasicInfo } from '@/components/2_molecules/forms/resident-basic-info-form';

interface UseResidentFormOptions {
  initialData?: Partial<ResidentBasicInfo>;
  onSubmit: (data: ResidentBasicInfo) => Promise<void>;
}

const initialFormData: ResidentBasicInfo = {
  name: '',
  furigana: '',
  dob: '',
  sex: '',
  careLevel: '',
  floorGroup: '',
  unitTeam: '',
  roomInfo: '',
  address: '',
  admissionDate: '',
};

export const useResidentForm = ({ initialData, onSubmit }: UseResidentFormOptions) => {
  const [formData, setFormData] = useState<ResidentBasicInfo>({
    ...initialFormData,
    ...initialData,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ResidentBasicInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback((data: ResidentBasicInfo): boolean => {
    const newErrors: Partial<Record<keyof ResidentBasicInfo, string>> = {};

    // Required field validation
    if (!data.name.trim()) {
      newErrors.name = '氏名は必須です';
    }

    if (!data.furigana.trim()) {
      newErrors.furigana = 'フリガナは必須です';
    }

    if (!data.dob) {
      newErrors.dob = '生年月日は必須です';
    }

    if (!data.sex) {
      newErrors.sex = '性別は必須です';
    }

    if (!data.careLevel) {
      newErrors.careLevel = '要介護度は必須です';
    }

    if (!data.admissionDate) {
      newErrors.admissionDate = '入所日は必須です';
    }

    if (!data.address.trim()) {
      newErrors.address = '住所は必須です';
    }

    // Format validation
    if (data.furigana && !/^[ァ-ヶー\s]+$/.test(data.furigana)) {
      newErrors.furigana = 'フリガナはカタカナで入力してください';
    }

    // Date validation
    if (data.dob && data.admissionDate) {
      const dobDate = new Date(data.dob);
      const admissionDate = new Date(data.admissionDate);
      if (admissionDate <= dobDate) {
        newErrors.admissionDate = '入所日は生年月日より後の日付を入力してください';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm(formData)) {
      return false;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);

  const resetForm = useCallback(() => {
    setFormData({ ...initialFormData, ...initialData });
    setErrors({});
  }, [initialData]);

  const isValid = useCallback(() => {
    return validateForm(formData);
  }, [formData, validateForm]);

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    handleSubmit,
    resetForm,
    isValid: isValid(),
  };
};