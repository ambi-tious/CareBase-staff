/**
 * Authentication Hook
 *
 * Manages authentication state and provides authentication functions
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  AuthState,
  AuthUser,
  SelectedStaff,
  LoginCredentials,
  AuthResponse,
  StaffSelectionResponse,
} from '@/types/auth';
import { validateLoginFormRelaxed } from '@/validations/auth-validation';
import { authService } from '@/services/auth-service';

const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  selectedStaff: null,
  isLoading: false,
  error: null,
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const token = localStorage.getItem('carebase_token');
        const user = localStorage.getItem('carebase_user');
        const selectedStaff = localStorage.getItem('carebase_selected_staff');

        if (token && user) {
          setAuthState({
            isAuthenticated: true,
            token,
            user: JSON.parse(user),
            selectedStaff: selectedStaff ? JSON.parse(selectedStaff) : null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        clearAuthState();
      }
    };

    loadAuthState();
  }, []);

  const clearAuthState = useCallback(() => {
    localStorage.removeItem('carebase_token');
    localStorage.removeItem('carebase_user');
    localStorage.removeItem('carebase_selected_staff');
    setAuthState(initialAuthState);
  }, []);

  const saveAuthState = useCallback((response: AuthResponse) => {
    if (response.token && response.user) {
      localStorage.setItem('carebase_token', response.token);
      localStorage.setItem('carebase_user', JSON.stringify(response.user));

      setAuthState({
        isAuthenticated: true,
        token: response.token,
        user: response.user,
        selectedStaff: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      // Validate credentials
      const validation = validateLoginFormRelaxed(credentials);
      if (!validation.success) {
        setAuthState((prev) => ({
          ...prev,
          error: validation.error?.errors[0]?.message || 'バリデーションエラーが発生しました',
          isLoading: false,
        }));
        return false;
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await authService.login(credentials);

        if (response.success) {
          saveAuthState(response);
          return true;
        } else {
          setAuthState((prev) => ({
            ...prev,
            error: response.error || 'ログインに失敗しました',
            isLoading: false,
          }));
          return false;
        }
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: 'ログイン中にエラーが発生しました。もう一度お試しください。',
          isLoading: false,
        }));
        return false;
      }
    },
    [saveAuthState]
  );

  const selectStaff = useCallback(
    async (staffId: string): Promise<boolean> => {
      if (!authState.token) {
        setAuthState((prev) => ({
          ...prev,
          error: 'ログイン情報が見つかりません',
        }));
        return false;
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await authService.selectStaff(authState.token, staffId);

        if (response.success && response.staff) {
          localStorage.setItem('carebase_selected_staff', JSON.stringify(response.staff));
          setAuthState((prev) => ({
            ...prev,
            selectedStaff: response.staff!,
            isLoading: false,
          }));
          return true;
        } else {
          setAuthState((prev) => ({
            ...prev,
            error: response.error || '職員選択に失敗しました',
            isLoading: false,
          }));
          return false;
        }
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: '職員選択中にエラーが発生しました。もう一度お試しください。',
          isLoading: false,
        }));
        return false;
      }
    },
    [authState.token]
  );

  const logout = useCallback(async (): Promise<void> => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    try {
      if (authState.token) {
        await authService.logout(authState.token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthState();
    }
  }, [authState.token, clearAuthState]);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    // State
    isAuthenticated: authState.isAuthenticated,
    token: authState.token,
    user: authState.user,
    selectedStaff: authState.selectedStaff,
    isLoading: authState.isLoading,
    error: authState.error,

    // Actions
    login,
    selectStaff,
    logout,
    clearError,
  };
};
