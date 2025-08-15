/**
 * Authentication Types
 *
 * Types for authentication functionality compatible with CareBase-api
 * Reference: https://github.com/ambi-tious/CareBase-api/blob/main/docs/api/endpoints.md#認証-authentication
 */

// Base authentication credentials
export interface LoginCredentials {
  login_id: string;  // API expects login_id instead of facilityId
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
  facilityId: string;  // Keep this for backward compatibility
  login_id?: string;   // Add API response field
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

// Authentication state
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  selectedStaff: SelectedStaff | null;
  isLoading: boolean;
  error: string | null;
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
  STAFF_LOGOUT: '/api/v1/auth/staff/logout',
  STAFF_SELECT: '/api/v1/auth/staff/select',
  PASSWORD_REMINDER: '/api/v1/auth/staff/password-reminder',
  PASSWORD_RESET: '/api/v1/auth/staff/password-reset',
} as const;

// Authentication events
export type AuthEvent =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGIN_FAILURE'; payload: AuthError }
  | { type: 'LOGOUT' }
  | { type: 'STAFF_SELECT'; payload: SelectedStaff }
  | { type: 'CLEAR_ERROR' };

// Error codes
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STAFF_NOT_FOUND: 'STAFF_NOT_FOUND',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;
