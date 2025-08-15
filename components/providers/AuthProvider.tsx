/**
 * Authentication Provider
 *
 * Provides authentication context to the entire application
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { createContext, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  facility: any | null;
  selectedStaff: any | null;
  isLoading: boolean;
  error: string | null;
  login: ReturnType<typeof useAuth>['login'];
  logout: ReturnType<typeof useAuth>['logout'];
  selectStaff: ReturnType<typeof useAuth>['selectStaff'];
  clearError: ReturnType<typeof useAuth>['clearError'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    isAuthenticated,
    facility,
    selectedStaff,
    isLoading,
    error,
    login,
    logout,
    selectStaff,
    clearError,
  } = useAuth();

  const contextValue: AuthContextType = {
    isAuthenticated,
    facility,
    selectedStaff,
    isLoading,
    error,
    login,
    logout,
    selectStaff,
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
