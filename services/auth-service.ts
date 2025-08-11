/**
 * Authentication Service
 *
 * Service layer for authentication API calls
 * Compatible with CareBase-api endpoints
 */

import type { AuthResponse, LoginCredentials, StaffSelectionResponse } from '@/types/auth';
import { AUTH_ENDPOINTS } from '@/types/auth';
import { AUTH_ERROR_MESSAGES } from '@/validations/auth-validation';

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Login with facility credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // For development, use mock authentication
      if (process.env.NODE_ENV) {
        return this.mockLogin(credentials);
      }

      const response = await fetch(`${this.baseUrl}${AUTH_ENDPOINTS.STAFF_LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
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
      if (process.env.NODE_ENV) {
        return this.mockSelectStaff(token, staffId);
      }

      const response = await fetch(`${this.baseUrl}/api/v1/auth/staff/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ staffId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Staff selection error:', error);
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
      if (process.env.NODE_ENV) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return;
      }

      await fetch(`${this.baseUrl}${AUTH_ENDPOINTS.STAFF_LOGOUT}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Mock login for development
   */
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication logic
    if (credentials.facilityId === 'admin' && credentials.password === 'password') {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'user-1',
          facilityId: credentials.facilityId,
          role: 'staff',
          permissions: ['read', 'write'],
        },
      };
    } else if (credentials.facilityId === 'demo' && credentials.password === 'demo') {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'user-2',
          facilityId: credentials.facilityId,
          role: 'staff',
          permissions: ['read'],
        },
      };
    }

    return {
      success: false,
      error: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
    };
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
      const response = await fetch(`${this.baseUrl}${AUTH_ENDPOINTS.PASSWORD_REMINDER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facilityId, email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      const response = await fetch(`${this.baseUrl}${AUTH_ENDPOINTS.PASSWORD_RESET}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
