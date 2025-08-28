/**
 * Resident File Form Hook
 *
 * Manages resident file form state and validation
 */

import type { ResidentFileFormData } from '@/validations/resident-file-validation';
import { residentFileFormSchema } from '@/validations/resident-file-validation';
import { useGenericForm } from './useGenericForm';

interface UseResidentFileFormOptions {
  onSubmit: (data: ResidentFileFormData, file?: File) => Promise<boolean>;
  initialData?: Partial<ResidentFileFormData>;
}

const initialFormData: ResidentFileFormData = {
  category: 'other',
  fileName: '',
  description: '',
};

export const useResidentFileForm = ({ onSubmit, initialData = {} }: UseResidentFileFormOptions) => {
  return useGenericForm(initialFormData, {
    schema: residentFileFormSchema,
    initialData,
    onSubmit: async (data) => {
      // File is handled separately in the component
      return onSubmit(data);
    },
  });
};