import apiClient from '../api/apiClient';
import { getCategoryIdsByType, getAllCategoryIds } from './categoryUtils';
import { NewsItem } from '../api/apiTypes';

interface NewsSearchParams {
  languageId: string;
  categoryType?: string;
  categoryIds?: string[];
  limit?: number;
  page?: number;
  searchTerm?: string;
  stateId?: string;
  districtId?: string;
}

/**
 * Dynamically fetch news based on language and category type
 */
export const fetchNewsByType = async (params: NewsSearchParams): Promise<NewsItem[]> => {
  const {
    languageId,
    categoryType,
    categoryIds,
    limit = 20,
    page = 1,
    searchTerm,
    stateId,
    districtId
  } = params;

  try {
    let finalCategoryIds: string[] = [];

    if (categoryIds && categoryIds.length > 0) {
      // Use provided category IDs
      finalCategoryIds = categoryIds;
    } else if (categoryType) {
      // Get category IDs by type
      finalCategoryIds = await getCategoryIdsByType(languageId, categoryType);
    } else {
      // Get all category IDs for comprehensive search
      finalCategoryIds = await getAllCategoryIds(languageId);
    }

    if (finalCategoryIds.length === 0) {
      console.warn(`No categories found for language ${languageId} and type ${categoryType}`);
      return [];
    }

    // Prepare query parameters
    const queryParams: any = {
      language_id: languageId,
      categoryIds: finalCategoryIds.join(','),
      limit,
      page
    };

    if (searchTerm) {
      queryParams.search = searchTerm;
    }

    if (stateId) {
      queryParams.state_id = stateId;
    }

    if (districtId) {
      queryParams.district_id = districtId;
    }

    console.log(`[fetchNewsByType] Fetching news with params:`, queryParams);

    const response = await apiClient.get('/news/filter-multi-categories', {
      params: queryParams
    });

    if (response.data.status === 1 && response.data.result && response.data.result.items) {
      return response.data.result.items;
    } else {
      console.warn(`No news found for the given parameters:`, queryParams);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching news by type ${categoryType}:`, error);
    return [];
  }
};

/**
 * Fetch breaking news dynamically
 */
export const fetchBreakingNews = async (languageId: string, limit: number = 10): Promise<NewsItem[]> => {
  return fetchNewsByType({
    languageId,
    categoryType: 'breaking',
    limit
  });
};

/**
 * Fetch politics news dynamically
 */
export const fetchPoliticsNews = async (languageId: string, limit: number = 10): Promise<NewsItem[]> => {
  return fetchNewsByType({
    languageId,
    categoryType: 'politics',
    limit
  });
};

/**
 * Fetch business news dynamically
 */
export const fetchBusinessNews = async (languageId: string, limit: number = 10): Promise<NewsItem[]> => {
  return fetchNewsByType({
    languageId,
    categoryType: 'business',
    limit
  });
};

/**
 * Fetch sports news dynamically
 */
export const fetchSportsNews = async (languageId: string, limit: number = 10): Promise<NewsItem[]> => {
  return fetchNewsByType({
    languageId,
    categoryType: 'sports',
    limit
  });
};

/**
 * Fetch technology news dynamically
 */
export const fetchTechnologyNews = async (languageId: string, limit: number = 10): Promise<NewsItem[]> => {
  return fetchNewsByType({
    languageId,
    categoryType: 'technology',
    limit
  });
};

/**
 * Fetch entertainment news dynamically
 */
export const fetchEntertainmentNews = async (languageId: string, limit: number = 10): Promise<NewsItem[]> => {
  return fetchNewsByType({
    languageId,
    categoryType: 'entertainment',
    limit
  });
};

/**
 * Fetch jobs news dynamically
 */
export const fetchJobsNews = async (languageId: string, limit: number = 10): Promise<NewsItem[]> => {
  return fetchNewsByType({
    languageId,
    categoryType: 'jobs',
    limit
  });
};

/**
 * Search news with a specific term
 */
export const searchNews = async (
  languageId: string, 
  searchTerm: string, 
  limit: number = 20
): Promise<NewsItem[]> => {
  return fetchNewsByType({
    languageId,
    searchTerm,
    limit
  });
};

/**
 * Get single news item by ID
 */
export const getSingleNews = async (newsId: string): Promise<NewsItem | null> => {
  try {
    const response = await apiClient.get(`/news/${newsId}`);
    
    if (response.data.status === 1 && response.data.result) {
      return response.data.result;
    } else {
      console.warn(`News item ${newsId} not found`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching single news item ${newsId}:`, error);
    return null;
  }
};
