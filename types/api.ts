export interface ApiUser {
  id: string;
  name: string;
  email: string;
  facility_id: string;
  role: 'admin' | 'staff' | 'nurse';
  created_at: string;
  updated_at: string;
}

export interface ApiResident {
  id: string;
  facility_id: string;
  name: string;
  birth_date: string;
  adl_info: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: ApiUser;
  token: string;
}

export interface ApiError {
  error: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  facility_id: string;
  role?: 'admin' | 'staff' | 'nurse';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
