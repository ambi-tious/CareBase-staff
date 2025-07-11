/**
 * Medication Status Types
 *
 * Types for medication status management
 */

import { z } from 'zod';

// Medication status form data schema
export const medicationStatusFormSchema = z
  .object({
    date: z
      .string()
      .min(1, '登録日は必須です')
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）'),
    content: z.string().min(1, '内容は必須です').max(500, '内容は500文字以内で入力してください'),
    notes: z.string().max(1000, 'メモは1000文字以内で入力してください').optional(),
  })
  .refine(
    (data) => {
      // 登録日が未来の日付でないかチェック
      const registrationDate = new Date(data.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // 今日の終わりまでは許可
      return registrationDate <= today;
    },
    {
      message: '登録日は今日以前の日付を入力してください',
      path: ['date'],
    }
  );

export type MedicationStatusFormData = z.infer<typeof medicationStatusFormSchema>;

// Medication status entity type
export interface MedicationStatus {
  id: string;
  date: string;
  content: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface MedicationStatusCreateResponse {
  success: boolean;
  medicationStatus?: MedicationStatus;
  error?: string;
}

export interface MedicationStatusUpdateResponse {
  success: boolean;
  medicationStatus?: MedicationStatus;
  error?: string;
}

export interface MedicationStatusDeleteResponse {
  success: boolean;
  error?: string;
}

// Form validation state
export interface MedicationStatusFormState {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof MedicationStatusFormData, string>>;
}
