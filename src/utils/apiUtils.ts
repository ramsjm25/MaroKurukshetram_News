// Comprehensive API utilities for dynamic data fetching
import apiClient from '../api/apiClient';

export interface ApiResponse<T> {
  status: number;
  message: string;
  result: T;
}

// Retry mechanism for API calls
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`API request failed (attempt ${i + 1}/${maxRetries}):`, error);
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
};

// Dynamic API service functions
export const dynamicApiService = {
  // 1. Languages - No parameters needed
  async getLanguages(): Promise<any[]> {
    try {
      const response = await retryRequest(async () => 
        await apiClient.get<ApiResponse<any[]>>('/news/languages')
      );
      return response.data.result || [];
    } catch (error: any) {
      console.error('Error fetching languages:', error);
      throw new Error('Failed to fetch languages. Please try again later.');
    }
  },

  // 2. Categories - Requires language_id
  async getCategories(language_id: string): Promise<any[]> {
    try {
      const response = await retryRequest(async () => 
        await apiClient.get<ApiResponse<any[]>>(`/news/categories?language_id=${language_id}`)
      );
      return response.data.result || [];
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw new Error(`Failed to fetch categories for language ${language_id}. Please try again later.`);
    }
  },

  // 3. States - Requires language_id
  async getStates(language_id: string): Promise<any[]> {
    try {
      const response = await retryRequest(async () => 
        await apiClient.get<ApiResponse<any[]>>(`/news/states?language_id=${language_id}`)
      );
      return response.data.result || [];
    } catch (error: any) {
      console.error('Error fetching states:', error);
      throw new Error(`Failed to fetch states for language ${language_id}. Please try again later.`);
    }
  },

  // 4. Districts - Requires language_id and state_id
  async getDistricts(language_id: string, state_id: string): Promise<any[]> {
    try {
      const response = await retryRequest(async () => 
        await apiClient.get<ApiResponse<any[]>>(`/news/districts?language_id=${language_id}&state_id=${state_id}`)
      );
      return response.data.result || [];
    } catch (error: any) {
      console.error('Error fetching districts:', error);
      throw new Error(`Failed to fetch districts for language ${language_id} and state ${state_id}. Please try again later.`);
    }
  },

  // 5. News by categories - Requires language_id, categoryIds, state_id, district_id
  async getNewsByCategories(params: {
    language_id: string;
    categoryIds: string;
    state_id: string;
    district_id: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      const response = await retryRequest(async () => 
        await apiClient.get<ApiResponse<any>>('/news/filter-multi-categories', {
          params: {
            language_id: params.language_id,
            categoryIds: params.categoryIds,
            state_id: params.state_id,
            district_id: params.district_id,
            page: params.page || 1,
            limit: params.limit || 10
          }
        })
      );
      return response.data.result || { items: [], totalPages: 0, currentPage: 1 };
    } catch (error: any) {
      console.error('Error fetching news by categories:', error);
      throw new Error('Failed to fetch news. Please try again later.');
    }
  }
};

// Cache management utilities
export const cacheUtils = {
  // Get cached data
  getCachedData: (key: string): any => {
    try {
      const cached = sessionStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  },

  // Set cached data
  setCachedData: (key: string, data: any, ttl: number = 24 * 60 * 60 * 1000): void => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl
      };
      sessionStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  },

  // Check if cached data is valid
  isCacheValid: (key: string): boolean => {
    try {
      const cached = sessionStorage.getItem(key);
      if (!cached) return false;
      
      const cacheData = JSON.parse(cached);
      const now = Date.now();
      return (now - cacheData.timestamp) < cacheData.ttl;
    } catch {
      return false;
    }
  },

  // Clear cache
  clearCache: (key?: string): void => {
    try {
      if (key) {
        sessionStorage.removeItem(key);
      } else {
        // Clear all cache keys related to our app
        const keys = Object.keys(sessionStorage);
        keys.forEach(k => {
          if (k.startsWith('languages-') || k.startsWith('categories-') || 
              k.startsWith('states-') || k.startsWith('districts-')) {
            sessionStorage.removeItem(k);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
};

// Data validation utilities
export const dataValidation = {
  // Validate language data
  validateLanguage: (lang: any): boolean => {
    return lang && 
           typeof lang.id === 'string' && 
           typeof lang.language_name === 'string' && 
           typeof lang.language_code === 'string';
  },

  // Validate category data
  validateCategory: (cat: any): boolean => {
    return cat && 
           typeof cat.id === 'string' && 
           typeof cat.category_name === 'string' && 
           typeof cat.language_id === 'string';
  },

  // Validate state data
  validateState: (state: any): boolean => {
    return state && 
           typeof state.id === 'string' && 
           typeof state.state_name === 'string' && 
           typeof state.language_id === 'string';
  },

  // Validate district data
  validateDistrict: (district: any): boolean => {
    return district && 
           typeof district.id === 'string' && 
           typeof district.name === 'string' && 
           typeof district.language_id === 'string' && 
           typeof district.state_id === 'string';
  },

  // Filter and validate array data
  filterValidData: <T>(data: any[], validator: (item: any) => boolean): T[] => {
    if (!Array.isArray(data)) return [];
    return data.filter(validator) as T[];
  }
};

// Error handling utilities
export const errorHandling = {
  // Handle API errors
  handleApiError: (error: any, context: string): string => {
    console.error(`API Error in ${context}:`, error);
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 400:
          return `Invalid request: ${message}`;
        case 401:
          return 'Authentication required. Please log in.';
        case 403:
          return 'Access denied. You do not have permission to access this resource.';
        case 404:
          return 'Resource not found. Please try again.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Request failed: ${message}`;
      }
    } else if (error.request) {
      // Network error
      return 'Network error. Please check your internet connection and try again.';
    } else {
      // Other error
      return error.message || 'An unexpected error occurred. Please try again.';
    }
  },

  // Log error with context
  logError: (error: any, context: string, additionalInfo?: any): void => {
    console.error(`[${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      additionalInfo
    });
  }
};
