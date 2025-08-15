/**
 * Authentication Hook
 *
 * Custom hook for managing authentication state and operations
 */

import { authService } from '@/services/auth-service';
import type { AuthResponse, LoginCredentials, StaffSelectionResponse } from '@/types/auth';
import { useCallback, useState } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authData, setAuthData] = useState<AuthResponse | null>(null);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      if (response.token && response.facility) {
        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('auth_facility', JSON.stringify(response.facility));
        }
        setAuthData({
          success: true,
          token: response.token,
          facility: response.facility,
          message: response.message,
        });
      } else {
        setError(response.error || 'ログインに失敗しました');
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ログインに失敗しました';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectStaff = useCallback(
    async (token: string, staffId: string): Promise<StaffSelectionResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.selectStaff(token, staffId);

        if (response.success && response.staff) {
          // Store selected staff in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('selected_staff', JSON.stringify(response.staff));
          }
        } else {
          setError(response.error || 'スタッフ選択に失敗しました');
        }

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'スタッフ選択に失敗しました';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (token: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout(token);

      // Clear stored data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_facility');
        localStorage.removeItem('selected_staff');
        sessionStorage.removeItem('auth_token');
      }

      setAuthData(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ログアウトに失敗しました';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getStoredToken = useCallback((): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  }, []);

  const getStoredFacility = useCallback(() => {
    if (typeof window !== 'undefined') {
      const facilityStr = localStorage.getItem('auth_facility');
      return facilityStr ? JSON.parse(facilityStr) : null;
    }
    return null;
  }, []);

  const getStoredStaff = useCallback(() => {
    if (typeof window !== 'undefined') {
      const staffStr = localStorage.getItem('selected_staff');
      return staffStr ? JSON.parse(staffStr) : null;
    }
    return null;
  }, []);

  return {
    isLoading,
    error,
    authData,
    login,
    selectStaff,
    logout,
    clearError,
    getStoredToken,
    getStoredFacility,
    getStoredStaff,
  };
};
