import { apiClient } from './api-client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/api';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.getClient().post<AuthResponse>('/api/auth/login', credentials);
    
    apiClient.setToken(response.data.token);
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.getClient().post<AuthResponse>('/api/auth/register', userData);
    
    apiClient.setToken(response.data.token);
    
    return response.data;
  }

  logout() {
    apiClient.clearAuth();
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  getToken(): string | null {
    return apiClient.getToken();
  }
}

export const authService = new AuthService();
