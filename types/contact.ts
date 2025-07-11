/**
 * Contact Types
 *
 * Types for contact/family information management
 */

import { z } from 'zod';

// Contact form data schema
export const contactFormSchema = z.object({
  name: z.string().min(1, '氏名は必須です').max(50, '氏名は50文字以内で入力してください'),
  furigana: z.string().optional(),
  relationship: z.string().min(1, '続柄は必須です').max(30, '続柄は30文字以内で入力してください'),
  phone1: z
    .string()
    .min(1, '連絡先は必須です')
    .regex(/^[0-9\-\+\(\)\s]+$/, '有効な電話番号を入力してください'),
  phone2: z.string().optional(),
  email: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
  type: z.enum(['緊急連絡先', '連絡先', 'その他']),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// API response types
export interface ContactCreateResponse {
  success: boolean;
  contact?: ContactFormData & { id: string };
  error?: string;
}

// Form validation state
export interface ContactFormState {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof ContactFormData, string>>;
}

// Contact type options
export const contactTypeOptions = [
  { value: '緊急連絡先', label: '緊急連絡先' },
  { value: '連絡先', label: '連絡先' },
  { value: 'その他', label: 'その他' },
] as const;

// Relationship options
export const relationshipOptions = [
  { value: '配偶者', label: '配偶者' },
  { value: '長男', label: '長男' },
  { value: '長女', label: '長女' },
  { value: '次男', label: '次男' },
  { value: '次女', label: '次女' },
  { value: '三男', label: '三男' },
  { value: '三女', label: '三女' },
  { value: '父', label: '父' },
  { value: '母', label: '母' },
  { value: '兄', label: '兄' },
  { value: '姉', label: '姉' },
  { value: '弟', label: '弟' },
  { value: '妹', label: '妹' },
  { value: '孫', label: '孫' },
  { value: 'その他', label: 'その他' },
] as const;
