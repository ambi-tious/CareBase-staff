/**
 * Resident Data Types
 *
 * Types for all resident-related information management
 */

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
