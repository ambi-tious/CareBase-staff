/**
 * Resident Data Types
 *
 * Types for all resident-related information management
 */

import { z } from 'zod';

// Home Care Office Types
export const homeCareOfficeFormSchema = z.object({
  businessName: z
    .string()
    .min(1, '事業所名は必須です')
    .max(100, '事業所名は100文字以内で入力してください'),
  careManager: z
    .string()
    .min(1, 'ケアマネージャー名は必須です')
    .max(50, 'ケアマネージャー名は50文字以内で入力してください'),
  phone: z
    .string()
    .min(1, '電話番号は必須です')
    .regex(/^[0-9\-\+\(\)\s]+$/, '有効な電話番号を入力してください'),
  fax: z
    .string()
    .regex(/^[0-9\-\+\(\)\s]*$/, '有効なFAX番号を入力してください')
    .optional()
    .or(z.literal('')),
  address: z.string().min(1, '住所は必須です').max(200, '住所は200文字以内で入力してください'),
  notes: z.string().optional(),
});

export type HomeCareOfficeFormData = z.infer<typeof homeCareOfficeFormSchema>;

// Medical Institution Types
export const medicalInstitutionFormSchema = z.object({
  institutionName: z
    .string()
    .min(1, '医療機関名は必須です')
    .max(100, '医療機関名は100文字以内で入力してください'),
  doctorName: z.string().min(1, '医師名は必須です').max(50, '医師名は50文字以内で入力してください'),
  phone: z
    .string()
    .min(1, '電話番号は必須です')
    .regex(/^[0-9\-\+\(\)\s]+$/, '有効な電話番号を入力してください'),
  fax: z
    .string()
    .regex(/^[0-9\-\+\(\)\s]*$/, '有効なFAX番号を入力してください')
    .optional()
    .or(z.literal('')),
  address: z.string().min(1, '住所は必須です').max(200, '住所は200文字以内で入力してください'),
  notes: z.string().optional(),
});

export type MedicalInstitutionFormData = z.infer<typeof medicalInstitutionFormSchema>;

// Medication Info Types
export const medicationInfoFormSchema = z.object({
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
  prescribingInstitution: z
    .string()
    .min(1, '処方医療機関は必須です')
    .max(100, '処方医療機関は100文字以内で入力してください'),
  institution: z
    .string()
    .min(1, '処方機関は必須です')
    .max(100, '処方機関は100文字以内で入力してください'),
  prescriptionDate: z
    .string()
    .min(1, '処方日は必須です')
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, '有効な日付を入力してください（YYYY/MM/DD）'),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type MedicationInfoFormData = z.infer<typeof medicationInfoFormSchema>;

// Medical History Types
export const medicalHistoryFormSchema = z
  .object({
    diseaseName: z
      .string()
      .min(1, '病名は必須です')
      .max(100, '病名は100文字以内で入力してください'),
    onsetDate: z
      .string()
      .min(1, '発症年月は必須です')
      .regex(/^\d{4}-\d{2}$/, '有効な年月を入力してください（YYYY-MM）'),
    treatmentStatus: z.enum(['治療中', '完治', '経過観察', 'その他'], {
      required_error: '治療状況は必須です',
      invalid_type_error: '有効な治療状況を選択してください',
    }),
    treatmentInstitution: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // 発症年月が過去の日付かチェック
      const onsetDate = new Date(data.onsetDate + '-01');
      const today = new Date();
      return onsetDate <= today;
    },
    {
      message: '発症年月は過去の日付を入力してください',
      path: ['onsetDate'],
    }
  );

export type MedicalHistoryFormData = z.infer<typeof medicalHistoryFormSchema>;

// Medication Status Types
export const medicationStatusFormSchema = z.object({
  date: z
    .string()
    .min(1, '登録日は必須です')
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, '有効な日付を入力してください（YYYY/MM/DD）'),
  content: z.string().min(1, '内容は必須です').max(500, '内容は500文字以内で入力してください'),
  notes: z.string().optional(),
});

export type MedicationStatusFormData = z.infer<typeof medicationStatusFormSchema>;

// Form state types
export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Record<string, string | undefined>;
}

// Common form options
export interface FormOptions<T> {
  onSubmit: (data: T) => Promise<boolean>;
  initialData?: Partial<T>;
}
