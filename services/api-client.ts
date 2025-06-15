import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const timeout = process.env.NEXT_PUBLIC_API_TIMEOUT ? parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT, 10) : 10000;
    
    this.client = axios.create({
      baseURL,
      timeout: isNaN(timeout) ? 10000 : timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('carebase_token');
      if (this.token) {
        this.setAuthHeader(this.token);
      }
    }

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private setAuthHeader(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('carebase_token', token);
    }
    this.setAuthHeader(token);
  }

  clearAuth() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('carebase_token');
    }
    delete this.client.defaults.headers.common['Authorization'];
  }

  getClient() {
    return this.client;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const apiClient = new ApiClient();
