/**
 * Login Form Component
 *
 * Form component for facility login using the new authentication API
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import type { LoginCredentials } from '@/types/auth';
import { validateLoginForm } from '@/validations/auth-validation';
import { useState } from 'react';

interface LoginFormProps {
  onLoginSuccess?: (token: string) => void;
  onLoginError?: (error: string) => void;
}

export const LoginForm = ({ onLoginSuccess, onLoginError }: LoginFormProps) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    facilityId: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    facilityId?: string;
    password?: string;
  }>({});

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear API error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const validation = validateLoginForm(formData);
    
    if (!validation.success) {
      const errors: { facilityId?: string; password?: string } = {};
      
      validation.error.errors.forEach(err => {
        if (err.path.includes('facilityId')) {
          errors.facilityId = err.message;
        }
        if (err.path.includes('password')) {
          errors.password = err.message;
        }
      });
      
      setValidationErrors(errors);
      return false;
    }
    
    setValidationErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await login(formData);
      
      if (response.success && response.token) {
        onLoginSuccess?.(response.token);
      } else {
        onLoginError?.(response.error || 'ログインに失敗しました');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ログインに失敗しました';
      onLoginError?.(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="facilityId" className="block text-sm font-medium text-gray-700 mb-2">
            施設ID
          </label>
          <input
            id="facilityId"
            type="text"
            value={formData.facilityId}
            onChange={(e) => handleInputChange('facilityId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.facilityId ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="施設IDを入力してください"
            disabled={isLoading}
          />
          {validationErrors.facilityId && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.facilityId}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="パスワードを入力してください"
            disabled={isLoading}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ログイン中...
            </div>
          ) : (
            'ログイン'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          開発環境でのテスト用アカウント:
        </p>
        <p className="text-xs text-gray-500 mt-1">
          施設ID: admin / パスワード: password
        </p>
        <p className="text-xs text-gray-500">
          施設ID: demo / パスワード: demo
        </p>
      </div>
    </div>
  );
};
