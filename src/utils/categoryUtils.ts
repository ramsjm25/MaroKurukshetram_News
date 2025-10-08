import { apiService } from '../services/api';
import { Category } from '../api/apiTypes';
import { NewsCategory } from '../services/api';

// Cache for categories by language
const categoryCache = new Map<string, Category[]>();

/**
 * Convert NewsCategory to Category format
 */
const convertNewsCategoryToCategory = (newsCategory: NewsCategory): Category => {
  // Handle missing or undefined properties
  const name = newsCategory.name || newsCategory.categoryName || 'Unknown Category';
  const id = newsCategory.id || '';
  const languageId = newsCategory.language_id || '';
  const icon = newsCategory.icon || '';
  const color = newsCategory.color || '#000000';
  
  return {
    id,
    category_name: name,
    language_id: languageId,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    description: '',
    icon,
    color,
    sort_order: 0,
    is_active: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: '',
    updated_by: '',
    is_deleted: 0,
    deleted_at: null,
    // Legacy fields for backward compatibility
    name,
    languageName: name
  };
};

/**
 * Get categories for a specific language with caching
 */
export const getCategoriesForLanguage = async (languageId: string): Promise<Category[]> => {
  // Check cache first
  if (categoryCache.has(languageId)) {
    return categoryCache.get(languageId)!;
  }

  try {
    const newsCategories = await apiService.getNewsCategories(languageId);
    console.log(`[getCategoriesForLanguage] Raw API response for language ${languageId}:`, newsCategories);
    
    // Convert NewsCategory[] to Category[]
    const categories = newsCategories.map(convertNewsCategoryToCategory);
    console.log(`[getCategoriesForLanguage] Converted categories:`, categories);
    
    // Cache the result
    categoryCache.set(languageId, categories);
    return categories;
  } catch (error) {
    console.error(`Error fetching categories for language ${languageId}:`, error);
    return [];
  }
};

/**
 * Simple category matching based on category name patterns
 */
const getCategoryIdsBySimpleMatching = (categories: Category[], type: string): string[] => {
  const typePatterns = {
    breaking: ['breaking', 'urgent', 'flash', 'alert', 'emergency'],
    politics: ['politics', 'political', 'government', 'election', 'parliament'],
    business: ['business', 'economy', 'finance', 'market', 'trade', 'commerce'],
    sports: ['sports', 'sport', 'cricket', 'football', 'tennis', 'olympics'],
    technology: ['technology', 'tech', 'digital', 'computer', 'internet', 'ai', 'software'],
    entertainment: ['entertainment', 'movie', 'music', 'celebrity', 'bollywood', 'hollywood']
  };

  const patterns = typePatterns[type as keyof typeof typePatterns] || [];
  
  return categories
    .filter(category => {
      const categoryName = category.category_name?.toLowerCase() || '';
      return patterns.some(pattern => categoryName.includes(pattern));
    })
    .map(category => category.id);
};

/**
 * Get category IDs by type for a specific language
 */
export const getCategoryIdsByType = async (
  languageId: string, 
  type: string
): Promise<string[]> => {
  try {
    const categories = await getCategoriesForLanguage(languageId);
    
    if (categories.length === 0) {
      console.warn(`No categories found for language ${languageId}`);
      return [];
    }

    // Try the complex matching first
    try {
      const { getCategoryIdsByType: getCategoryIdsByTypeHelper } = await import('./dynamicDataUtils');
      
      // Get urgency patterns and category keywords for better matching (with fallbacks)
      let urgencyPatterns = {};
      let categoryKeywords = {};
      
      try {
        urgencyPatterns = await import('../services/api').then(m => m.fetchUrgencyPatterns());
      } catch (error) {
        console.warn('Urgency patterns not available, using empty fallback');
        urgencyPatterns = {};
      }
      
      try {
        categoryKeywords = await import('../services/api').then(m => m.fetchCategoryKeywords());
      } catch (error) {
        console.warn('Category keywords not available, using empty fallback');
        categoryKeywords = {};
      }
      
      const complexMatches = getCategoryIdsByTypeHelper(
        categories, 
        type, 
        urgencyPatterns, 
        categoryKeywords, 
        languageId, 
        [] // languages array not needed for this function
      );

      if (complexMatches.length > 0) {
        return complexMatches;
      }
    } catch (error) {
      console.warn('Complex category matching failed, falling back to simple matching');
    }

    // Fallback to simple pattern matching
    const simpleMatches = getCategoryIdsBySimpleMatching(categories, type);
    
    if (simpleMatches.length > 0) {
      console.log(`Found ${simpleMatches.length} categories for type '${type}' using simple matching`);
      return simpleMatches;
    }

    // If no specific matches found, return all categories for comprehensive search
    console.warn(`No specific categories found for type '${type}', returning all categories`);
    return categories.map(cat => cat.id);
    
  } catch (error) {
    console.error(`Error getting category IDs by type ${type} for language ${languageId}:`, error);
    return [];
  }
};

/**
 * Get all category IDs for a specific language (useful for comprehensive searches)
 */
export const getAllCategoryIds = async (languageId: string): Promise<string[]> => {
  try {
    const categories = await getCategoriesForLanguage(languageId);
    return categories.map(cat => cat.id);
  } catch (error) {
    console.error(`Error getting all category IDs for language ${languageId}:`, error);
    return [];
  }
};

/**
 * Get breaking news category IDs for a specific language
 */
export const getBreakingNewsCategoryIds = async (languageId: string): Promise<string[]> => {
  return getCategoryIdsByType(languageId, 'breaking');
};

/**
 * Get politics category IDs for a specific language
 */
export const getPoliticsCategoryIds = async (languageId: string): Promise<string[]> => {
  return getCategoryIdsByType(languageId, 'politics');
};

/**
 * Get business category IDs for a specific language
 */
export const getBusinessCategoryIds = async (languageId: string): Promise<string[]> => {
  return getCategoryIdsByType(languageId, 'business');
};

/**
 * Get sports category IDs for a specific language
 */
export const getSportsCategoryIds = async (languageId: string): Promise<string[]> => {
  return getCategoryIdsByType(languageId, 'sports');
};

/**
 * Get technology category IDs for a specific language
 */
export const getTechnologyCategoryIds = async (languageId: string): Promise<string[]> => {
  return getCategoryIdsByType(languageId, 'technology');
};

/**
 * Get entertainment category IDs for a specific language
 */
export const getEntertainmentCategoryIds = async (languageId: string): Promise<string[]> => {
  return getCategoryIdsByType(languageId, 'entertainment');
};

/**
 * Clear category cache (useful for refreshing data)
 */
export const clearCategoryCache = (languageId?: string) => {
  if (languageId) {
    categoryCache.delete(languageId);
  } else {
    categoryCache.clear();
  }
};
