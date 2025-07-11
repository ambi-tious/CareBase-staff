import {
  createFormValidationState,
  createRealtimeValidator,
  createValidationMessage,
  updateFormValidationState,
  validateAsync,
  validateData,
  validateMaxLength,
  validateMinLength,
  validatePattern,
  validateRequired,
  VALIDATION_PATTERNS,
} from '@/utils/validation-helpers';
import { vi } from 'vitest';
import { z } from 'zod';

describe('バリデーションヘルパー', () => {
  describe('validateData', () => {
    const testSchema = z.object({
      name: z.string({ required_error: '名前は必須です' }).min(1, '名前は必須です'),
      email: z
        .string({ required_error: 'メールアドレスは必須です' })
        .min(1, 'メールアドレスは必須です')
        .email('有効なメールアドレスを入力してください'),
      age: z
        .number({ required_error: '年齢は0以上である必要があります' })
        .min(0, '年齢は0以上である必要があります'),
    });

    it('正しいデータに対して有効な結果を返す', () => {
      const data = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        age: 30,
      };

      const result = validateData(testSchema, data);

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.error).toBeUndefined();
      expect(result.fieldErrors).toBeUndefined();
    });

    it('不正なデータに対して無効な結果を返す', () => {
      const data = {
        name: '',
        email: 'invalid-email',
        age: -5,
      };

      const result = validateData(testSchema, data);

      expect(result.isValid).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBe('バリデーションエラーが発生しました');
      expect(result.fieldErrors).toEqual({
        name: '名前は必須です',
        email: '有効なメールアドレスを入力してください',
        age: '年齢は0以上である必要があります',
      });
    });

    it('空のオブジェクトを処理する', () => {
      const result = validateData(testSchema, {});

      expect(result.isValid).toBe(false);
      expect(result.fieldErrors).toEqual({
        name: '名前は必須です',
        email: 'メールアドレスは必須です',
        age: '年齢は0以上である必要があります',
      });
    });
  });

  describe('createRealtimeValidator', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('バリデーション呼び出しをデバウンスする', () => {
      const schema = z.string().min(1);
      const validator = createRealtimeValidator(schema, 300);
      const callback = vi.fn();

      validator('test', callback);
      validator('test2', callback);
      validator('test3', callback);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        isValid: true,
        data: 'test3',
      });
    });

    it('前のタイムアウトをクリアする', () => {
      const schema = z.string().min(1);
      const validator = createRealtimeValidator(schema, 300);
      const callback = vi.fn();

      validator('test', callback);
      vi.advanceTimersByTime(200);
      validator('test2', callback);
      vi.advanceTimersByTime(100);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        isValid: true,
        data: 'test2',
      });
    });
  });

  describe('validateRequired', () => {
    it('空でない値に対して有効を返す', () => {
      expect(validateRequired('test', '名前')).toEqual({ isValid: true });
      expect(validateRequired(0, '数値')).toEqual({ isValid: true });
      expect(validateRequired(false, '真偽値')).toEqual({ isValid: true });
    });

    it('空の値に対して無効を返す', () => {
      expect(validateRequired('', '名前')).toEqual({
        isValid: false,
        error: '名前は必須です',
      });
      expect(validateRequired(null, '名前')).toEqual({
        isValid: false,
        error: '名前は必須です',
      });
      expect(validateRequired(undefined, '名前')).toEqual({
        isValid: false,
        error: '名前は必須です',
      });
    });
  });

  describe('validateMinLength', () => {
    it('十分な長さの文字列に対して有効を返す', () => {
      expect(validateMinLength('test', 3, '名前')).toEqual({ isValid: true });
      expect(validateMinLength('test', 4, '名前')).toEqual({ isValid: true });
    });

    it('短すぎる文字列に対して無効を返す', () => {
      expect(validateMinLength('te', 3, '名前')).toEqual({
        isValid: false,
        error: '名前は3文字以上で入力してください',
      });
    });
  });

  describe('validateMaxLength', () => {
    it('長さ制限内の文字列に対して有効を返す', () => {
      expect(validateMaxLength('test', 5, '名前')).toEqual({ isValid: true });
      expect(validateMaxLength('test', 4, '名前')).toEqual({ isValid: true });
    });

    it('長すぎる文字列に対して無効を返す', () => {
      expect(validateMaxLength('testing', 5, '名前')).toEqual({
        isValid: false,
        error: '名前は5文字以内で入力してください',
      });
    });
  });

  describe('validatePattern', () => {
    it('一致するパターンに対して有効を返す', () => {
      expect(validatePattern('test123', /^[a-zA-Z0-9]+$/, 'ユーザー名')).toEqual({
        isValid: true,
      });
    });

    it('一致しないパターンに対して無効を返す', () => {
      expect(validatePattern('test@123', /^[a-zA-Z0-9]+$/, 'ユーザー名')).toEqual({
        isValid: false,
        error: 'ユーザー名の形式が正しくありません',
      });
    });

    it('カスタムエラーメッセージが提供された場合それを使用する', () => {
      expect(
        validatePattern('test@123', /^[a-zA-Z0-9]+$/, 'ユーザー名', 'カスタムエラーメッセージ')
      ).toEqual({
        isValid: false,
        error: 'カスタムエラーメッセージ',
      });
    });
  });

  describe('validateAsync', () => {
    it('バリデーション成功に対して有効な結果を返す', async () => {
      const validateFn = vi.fn().mockResolvedValue(true);
      const data = { name: 'test' };

      const result = await validateAsync(validateFn, data, 'エラーメッセージ');

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.error).toBeUndefined();
      expect(validateFn).toHaveBeenCalledWith(data);
    });

    it('バリデーション失敗に対して無効な結果を返す', async () => {
      const validateFn = vi.fn().mockResolvedValue(false);
      const data = { name: 'test' };

      const result = await validateAsync(validateFn, data, 'エラーメッセージ');

      expect(result.isValid).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBe('エラーメッセージ');
    });

    it('バリデーションエラーを処理する', async () => {
      const validateFn = vi.fn().mockRejectedValue(new Error('Validation error'));
      const data = { name: 'test' };

      const result = await validateAsync(validateFn, data, 'エラーメッセージ');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('エラーメッセージ');
    });
  });

  describe('フォームバリデーション状態', () => {
    describe('createFormValidationState', () => {
      it('初期バリデーション状態を作成する', () => {
        const state = createFormValidationState();

        expect(state).toEqual({
          isValid: false,
          errors: {},
          touched: {},
          isSubmitting: false,
        });
      });
    });

    describe('updateFormValidationState', () => {
      it('状態にエラーを追加する', () => {
        const initialState = createFormValidationState();
        const updatedState = updateFormValidationState(initialState, 'name', '名前は必須です');

        expect(updatedState.errors).toEqual({ name: '名前は必須です' });
        expect(updatedState.touched).toEqual({ name: true });
        expect(updatedState.isValid).toBe(false);
      });

      it('状態からエラーを削除する', () => {
        const initialState = {
          isValid: false,
          errors: { name: '名前は必須です' },
          touched: { name: true },
          isSubmitting: false,
        };

        const updatedState = updateFormValidationState(initialState, 'name', null);

        expect(updatedState.errors).toEqual({});
        expect(updatedState.touched).toEqual({ name: true });
        expect(updatedState.isValid).toBe(true);
      });

      it('複数のフィールドを処理する', () => {
        const initialState = createFormValidationState();
        let state = updateFormValidationState(initialState, 'name', '名前は必須です');
        state = updateFormValidationState(state, 'email', 'メールアドレスは必須です');

        expect(state.errors).toEqual({
          name: '名前は必須です',
          email: 'メールアドレスは必須です',
        });
        expect(state.isValid).toBe(false);

        state = updateFormValidationState(state, 'name', null);

        expect(state.errors).toEqual({ email: 'メールアドレスは必須です' });
        expect(state.isValid).toBe(false);
      });
    });
  });

  describe('VALIDATION_PATTERNS', () => {
    it('正しいパターンを持つ', () => {
      expect(VALIDATION_PATTERNS.ALPHANUMERIC.test('abc123')).toBe(true);
      expect(VALIDATION_PATTERNS.ALPHANUMERIC.test('abc@123')).toBe(false);

      expect(VALIDATION_PATTERNS.EMAIL.test('test@example.com')).toBe(true);
      expect(VALIDATION_PATTERNS.EMAIL.test('invalid-email')).toBe(false);

      expect(VALIDATION_PATTERNS.JAPANESE_NAME.test('田中太郎')).toBe(true);
      expect(VALIDATION_PATTERNS.JAPANESE_NAME.test('Tanaka Taro')).toBe(true);
      expect(VALIDATION_PATTERNS.JAPANESE_NAME.test('田中@太郎')).toBe(false);

      expect(VALIDATION_PATTERNS.PHONE.test('090-1234-5678')).toBe(true);
      expect(VALIDATION_PATTERNS.PHONE.test('09012345678')).toBe(true);
      expect(VALIDATION_PATTERNS.PHONE.test('090-1234-5678@')).toBe(false);
    });
  });

  describe('createValidationMessage', () => {
    it('正しいバリデーションメッセージを作成する', () => {
      expect(createValidationMessage('名前', 'required')).toBe('名前は必須です');
      expect(createValidationMessage('名前', 'minLength', 3)).toBe(
        '名前は3文字以上で入力してください'
      );
      expect(createValidationMessage('名前', 'maxLength', 10)).toBe(
        '名前は10文字以内で入力してください'
      );
      expect(createValidationMessage('名前', 'pattern')).toBe('名前の形式が正しくありません');
      expect(createValidationMessage('メールアドレス', 'email')).toBe(
        '有効なメールアドレスを入力してください'
      );
    });

    it('未知のルールを処理する', () => {
      expect(createValidationMessage('名前', 'unknown' as any)).toBeUndefined();
    });
  });
});
