/**
 * Contact Form Hook
 *
 * Manages contact form state and validation
 * Now using the generic form hook for consistency
 */

import type { ContactFormData } from '@/types/contact';
import { contactFormSchema } from '@/types/contact';
import { useGenericForm } from './useGenericForm';

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
};

export const useContactForm = ({ onSubmit, initialData = {} }: UseContactFormOptions) => {
  return useGenericForm(initialFormData, {
    schema: contactFormSchema,
    initialData,
    onSubmit,
  });
};
