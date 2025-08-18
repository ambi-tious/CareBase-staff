/**
 * Medication Status Types
 *
 * Types for medication status management
 */

// Medication status entity type
export interface MedicationStatus {
  id: string;
  date: string;
  content: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface MedicationStatusCreateResponse {
  success: boolean;
  medicationStatus?: MedicationStatus;
  error?: string;
}

export interface MedicationStatusUpdateResponse {
  success: boolean;
  medicationStatus?: MedicationStatus;
  error?: string;
}

export interface MedicationStatusDeleteResponse {
  success: boolean;
  error?: string;
}

// Form validation state
export interface MedicationStatusFormState {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<string, string>>;
}
