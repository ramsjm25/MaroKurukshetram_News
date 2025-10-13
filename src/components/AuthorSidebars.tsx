import { useState, useEffect } from "react";
import { NewsItem } from "../api/apiTypes";
import apiClient from "../api/apiClient";
import { useDynamicData } from '../contexts/DynamicDataContext';

interface AuthorSidebarsProps {
  authorId?: string;
  language_id: string;
  currentNewsId?: string;
}

interface AuthorSidebarsReturn {
  leftSideNews: NewsItem[];
  rightSideNews: NewsItem[];
  loading: boolean;
}

const useAuthorSidebars = ({
  authorId,
  language_id,
  currentNewsId,
}: AuthorSidebarsProps): AuthorSidebarsReturn => {
  const [allAuthorNews, setAllAuthorNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Get dynamic data from context
  const { getCurrentLanguageId } = useDynamicData();

  // Use dynamic data if available, otherwise fall back to props
  const currentLanguageId = getCurrentLanguageId() || language_id;

  useEffect(() => {
    const fetchAllAuthorNews = async () => {
      if (!authorId || !currentLanguageId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`[AuthorSidebars] Fetching all news for author: ${authorId}, language: ${currentLanguageId}`);
        
        // Use the filter-advanced endpoint to get all news for the language
        // Then filter by author on the client side
        const response = await apiClient.get('/news/filter-advanced', {
          params: {
            language_id: currentLanguageId,
            limit: 50, // Get more items to ensure we have enough after filtering
            page: 1
          }
        });

        if (response.data.status === 1 && response.data.result?.items) {
          // Filter by author on the client side
          const filteredItems = response.data.result.items.filter((item: any) => 
            (item.authorId === authorId || item.author_id === authorId) && 
            item.id !== currentNewsId
          );
          
          console.log(`[AuthorSidebars] Found ${filteredItems.length} news items for author ${authorId}`);
          setAllAuthorNews(filteredItems);
        } else {
          console.log(`[AuthorSidebars] No news found for author ${authorId}`);
          setAllAuthorNews([]);
        }
      } catch (error) {
        console.error(`[AuthorSidebars] Error fetching news by author:`, error);
        setAllAuthorNews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllAuthorNews();
  }, [authorId, currentLanguageId, currentNewsId]);

  // Distribute news between left and right sides
  const leftSideNews = allAuthorNews.slice(0, 3);
  const rightSideNews = allAuthorNews.slice(3, 6);

  return {
    leftSideNews,
    rightSideNews,
    loading
  };
};

export default useAuthorSidebars;
