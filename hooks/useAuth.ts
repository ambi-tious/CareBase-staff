/**
 * Authentication Hook
 *
 * Custom hook for managing authentication state and operations
 */

import { authService } from '@/services/auth-service';
import type { AuthResponse, LoginCredentials } from '@/types/auth';
import { useCallback, useEffect, useState } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  facility: any | null;
  selectedStaff: any | null;
}

// 開発環境用のモックデータ
const MOCK_AUTH_DATA = {
  admin: {
    password: 'password',
    token: 'mock-jwt-token-admin-12345',
    facility: {
      id: 'admin-facility',
      name: '管理者施設',
      login_id: 'admin',
    },
  },
  demo: {
    password: 'demo',
    token: 'mock-jwt-token-demo-67890',
    facility: {
      id: 'demo-facility',
      name: 'デモ施設',
      login_id: 'demo',
    },
  },
};

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

  // 開発環境用のモック認証関数
  const mockLogin = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      setLoading(true);
      setError(null);

      // 開発環境でのモック認証
      const mockData = MOCK_AUTH_DATA[credentials.login_id as keyof typeof MOCK_AUTH_DATA];

      if (mockData && mockData.password === credentials.password) {
        // モック認証成功
        const response = {
          success: true,
          token: mockData.token,
          facility: mockData.facility,
          message: '開発環境でのモック認証に成功しました',
        };

        // Store in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('auth_facility', JSON.stringify(response.facility));
        }

        // Update state
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          token: response.token,
          facility: response.facility,
          error: null,
        }));

        console.log('🔧 開発環境: モック認証成功', {
          login_id: credentials.login_id,
          facility: response.facility,
        });

        return response;
      } else {
        // モック認証失敗
        const errorMessage =
          '開発環境: 無効な認証情報です。admin/password または demo/demo を使用してください。';
        setError(errorMessage);

        console.warn('🔧 開発環境: モック認証失敗', {
          login_id: credentials.login_id,
          providedPassword: credentials.password,
        });

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [setLoading, setError]
  );

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      // 開発環境の場合はモック認証を使用
      if (!process.env.NEXT_PUBLIC_API_URL) {
        return mockLogin(credentials);
      }

      // 本番環境では通常の認証APIを使用
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
    [setLoading, setError, mockLogin]
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
    logout,
    clearError,

    // Utilities
    getStoredToken,
    getStoredFacility,
    getStoredStaff,
  };
};
