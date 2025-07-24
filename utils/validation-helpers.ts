/**
 * Validation Helpers
 *
 * Common validation helper functions and utilities
 */

import { z } from 'zod';

// Common validation result type
export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// Generic validation function
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> => {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      isValid: true,
      data: result.data,
    };
  }

  const fieldErrors: Record<string, string> = {};
  let generalError = '';

  for (const error of result.error.errors) {
    if (error.path.length > 0) {
      fieldErrors[error.path.join('.')] = error.message;
    } else {
      generalError = error.message;
    }
  }

  return {
    isValid: false,
    error: generalError || '入力内容に誤りがあります',
    fieldErrors,
  };
};

// Real-time validation hook helper
export const createRealtimeValidator = <T>(schema: z.ZodSchema<T>, debounceMs: number = 300) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (data: unknown, callback: (result: ValidationResult<T>) => void) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const result = validateData(schema, data);
      callback(result);
    }, debounceMs);
  };
};

// Field-specific validation helpers
export const validateRequired = (value: any, fieldName: string) => {
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      error: `${fieldName}は必須です`,
    };
  }
  return { isValid: true };
};

export const validateMinLength = (value: string, minLength: number, fieldName: string) => {
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName}は${minLength}文字以上で入力してください`,
    };
  }
  return { isValid: true };
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string) => {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName}は${maxLength}文字以内で入力してください`,
    };
  }
  return { isValid: true };
};

export const validatePattern = (
  value: string,
  pattern: RegExp,
  fieldName: string,
  message?: string
) => {
  if (!pattern.test(value)) {
    return {
      isValid: false,
      error: message || `${fieldName}の形式が正しくありません`,
    };
  }
  return { isValid: true };
};

// Async validation helper
export const validateAsync = async <T>(
  validateFn: (data: T) => Promise<boolean>,
  data: T,
  errorMessage: string
): Promise<ValidationResult<T>> => {
  try {
    const isValid = await validateFn(data);
    return {
      isValid,
      data: isValid ? data : undefined,
      error: isValid ? undefined : errorMessage,
    };
  } catch {
    return {
      isValid: false,
      error: errorMessage,
    };
  }
};

// Form validation state manager
export interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

export const createFormValidationState = (): FormValidationState => ({
  isValid: false,
  errors: {},
  touched: {},
  isSubmitting: false,
});

export const updateFormValidationState = (
  state: FormValidationState,
  field: string,
  error: string | null,
  touched: boolean = true
): FormValidationState => {
  const newErrors = { ...state.errors };
  const newTouched = { ...state.touched };

  if (error) {
    newErrors[field] = error;
  } else {
    delete newErrors[field];
  }

  newTouched[field] = touched;

  return {
    ...state,
    errors: newErrors,
    touched: newTouched,
    isValid: Object.keys(newErrors).length === 0,
  };
};

// Common validation patterns
export const VALIDATION_PATTERNS = {
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHANUMERIC_UNDERSCORE: /^[a-zA-Z0-9_]+$/,
  ALPHANUMERIC_HYPHEN: /^[a-zA-Z0-9-]+$/,
  ALPHANUMERIC_UNDERSCORE_HYPHEN: /^[a-zA-Z0-9_-]+$/,
  JAPANESE_NAME: /^[ぁ-んァ-ヶ一-龯々a-zA-Z\s]+$/,
  KATAKANA: /^[ァ-ヶ\s]+$/,
  HIRAGANA: /^[ぁ-ん\s]+$/,
  PHONE: /^[0-9\-\+\(\)\s]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DATE_YYYY_MM_DD: /^\d{4}-\d{2}-\d{2}$/,
  DATETIME_ISO: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
} as const;

// Validation message helpers
export const createValidationMessage = (
  field: string,
  rule: string,
  value?: string | number
): string | undefined => {
  const messages: Record<string, string> = {
    required: `${field}は必須です`,
    minLength: `${field}は${value}文字以上で入力してください`,
    maxLength: `${field}は${value}文字以内で入力してください`,
    pattern: `${field}の形式が正しくありません`,
    email: `有効なメールアドレスを入力してください`,
    phone: `有効な電話番号を入力してください`,
    date: `有効な日付を入力してください`,
    datetime: `有効な日時を入力してください`,
  };

  return messages[rule] || undefined;
};
