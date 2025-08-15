/**
 * Authentication Types
 *
 * Types for authentication functionality compatible with CareBase-api
 * Reference: https://github.com/ambi-tious/CareBase-api/blob/main/docs/api/endpoints.md#認証-authentication
 */

// Base authentication credentials
export interface LoginCredentials {
  login_id: string;
  password: string;
}

// Login result type for handling both success and error cases
export interface LoginResult {
  success: boolean;
  error?: string;
}

// Authentication request/response types (RPC compatible)
export interface AuthRequest {
  login_id: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  facility?: Facility;
  message?: string;
  error?: string;
}

export interface Facility {
  id: string;
  name: string;
  login_id: string;
}

export interface AuthUser {
  id: string;
  facilityId: string;
  login_id?: string;
  role: 'staff' | 'admin';
  permissions: string[];
}

// Staff selection types
export interface StaffSelectionRequest {
  token: string;
  staffId: string;
}

export interface StaffSelectionResponse {
  success: boolean;
  staff?: SelectedStaff;
  error?: string;
}

export interface SelectedStaff {
  id: string;
  name: string;
  furigana: string;
  role: string;
  employeeId: string;
  facilityId: string;
  groupId?: string;
  teamId?: string;
}

// Form state types
export interface LoginFormState {
  login_id: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// Unified authentication state
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  facility: Facility | null;
  selectedStaff: SelectedStaff | null;
}

// Error types
export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// API endpoints (matching CareBase-api structure)
export const AUTH_ENDPOINTS = {
  FACILITY_LOGIN: '/v1/auth/facility/login',
  STAFF_LOGIN: '/api/v1/auth/staff/login',
  STAFF_SELECTION: '/api/v1/auth/staff/select',
  LOGOUT: '/api/v1/auth/logout',
} as const;

// Validation error type
export interface ValidationError {
  path: string[];
  message: string;
}

export interface ValidationResult {
  success: boolean;
  error?: {
    errors: ValidationError[];
  };
}
