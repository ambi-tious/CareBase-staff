/**
 * Contact Form Hook
 *
 * React Hook Formベースのコンタクトフォーム管理フック
 */

import type { ContactFormData } from '@/validations/contact-validation';
import { contactFormSchema } from '@/validations/contact-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

interface UseContactFormOptions {
  onSubmit: (data: ContactFormData) => Promise<boolean>;
  initialData?: Partial<ContactFormData>;
}

const initialFormData: ContactFormData = {
  name: '',
  furigana: '',
  relationship: '',
  phone1: '',
  phone2: '',
  email: '',
  address: '',
  notes: '',
  type: '連絡先',
  hasAlert: false,
  alertReason: '',
};

export const useContactForm = ({ onSubmit, initialData = {} }: UseContactFormOptions) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      ...initialFormData,
      ...initialData,
    },
    mode: 'onChange',
  });

  const { watch, setValue } = form;
  const formData = watch();

  // Convenient method for updating fields
  const updateField = useCallback(
    (field: keyof ContactFormData, value: unknown) => {
      setValue(field, value as ContactFormData[keyof ContactFormData], {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  // Submit handler for backward compatibility
  const handleSubmit = useCallback(async () => {
    return new Promise<boolean>((resolve) => {
      form.handleSubmit(
        async (data) => {
          try {
            const success = await onSubmit(data);
            resolve(success);
            if (success) {
              form.reset();
            }
          } catch (error) {
            console.error('Form submission error:', error);
            resolve(false);
          }
        },
        () => {
          resolve(false);
        }
      )();
    });
  }, [form, onSubmit]);

  // Error handling for backward compatibility
  const fieldErrors = Object.keys(form.formState.errors).reduce(
    (acc, key) => {
      const error = form.formState.errors[key as keyof ContactFormData];
      if (error) {
        acc[key] = error.message || '';
      }
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    // React Hook Form methods
    ...form,

    // Form data
    formData,

    // Backward compatibility methods
    updateField,
    isSubmitting: form.formState.isSubmitting,
    error: null, // Can be extended for general form errors
    fieldErrors,
    handleSubmit,
    retry: handleSubmit,
  };
};
