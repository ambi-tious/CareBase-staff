/**
 * Medication Types
 *
 * Types for medication information management
 */

// Medication entity type
export interface Medication {
  id: string;
  medicationName: string;
  dosageInstructions: string;
  startDate: string;
  endDate?: string;
  prescribingInstitution: string;
  notes?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface MedicationCreateResponse {
  success: boolean;
  medication?: Medication;
  error?: string;
}

export interface MedicationUpdateResponse {
  success: boolean;
  medication?: Medication;
  error?: string;
}

export interface MedicationDeleteResponse {
  success: boolean;
  error?: string;
}

// Form validation state
export interface MedicationFormState {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<string, string>>;
}
