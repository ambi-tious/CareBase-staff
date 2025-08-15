/**
 * Authentication Service
 *
 * Service layer for authentication API calls
 * Compatible with CareBase-api endpoints
 */

import { apiClient } from '@/lib/axios';
import type { AuthResponse, LoginCredentials, StaffSelectionResponse } from '@/types/auth';
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

  /**
   * Select staff member after login
   */
  async selectStaff(token: string, staffId: string): Promise<StaffSelectionResponse> {
    try {
      // For development, use mock staff selection
      if (process.env.NODE_ENV === 'development') {
        return this.mockSelectStaff(token, staffId);
      }

      const response = await apiClient.post(
        AUTH_ENDPOINTS.STAFF_SELECT,
        { staffId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Staff selection error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return {
            success: false,
            error: AUTH_ERROR_MESSAGES.STAFF_NOT_FOUND,
          };
        }
      }
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<void> {
    try {
      // For development, just simulate logout
      if (process.env.NODE_ENV === 'development') {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return;
      }

      await apiClient.post(
        AUTH_ENDPOINTS.STAFF_LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Mock staff selection for development
   */
  private async mockSelectStaff(token: string, staffId: string): Promise<StaffSelectionResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock staff data - in production, this would come from the API
    const mockStaffData = {
      'staff-001': {
        id: 'staff-001',
        name: '田中 花子',
        furigana: 'タナカ ハナコ',
        role: '介護職員',
        employeeId: 'EMP001',
        facilityId: 'admin',
        groupId: 'group-1',
        teamId: 'team-a1',
      },
      'staff-002': {
        id: 'staff-002',
        name: '佐藤 太郎',
        furigana: 'サトウ タロウ',
        role: '看護師',
        employeeId: 'EMP002',
        facilityId: 'admin',
        groupId: 'group-1',
        teamId: 'team-a1',
      },
    };

    const staff = mockStaffData[staffId as keyof typeof mockStaffData];

    if (staff) {
      return {
        success: true,
        staff,
      };
    }

    return {
      success: false,
      error: AUTH_ERROR_MESSAGES.STAFF_NOT_FOUND,
    };
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(
    facilityId: string,
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.PASSWORD_REMINDER, {
        facilityId,
        email,
      });
      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.PASSWORD_RESET, {
        token,
        newPassword,
      });
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: AUTH_ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }
}

export const authService = new AuthService();
