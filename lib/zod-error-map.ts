/**
 * Zod Error Map for Japanese Messages
 *
 * Zodのデフォルトエラーメッセージを日本語に変換するマップ
 */

import { z } from 'zod';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === 'string') {
        return { message: '文字列を入力してください' };
      }
      if (issue.expected === 'number') {
        return { message: '数値を入力してください' };
      }
      if (issue.expected === 'boolean') {
        return { message: 'true または false を選択してください' };
      }
      return { message: `${issue.expected} 型の値を入力してください` };

    case z.ZodIssueCode.invalid_literal:
      return { message: `"${issue.expected}" を入力してください` };

    case z.ZodIssueCode.unrecognized_keys:
      return { message: `認識できないキー: ${issue.keys.join(', ')}` };

    case z.ZodIssueCode.invalid_union:
      return { message: '有効な値を選択してください' };

    case z.ZodIssueCode.invalid_union_discriminator:
      return { message: '有効なオプションを選択してください' };

    case z.ZodIssueCode.invalid_enum_value:
      return { message: `次の値から選択してください: ${issue.options.join(', ')}` };

    case z.ZodIssueCode.invalid_arguments:
      return { message: '引数が無効です' };

    case z.ZodIssueCode.invalid_return_type:
      return { message: '戻り値の型が無効です' };

    case z.ZodIssueCode.invalid_date:
      return { message: '有効な日付を入力してください' };

    case z.ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        return { message: '有効なメールアドレスを入力してください' };
      }
      if (issue.validation === 'url') {
        return { message: '有効なURLを入力してください' };
      }
      if (issue.validation === 'uuid') {
        return { message: '有効なUUIDを入力してください' };
      }
      if (issue.validation === 'regex') {
        return { message: '正しい形式で入力してください' };
      }
      if (issue.validation === 'cuid') {
        return { message: '有効なCUIDを入力してください' };
      }
      if (issue.validation === 'datetime') {
        return { message: '有効な日時を入力してください' };
      }
      return { message: '文字列の形式が正しくありません' };

    case z.ZodIssueCode.too_small:
      if (issue.type === 'array') {
        return { message: `最低${issue.minimum}個の項目が必要です` };
      }
      if (issue.type === 'string') {
        return { message: `最低${issue.minimum}文字入力してください` };
      }
      if (issue.type === 'number') {
        return { message: `${issue.minimum}以上の値を入力してください` };
      }
      return { message: `値が小さすぎます（最小: ${issue.minimum}）` };

    case z.ZodIssueCode.too_big:
      if (issue.type === 'array') {
        return { message: `最大${issue.maximum}個までです` };
      }
      if (issue.type === 'string') {
        return { message: `${issue.maximum}文字以内で入力してください` };
      }
      if (issue.type === 'number') {
        return { message: `${issue.maximum}以下の値を入力してください` };
      }
      return { message: `値が大きすぎます（最大: ${issue.maximum}）` };

    case z.ZodIssueCode.custom:
      return { message: 'カスタムバリデーションに失敗しました' };

    case z.ZodIssueCode.invalid_intersection_types:
      return { message: '交差型の値が無効です' };

    case z.ZodIssueCode.not_multiple_of:
      return { message: `${issue.multipleOf}の倍数である必要があります` };

    case z.ZodIssueCode.not_finite:
      return { message: '有限数を入力してください' };

    default:
      return { message: ctx.defaultError };
  }
};

// Zodにカスタムエラーマップを設定
export const setupZodErrorMap = () => {
  z.setErrorMap(customErrorMap);
};

export default customErrorMap;
