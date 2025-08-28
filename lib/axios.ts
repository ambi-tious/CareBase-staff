/**
 * Axios Configuration
 *
 * Centralized HTTP client configuration with interceptors
 * for authentication and error handling
 */

import axios from 'axios';

// Function to get the appropriate base URL based on current port
const getBaseURL = () => {
  const defaultURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Check if we're running on port 8443
  if (typeof window !== 'undefined' && window.location.port === '8443') {
    // For other URLs, try to replace the port
    const urlParts = defaultURL.split(':');
    if (urlParts.length >= 3) {
      // Replace the port part
      urlParts[2] = urlParts[2].replace(/^\d+/, '8443');
      return urlParts.join(':');
    } else {
      return defaultURL + ':8443';
    }
  }

  return defaultURL;
};

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging for development
    if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging for development
    if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Debug logging for development
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
        config: {
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        },
      });
    }

    if (axios.isAxiosError(error) && error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          // Redirect to login page if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.error('Access forbidden:', error.response.data);
      }

      // Handle 500+ server errors
      if (error.response?.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
