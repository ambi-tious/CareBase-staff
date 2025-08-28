/**
 * Resident Data Validation
 *
 * Zod schemas for resident data forms and API requests
 */

import { z } from 'zod';

// Home Care Office Types
export const homeCareOfficeFormSchema = z.object({
  businessName: z
    .string()
    .min(1, '事業所名は必須です')
    .max(100, '事業所名は100文字以内で入力してください'),
  careManager: z.string().max(50, 'ケアマネージャー名は50文字以内で入力してください').optional(),
  phone: z
    .string()
    .regex(/^[0-9\-\+\(\)\s]+$/, '有効な電話番号を入力してください')
    .optional()
    .or(z.literal(''))
    .optional(),
  fax: z
    .string()
    .regex(/^[0-9\-\+\(\)\s]*$/, '有効なFAX番号を入力してください')
    .optional()
    .or(z.literal(''))
    .optional(),
  address: z.string().max(200, '住所は200文字以内で入力してください').optional(),
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

// バリデーションヘルパー関数
export const validateHomeCareOfficeForm = (data: unknown) => {
  return homeCareOfficeFormSchema.safeParse(data);
};

export const validateMedicalInstitutionForm = (data: unknown) => {
  return medicalInstitutionFormSchema.safeParse(data);
};

export const validateMedicationInfoForm = (data: unknown) => {
  return medicationInfoFormSchema.safeParse(data);
};

export const validateMedicalHistoryForm = (data: unknown) => {
  return medicalHistoryFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const RESIDENT_DATA_ERROR_MESSAGES = {
  // Home Care Office
  REQUIRED_BUSINESS_NAME: '事業所名は必須です',
  REQUIRED_CARE_MANAGER: 'ケアマネージャー名は必須です',
  REQUIRED_PHONE: '電話番号は必須です',
  REQUIRED_ADDRESS: '住所は必須です',
  BUSINESS_NAME_TOO_LONG: '事業所名は100文字以内で入力してください',
  CARE_MANAGER_TOO_LONG: 'ケアマネージャー名は50文字以内で入力してください',
  ADDRESS_TOO_LONG: '住所は200文字以内で入力してください',
  INVALID_PHONE: '有効な電話番号を入力してください',
  INVALID_FAX: '有効なFAX番号を入力してください',

  // Medical Institution
  REQUIRED_INSTITUTION_NAME: '医療機関名は必須です',
  REQUIRED_DOCTOR_NAME: '医師名は必須です',
  INSTITUTION_NAME_TOO_LONG: '医療機関名は100文字以内で入力してください',
  DOCTOR_NAME_TOO_LONG: '医師名は50文字以内で入力してください',

  // Medication Info
  REQUIRED_MEDICATION_NAME: '薬剤名は必須です',
  REQUIRED_DOSAGE_INSTRUCTIONS: '用法・用量は必須です',
  REQUIRED_START_DATE: '服用開始日は必須です',
  REQUIRED_PRESCRIBING_INSTITUTION: '処方医療機関は必須です',
  REQUIRED_INSTITUTION: '処方機関は必須です',
  REQUIRED_PRESCRIPTION_DATE: '処方日は必須です',
  MEDICATION_NAME_TOO_LONG: '薬剤名は100文字以内で入力してください',
  DOSAGE_INSTRUCTIONS_TOO_LONG: '用法・用量は200文字以内で入力してください',
  PRESCRIBING_INSTITUTION_TOO_LONG: '処方医療機関は100文字以内で入力してください',
  INSTITUTION_TOO_LONG: '処方機関は100文字以内で入力してください',
  INVALID_START_DATE: '有効な日付を入力してください（YYYY-MM-DD）',
  INVALID_PRESCRIPTION_DATE: '有効な日付を入力してください（YYYY/MM/DD）',

  // Medical History
  REQUIRED_DISEASE_NAME: '病名は必須です',
  REQUIRED_ONSET_DATE: '発症年月は必須です',
  REQUIRED_TREATMENT_STATUS: '治療状況は必須です',
  DISEASE_NAME_TOO_LONG: '病名は100文字以内で入力してください',
  INVALID_ONSET_DATE: '有効な年月を入力してください（YYYY-MM）',
  ONSET_DATE_FUTURE: '発症年月は過去の日付を入力してください',
} as const;
