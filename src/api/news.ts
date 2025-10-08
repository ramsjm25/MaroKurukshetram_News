import apiClient from "./apiClient";
import { NewsResponse } from "./apiTypes";

interface ApiResponse<T> {
  status: number;
  message: string;
  result: T;
}

interface NewsFilterParams {
  language_id: string;
  categoryId: string;
  state_id: string;
  district_id: string;
  page?: number;
}

export const getFilteredNews = async (
  params: NewsFilterParams
): Promise<NewsResponse> => {
  try {
    // Use the correct endpoint that our API handler supports
    const response = await apiClient.get<ApiResponse<NewsResponse>>(
      "/news/filter-multi-categories",
      { 
        params: {
          language_id: params.language_id,
          categoryIds: params.categoryId, // Convert single categoryId to categoryIds
          state_id: params.state_id,
          district_id: params.district_id,
          page: params.page || 1,
          limit: 10
        }
      }
    );

    if (response.data.status === 1) {
      return response.data.result; // ✅ correctly typed
    } else {
      throw new Error("Failed to fetch news");
    }
  } catch (error) {
    console.error("Error fetching filtered news", error);
    throw error;
  }
};
