/**
 * RPC Types
 * 
 * Common types for RPC communication with CareBase-api
 * Ensures consistent data structures across frontend and backend
 */

// Base RPC request/response structure
export interface RPCRequest<T = any> {
  method: string;
  params: T;
  id?: string;
  timestamp?: string;
}

export interface RPCResponse<T = any> {
  success: boolean;
  data?: T;
  error?: RPCError;
  id?: string;
  timestamp?: string;
}

export interface RPCError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Common status codes
export const RPC_STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Common error codes for authentication
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'AUTH_001',
  FACILITY_NOT_FOUND: 'AUTH_002',
  ACCOUNT_LOCKED: 'AUTH_003',
  PASSWORD_EXPIRED: 'AUTH_004',
  INVALID_TOKEN: 'AUTH_005',
  TOKEN_EXPIRED: 'AUTH_006',
  STAFF_NOT_FOUND: 'AUTH_007',
  INSUFFICIENT_PERMISSIONS: 'AUTH_008',
} as const;

// Validation error structure
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common metadata
export interface ResourceMetadata {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

// Common filter/sort options
export interface FilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Health check response
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: Record<string, 'up' | 'down'>;
}

// API versioning
export const API_VERSION = 'v1' as const;
export const API_BASE_URL = '/api/v1' as const;

// Common HTTP methods
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request headers
export interface RequestHeaders {
  'Content-Type'?: string;
  'Authorization'?: string;
  'X-API-Version'?: string;
  'X-Request-ID'?: string;
}