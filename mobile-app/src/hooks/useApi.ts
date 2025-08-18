import { useState, useCallback, useRef } from 'react';
import { apiService, ApiResponse, ApiError } from '../services/api';

// Hook state interface
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Hook options interface
interface UseApiOptions {
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Hook return interface
interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<ApiResponse<T> | null>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: string | null) => void;
}

// Default options
const DEFAULT_OPTIONS: UseApiOptions = {
  immediate: false,
  retryCount: 0,
  retryDelay: 1000,
};

export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Reset state
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
    retryCountRef.current = 0;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Set data manually
  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      success: true,
      error: null,
    }));
  }, []);

  // Set error manually
  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      success: false,
      loading: false,
    }));
  }, []);

  // Execute API call with retry logic
  const execute = useCallback(
    async (...args: any[]): Promise<ApiResponse<T> | null> => {
      try {
        setState(prev => ({
          ...prev,
          loading: true,
          error: null,
          success: false,
        }));

        const response = await apiCall(...args);

        if (response.success) {
          setState({
            data: response.data || null,
            loading: false,
            error: null,
            success: true,
          });

          opts.onSuccess?.(response.data);
          retryCountRef.current = 0;
          return response;
        } else {
          throw new ApiError(response.error || 'API request failed', 400);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Retry logic
        if (retryCountRef.current < opts.retryCount!) {
          retryCountRef.current++;
          
          setState(prev => ({
            ...prev,
            loading: false,
            error: `Retrying... (${retryCountRef.current}/${opts.retryCount})`,
          }));

          // Wait before retrying
          await new Promise(resolve => {
            timeoutRef.current = setTimeout(resolve, opts.retryDelay);
          });

          return execute(...args);
        }

        // Final error state
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          success: false,
        });

        opts.onError?.(errorMessage);
        retryCountRef.current = 0;
        return null;
      }
    },
    [apiCall, opts]
  );

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}

// Specialized hooks for common API patterns

// Hook for GET requests
export function useGet<T = any>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    () => apiService.get<T>(endpoint),
    [endpoint]
  );

  return useApi(apiCall, options);
}

// Hook for POST requests
export function usePost<T = any>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    (data?: any) => apiService.post<T>(endpoint, data),
    [endpoint]
  );

  return useApi(apiCall, options);
}

// Hook for PUT requests
export function usePut<T = any>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    (data?: any) => apiService.put<T>(endpoint, data),
    [endpoint]
  );

  return useApi(apiCall, options);
}

// Hook for DELETE requests
export function useDelete<T = any>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    () => apiService.delete<T>(endpoint),
    [endpoint]
  );

  return useApi(apiCall, options);
}

// Hook for file uploads
export function useUpload<T = any>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    (file: { uri: string; type: string; name: string }) => 
      apiService.upload<T>(endpoint, file),
    [endpoint]
  );

  return useApi(apiCall, options);
}

// Hook for paginated data
export function usePaginatedData<T = any>(
  endpoint: string,
  options: UseApiOptions = {}
): UseApiReturn<T[]> & {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  page: number;
} {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState<T[]>([]);

  const apiCall = useCallback(
    (pageNum: number = 1) => 
      apiService.get<T[]>(`${endpoint}?page=${pageNum}&limit=20`),
    [endpoint]
  );

  const { execute, ...state } = useApi(apiCall, options);

  const loadMore = useCallback(async () => {
    if (!hasMore || state.loading) return;

    const response = await execute(page + 1);
    if (response?.success && response.data) {
      setAllData(prev => [...prev, ...response.data]);
      setPage(page + 1);
      
      // Check if there are more pages
      if (response.pagination) {
        setHasMore(page + 1 < response.pagination.totalPages);
      } else {
        setHasMore(response.data.length === 20); // Assuming 20 is the limit
      }
    }
  }, [execute, page, hasMore, state.loading]);

  return {
    ...state,
    data: allData,
    loadMore,
    hasMore,
    page,
  };
}
