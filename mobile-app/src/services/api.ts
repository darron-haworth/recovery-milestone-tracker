import { authService } from './auth';
import { storageService } from './storage';

import { FIREBASE_CONFIG } from '../config/firebase';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Development: local backend
  : 'https://recovery-milestone-tracker-default-rtdb.firebaseio.com'; // Production: Firebase

const API_TIMEOUT = 10000; // 10 seconds

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Error Types
export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Request Configuration
interface RequestConfig extends RequestInit {
  timeout?: number;
  requiresAuth?: boolean;
}

// API Service Class
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Create request with timeout
  private async requestWithTimeout(
    url: string, 
    config: RequestConfig
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  // Get auth token
  private async getAuthToken(): Promise<string | null> {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const token = await authService.getIdToken();
        return token;
      }
      return null;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  // Create headers
  private async createHeaders(config: RequestConfig): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    });

    // Add auth token if required
    if (config.requiresAuth !== false) {
      const token = await this.getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      } else if (__DEV__) {
        // Use dev token for development
        headers.set('Authorization', 'Bearer dev-token');
      }
    }

    return headers;
  }

  // Handle response
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode: string | undefined;

      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          errorCode = errorData.code;
        } catch {
          // Fallback to default error message
        }
      }

      throw new ApiError(errorMessage, response.status, errorCode);
    }

    if (isJson) {
      return response.json();
    }

    return response.text() as T;
  }

  // Generic request method
  async request<T>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.createHeaders(config);

      const response = await this.requestWithTimeout(url, {
        ...config,
        headers,
      });

      return await this.handleResponse<ApiResponse<T>>(response);
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // GET request
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Upload file
  async upload<T>(
    endpoint: string, 
    file: { uri: string; type: string; name: string }, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.createHeaders({ ...config, requiresAuth: true });
      
      // Remove Content-Type for multipart upload
      headers.delete('Content-Type');

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      const response = await this.requestWithTimeout(url, {
        ...config,
        method: 'POST',
        headers,
        body: formData,
      });

      return await this.handleResponse<ApiResponse<T>>(response);
    } catch (error) {
      console.error(`File upload failed for ${endpoint}:`, error);
      throw error instanceof ApiError ? error : new ApiError('Upload failed', 0);
    }
  }
}

// Create API service instance
export const apiService = new ApiService(API_BASE_URL, API_TIMEOUT);

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
    ME: '/api/auth/me',
    DELETE_ACCOUNT: '/api/auth/account',
  },
  
  // User
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    PRIVACY: '/api/user/privacy',
    STATS: '/api/user/stats',
    AVATAR: '/api/user/avatar',
  },
  
  // Friends
  FRIENDS: {
    LIST: '/api/friends',
    ADD: '/api/friends',
    REMOVE: (friendId: string) => `/api/friends/${friendId}`,
    REQUESTS: '/api/friends/requests',
    ACCEPT: (requestId: string) => `/api/friends/requests/${requestId}/accept`,
    DECLINE: (requestId: string) => `/api/friends/requests/${requestId}/decline`,
    SUGGESTIONS: '/api/friends/suggestions',
  },
  
  // Milestones
  MILESTONES: {
    LIST: '/api/milestones',
    CREATE: '/api/milestones',
    UPDATE: (id: string) => `/api/milestones/${id}`,
    DELETE: (id: string) => `/api/milestones/${id}`,
    ACHIEVE: (id: string) => `/api/milestones/${id}/achieve`,
    STANDARD: '/api/milestones/standard',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
    DELETE: (id: string) => `/api/notifications/${id}`,
    UNREAD_COUNT: '/api/notifications/unread-count',
    TEST: '/api/notifications/test',
  },
  
  // Health
  HEALTH: '/health',
} as const;


