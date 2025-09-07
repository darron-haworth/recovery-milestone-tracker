import { STORAGE_KEYS } from '../constants';


// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000'  // Development: Android emulator localhost mapping
  : 'https://us-central1-recovery-milestone-tracker.cloudfunctions.net/api'; // Production: Firebase Functions

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
      // Get stored API token from secure storage (using secureStorage, not storageService)
      const { secureStorage } = await import('./storage');
      const token = await secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        return token;
      }
      
      // No token found - this means user is not properly authenticated
      console.log('⚠️ No API token found in storage');
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
      console.log('🔑 Token for API request:', token ? 'Present' : 'Missing');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
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
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
    DELETE_ACCOUNT: '/auth/account',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    PRIVACY: '/user/privacy',
    STATS: '/user/stats',
    AVATAR: '/user/avatar',
  },
  
  // Friends
  FRIENDS: {
    LIST: '/friends',
    ADD: '/friends',
    REMOVE: (friendId: string) => `/friends/${friendId}`,
    REQUESTS: '/friends/requests',
    ACCEPT: (requestId: string) => `/friends/requests/${requestId}/accept`,
    DECLINE: (requestId: string) => `/friends/requests/${requestId}/decline`,
    SUGGESTIONS: '/friends/suggestions',
  },
  
  // Milestones
  MILESTONES: {
    LIST: '/milestones',
    CREATE: '/milestones',
    UPDATE: (id: string) => `/milestones/${id}`,
    DELETE: (id: string) => `/milestones/${id}`,
    ACHIEVE: (id: string) => `/milestones/${id}/achieve`,
    STANDARD: '/milestones/standard',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
    UNREAD_COUNT: '/notifications/unread-count',
    TEST: '/notifications/test',
  },
  
  // Health
  HEALTH: '/health',
} as const;


