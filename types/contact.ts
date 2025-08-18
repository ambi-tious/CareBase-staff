/**
 * Contact Types
 *
 * Types for contact/family information management
 */

import type { ContactFormData } from '@/validations/contact-validation';

// API response types
export interface ContactCreateResponse {
  success: boolean;
  contact?: { id: string } & ContactFormData;
  error?: string;
}

// Form validation state
export interface ContactFormState {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<string, string>>;
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
