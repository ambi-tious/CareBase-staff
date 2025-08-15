/**
 * Authentication Hook
 *
 * Custom hook for managing authentication state and operations
 */

import { authService } from '@/services/auth-service';
import type { AuthResponse, LoginCredentials, StaffSelectionResponse } from '@/types/auth';
import { useCallback, useEffect, useState } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  facility: any | null;
  selectedStaff: any | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,
    facility: null,
    selectedStaff: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('auth_token');
      const facilityStr = localStorage.getItem('auth_facility');
      const staffStr = localStorage.getItem('selected_staff');

      if (token && facilityStr) {
        try {
          const facility = JSON.parse(facilityStr);
          const selectedStaff = staffStr ? JSON.parse(staffStr) : null;

          setState((prev) => ({
            ...prev,
            isAuthenticated: true,
            token,
            facility,
            selectedStaff,
          }));
        } catch (error) {
          console.error('Failed to parse stored auth data:', error);
          // Clear corrupted data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_facility');
          localStorage.removeItem('selected_staff');
        }
      }
    };

    initializeAuth();
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.login(credentials);

        if (response.token && response.facility) {
          // Store in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('auth_facility', JSON.stringify(response.facility));
          }

          // Update state
          setState((prev) => ({
            ...prev,
            isAuthenticated: true,
            token: response.token || null,
            facility: response.facility || null,
            error: null,
          }));

          return {
            success: true,
            token: response.token,
            facility: response.facility,
            message: response.message,
          };
        } else {
          const errorMessage = response.error || 'ログインに失敗しました';
          setError(errorMessage);
          return {
            success: false,
            error: errorMessage,
          };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'ログインに失敗しました';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const selectStaff = useCallback(
    async (token: string, staffId: string): Promise<StaffSelectionResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.selectStaff(token, staffId);

        if (response.success && response.staff) {
          // Store selected staff
          if (typeof window !== 'undefined') {
            localStorage.setItem('selected_staff', JSON.stringify(response.staff));
          }

          // Update state
          setState((prev) => ({
            ...prev,
            selectedStaff: response.staff,
            error: null,
          }));

          return response;
        } else {
          const errorMessage = response.error || 'スタッフ選択に失敗しました';
          setError(errorMessage);
          return {
            success: false,
            error: errorMessage,
          };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'スタッフ選択に失敗しました';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const logout = useCallback(() => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_facility');
      localStorage.removeItem('selected_staff');
    }

    // Reset state
    setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,
      facility: null,
      selectedStaff: null,
    });
  }, []);

  const getStoredToken = useCallback((): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
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
    // State
    ...state,

    // Actions
    login,
    selectStaff,
    logout,
    clearError,

    // Utilities
    getStoredToken,
    getStoredFacility,
    getStoredStaff,
  };
};
