/**
 * Contact Form Hook
 *
 * Manages contact form state and validation
 * Now using the generic form hook for consistency
 */

import type { ContactFormData } from '@/validations/contact-validation';
import { contactFormSchema } from '@/validations/contact-validation';
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
  hasAlert: false,
  alertReason: '',
};

export const useContactForm = ({ onSubmit, initialData = {} }: UseContactFormOptions) => {
  return useGenericForm(initialFormData, {
    schema: contactFormSchema,
    initialData,
    onSubmit,
  });
};
