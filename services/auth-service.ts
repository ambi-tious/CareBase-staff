/**
 * Authentication Service
 *
 * Service layer for authentication API calls
 * Compatible with CareBase-api endpoints
 */

import { apiClient } from '@/lib/axios';
import type { AuthResponse, LoginCredentials } from '@/types/auth';
import { AUTH_ENDPOINTS } from '@/types/auth';
import { AUTH_ERROR_MESSAGES } from '@/validations/auth-validation';
import axios from 'axios';

class AuthService {
  /**
   * Login with facility credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.FACILITY_LOGIN, credentials);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        if (status === 400) {
          return {
            success: false,
            error: errorData?.message || 'リクエストの形式が正しくありません',
          };
        }

        if (status === 401) {
          return {
            success: false,
            error: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
          };
        }

        if (status && status >= 500) {
          return {
            success: false,
            error: AUTH_ERROR_MESSAGES.SERVER_ERROR,
          };
        }
      }

      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }
}

export const authService = new AuthService();
