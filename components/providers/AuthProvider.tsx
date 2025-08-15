/**
 * Authentication Provider
 *
 * Provides authentication context to the entire application
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import type { SelectedStaff } from '@/types/auth';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  facility: any | null;
  selectedStaff: SelectedStaff | null;
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
    login,
    logout,
    selectStaff,
    clearError,
    isLoading,
    error,
    authData,
    getStoredToken,
    getStoredFacility,
    getStoredStaff,
  } = useAuth();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [facility, setFacility] = useState<any | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<SelectedStaff | null>(null);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = getStoredToken();
      const storedFacility = getStoredFacility();
      const storedStaff = getStoredStaff();

      if (token && storedFacility) {
        setIsAuthenticated(true);
        setFacility(storedFacility);
        if (storedStaff) {
          setSelectedStaff(storedStaff);
        }
      }
    };

    initializeAuth();
  }, [getStoredToken, getStoredFacility, getStoredStaff]);

  // Update authentication state when authData changes
  useEffect(() => {
    if (authData?.success && authData.token && authData.facility) {
      setIsAuthenticated(true);
      setFacility(authData.facility);
    } else if (!authData) {
      setIsAuthenticated(false);
      setFacility(null);
      setSelectedStaff(null);
    }
  }, [authData]);

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
