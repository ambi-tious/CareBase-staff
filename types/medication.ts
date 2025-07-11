/**
 * Medication Types
 *
 * Types for medication information management
 */

import { z } from 'zod';

// Medication form data schema
export const medicationFormSchema = z
  .object({
    medicationName: z
      .string()
      .min(1, '薬剤名は必須です')
      .max(100, '薬剤名は100文字以内で入力してください'),
    dosageInstructions: z
      .string()
      .min(1, '用法・用量は必須です')
      .max(200, '用法・用量は200文字以内で入力してください'),
    startDate: z
      .string()
      .min(1, '服用開始日は必須です')
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）'),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）')
      .optional()
      .or(z.literal('')),
    prescribingInstitution: z
      .string()
      .min(1, '処方医療機関は必須です')
      .max(100, '処方医療機関は100文字以内で入力してください'),
    notes: z.string().max(500, 'メモは500文字以内で入力してください').optional(),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate;
    },
    {
      message: '服用終了日は服用開始日以降の日付を入力してください',
      path: ['endDate'],
    }
  );

export type MedicationFormData = z.infer<typeof medicationFormSchema>;

// Medication entity type
export interface Medication {
  id: string;
  medicationName: string;
  dosageInstructions: string;
  startDate: string;
  endDate?: string;
  prescribingInstitution: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface MedicationCreateResponse {
  success: boolean;
  medication?: Medication;
  error?: string;
}

export interface MedicationUpdateResponse {
  success: boolean;
  medication?: Medication;
  error?: string;
}

export interface MedicationDeleteResponse {
  success: boolean;
  error?: string;
}

// Form validation state
export interface MedicationFormState {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof MedicationFormData, string>>;
}
