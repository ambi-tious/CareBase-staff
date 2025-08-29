/**
 * Resident Validation
 *
 * Zod schemas for resident forms and API requests
 */

import { z } from 'zod';

// 入居者基本情報フォームのスキーマ
export const residentBasicInfoSchema = z
  .object({
    name: z.string().min(1, '氏名は必須です').max(50, '氏名は50文字以内で入力してください'),
    furigana: z
      .string()
      .refine((val) => !val || /^[ァ-ヶー\s]*$/.test(val), 'フリガナはカタカナで入力してください')
      .optional(),
    dob: z.string().min(1, '生年月日は必須です'),
    age: z.string().optional(),
    sex: z.enum(['男', '女', 'その他'], {
      errorMap: () => ({ message: '性別は必須です' }),
    }),

    floorGroup: z.string().min(1, '所属フロア・グループは必須です'),
    unitTeam: z.string().min(1, '所属ユニット・チームは必須です'),
    roomInfo: z.string().min(1, '部屋情報は必須です'),
    admissionDate: z.string().optional(), // 入所日を必須から外す
    dischargeDate: z.string().optional(),
    status: z.enum(['入所前', '入所中', '退所', 'ー']).optional(),
    profileImage: z.string().optional(),

    notes: z.string().optional(), // 備考フィールドを追加
  })
  .refine(
    (data) => {
      if (data.dob && data.admissionDate) {
        const dobDate = new Date(data.dob);
        const admissionDate = new Date(data.admissionDate);
        return admissionDate > dobDate;
      }
      return true;
    },
    {
      message: '入所日は生年月日より後の日付を入力してください',
      path: ['admissionDate'],
    }
  )
  .refine(
    (data) => {
      // 退所日が入力されている場合は入所日より後である必要がある
      if (data.dischargeDate && data.admissionDate) {
        const admissionDate = new Date(data.admissionDate);
        const dischargeDate = new Date(data.dischargeDate);
        return dischargeDate >= admissionDate;
      }
      return true;
    },
    {
      message: '退所日は入所日以降の日付を入力してください',
      path: ['dischargeDate'],
    }
  );

export type ResidentBasicInfo = z.infer<typeof residentBasicInfoSchema>;

export const validateResidentBasicInfo = (data: unknown) => {
  return residentBasicInfoSchema.safeParse(data);
};

// エラーメッセージ定数
export const RESIDENT_ERROR_MESSAGES = {
  REQUIRED_NAME: '氏名は必須です',
  REQUIRED_DOB: '生年月日は必須です',
  REQUIRED_SEX: '性別は必須です',
  REQUIRED_FLOOR_GROUP: '所属フロア・グループは必須です',
  REQUIRED_UNIT_TEAM: '所属ユニット・チームは必須です',
  REQUIRED_ROOM_INFO: '部屋情報は必須です',
  INVALID_FURIGANA: 'フリガナはカタカナで入力してください',
  INVALID_ADMISSION_DATE: '入所日は生年月日より後の日付を入力してください',
  INVALID_DISCHARGE_DATE: '退所日は入所日以降の日付を入力してください',
  NAME_TOO_LONG: '氏名は50文字以内で入力してください',
} as const;
