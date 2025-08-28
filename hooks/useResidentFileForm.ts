/**
 * Resident File Form Hook
 *
 * Manages resident file form state and validation using React Hook Form
 */

import type { ResidentFileFormData } from '@/validations/resident-file-validation';
import { residentFileFormSchema } from '@/validations/resident-file-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseResidentFileFormOptions {
  onSubmit: (data: ResidentFileFormData, file?: File) => Promise<boolean>;
  defaultValues?: Partial<ResidentFileFormData>;
}

const defaultFormData: ResidentFileFormData = {
  category: 'other',
  fileName: '',
  description: '',
};

export const useResidentFileForm = ({
  onSubmit,
  defaultValues = {},
}: UseResidentFileFormOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const form = useForm<ResidentFileFormData>({
    resolver: zodResolver(residentFileFormSchema),
    defaultValues: { ...defaultFormData, ...defaultValues },
  });

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const isValid = await form.trigger();
      if (!isValid) {
        setIsSubmitting(false);
        return false;
      }

      const data = form.getValues();
      const success = await onSubmit(data);

      if (success) {
        form.reset();
      }

      setIsSubmitting(false);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    form,
    isSubmitting,
    error,
    handleSubmit,
    // Legacy compatibility
    formData: form.watch(),
    updateField: (field: keyof ResidentFileFormData, value: any) => {
      form.setValue(field, value);
    },
    fieldErrors: form.formState.errors,
  };
};
