/**
 * Care Plan Validation
 *
 * Zod schemas for care plan forms and API requests
 */

import { z } from 'zod';

// Care plan service schema
export const carePlanServiceSchema = z.object({
  serviceName: z
    .string()
    .min(1, 'サービス名は必須です')
    .max(100, 'サービス名は100文字以内で入力してください'),
  serviceType: z.enum(['home_care', 'day_service', 'short_stay', 'other'], {
    required_error: 'サービス種別は必須です',
  }),
  frequency: z
    .string()
    .min(1, '頻度は必須です')
    .max(50, '頻度は50文字以内で入力してください'),
  duration: z
    .string()
    .min(1, '時間は必須です')
    .max(50, '時間は50文字以内で入力してください'),
  provider: z
    .string()
    .min(1, '提供事業者は必須です')
    .max(100, '提供事業者は100文字以内で入力してください'),
  startDate: z
    .string()
    .min(1, '開始日は必須です')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）')
    .optional()
    .or(z.literal('')),
  notes: z.string().max(500, 'メモは500文字以内で入力してください').optional(),
});

// Care plan form data schema
export const carePlanFormSchema = z
  .object({
    planTitle: z
      .string()
      .min(1, 'プラン名は必須です')
      .max(100, 'プラン名は100文字以内で入力してください'),
    careLevel: z.string().min(1, '要介護度は必須です'),
    certificationDate: z
      .string()
      .min(1, '認定日は必須です')
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）'),
    certValidityStart: z
      .string()
      .min(1, '認定有効開始日は必須です')
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）'),
    certValidityEnd: z
      .string()
      .min(1, '認定有効終了日は必須です')
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）'),
    careManager: z
      .string()
      .min(1, 'ケアマネージャー名は必須です')
      .max(50, 'ケアマネージャー名は50文字以内で入力してください'),
    careManagerOffice: z
      .string()
      .min(1, '事業所名は必須です')
      .max(100, '事業所名は100文字以内で入力してください'),
    nextReviewDate: z
      .string()
      .min(1, '次回見直し日は必須です')
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）'),
    goals: z.array(z.string().min(1, 'ケア目標を入力してください')).min(1, 'ケア目標は1つ以上入力してください'),
    services: z.array(carePlanServiceSchema).min(1, 'サービスは1つ以上登録してください'),
    notes: z.string().max(1000, 'メモは1000文字以内で入力してください').optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.certValidityStart);
      const endDate = new Date(data.certValidityEnd);
      return endDate > startDate;
    },
    {
      message: '認定有効終了日は開始日より後の日付を入力してください',
      path: ['certValidityEnd'],
    }
  )
  .refine(
    (data) => {
      const certDate = new Date(data.certificationDate);
      const startDate = new Date(data.certValidityStart);
      return startDate >= certDate;
    },
    {
      message: '認定有効開始日は認定日以降の日付を入力してください',
      path: ['certValidityStart'],
    }
  );

export type CarePlanFormData = z.infer<typeof carePlanFormSchema>;
export type CarePlanServiceFormData = z.infer<typeof carePlanServiceSchema>;

// バリデーションヘルパー関数
export const validateCarePlanForm = (data: unknown) => {
  return carePlanFormSchema.safeParse(data);
};

export const validateCarePlanService = (data: unknown) => {
  return carePlanServiceSchema.safeParse(data);
};

// エラーメッセージ定数
export const CARE_PLAN_ERROR_MESSAGES = {
  REQUIRED_PLAN_TITLE: 'プラン名は必須です',
  REQUIRED_CARE_LEVEL: '要介護度は必須です',
  REQUIRED_CERTIFICATION_DATE: '認定日は必須です',
  REQUIRED_CERT_VALIDITY_START: '認定有効開始日は必須です',
  REQUIRED_CERT_VALIDITY_END: '認定有効終了日は必須です',
  REQUIRED_CARE_MANAGER: 'ケアマネージャー名は必須です',
  REQUIRED_CARE_MANAGER_OFFICE: '事業所名は必須です',
  REQUIRED_NEXT_REVIEW_DATE: '次回見直し日は必須です',
  REQUIRED_GOALS: 'ケア目標は1つ以上入力してください',
  REQUIRED_SERVICES: 'サービスは1つ以上登録してください',
  INVALID_DATE_RANGE: '認定有効終了日は開始日より後の日付を入力してください',
  INVALID_CERT_DATE: '認定有効開始日は認定日以降の日付を入力してください',
  PLAN_TITLE_TOO_LONG: 'プラン名は100文字以内で入力してください',
  CARE_MANAGER_TOO_LONG: 'ケアマネージャー名は50文字以内で入力してください',
  CARE_MANAGER_OFFICE_TOO_LONG: '事業所名は100文字以内で入力してください',
  NOTES_TOO_LONG: 'メモは1000文字以内で入力してください',
} as const;