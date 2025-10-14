import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getImageUrl } from '@/services/api';
import { fetchSportsNews as fetchSportsNewsUtil } from '@/utils/newsUtils';
import { useDynamicData } from '../contexts/DynamicDataContext';

import { NewsItem } from '../api/apiTypes';

// Define the API response structure
interface ApiResponse {
  status: number;
  message: string;
  result: {
    status: number;
    message: string;
    items: NewsItem[];
  };
}

// Removed hardcoded language mapping - now using dynamic data context

const SportsSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Get dynamic data from context
  const {
    selectedLanguage,
    categories,
    getCurrentLanguageId,
    getCategoryIdsByType,
  } = useDynamicData();

  const [sportsNews, setSportsNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const language_id = getCurrentLanguageId();

  const fetchSportsNews = async () => {
    if (!language_id) {
      console.log('[SportsSection] Missing required data:', { language_id, categoriesLength: categories.length });
      return;
    }

    setLoading(true);

    try {
      console.log('[SportsSection] Fetching sports news for language:', language_id);

      // Use the new dynamic utility function
      const news = await fetchSportsNewsUtil(language_id, 4);
      
      if (news && news.length > 0) {
        setSportsNews(news);
        console.log('[SportsSection] Successfully fetched sports news:', news.length, 'items');
      } else {
        console.log('[SportsSection] No sports news items found');
        setSportsNews([]);
      }
    } catch (err) {
      console.error('[SportsSection] Error fetching sports news:', err);
      setSportsNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSportsNews();
  }, [language_id]);

  const handleCardClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  return (
    <section id="sports" className="font-mandali py-8 sm:py-12 bg-white dark:bg-gray-900 scroll-mt-20 sm:scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-center">
            {t("sports.title")}
          </h2>
          <p className="text-base sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center">
            {t("sports.subtitle")}
          </p>
        </div>

        {/* Full-width sports news */}
        <div>
          {/* <h3 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            {t("sports.latestNews")}
          </h3> */}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-600 mb-3 sm:mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg">{t("sports.loading")}</p>
              {/* Loading skeleton */}
              <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8 w-full">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="w-full sm:w-2/5 h-48 sm:h-44 md:h-48 lg:h-52 xl:h-56 bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
                      <div className="w-full sm:w-3/5 flex flex-col justify-between p-3 sm:p-4 md:p-6">
                        <div className="flex-1">
                          <div className="flex flex-row items-center justify-between gap-2 mb-3">
                            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                          <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                        </div>
                        <div className="mt-auto">
                          <div className="space-y-2">
                            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : sportsNews.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg">{t("sports.noNews")}</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {sportsNews.map((news) => {
                const imageUrl = getImageUrl(news, 'sports');
                const summary = news.shortNewsContent || t("sports.noSummary");
                const category = news.categoryName || t("sports.defaultCategory");
                const time = new Date(news.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <Card
                    key={news.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 h-full bg-white dark:bg-gray-800"
                    onClick={() => handleCardClick(news.id)}
                  >
                    <div className="flex flex-col sm:flex-row h-full">
                      {/* Image */}
                      <div className="w-full sm:w-2/5 h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 flex-shrink-0 relative overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={news.title}
                          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center";
                            target.onerror = null; // Prevent infinite loop
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Text Content */}
                      <div className="w-full sm:w-3/5 flex flex-col justify-between p-3 sm:p-4 md:p-6 min-h-0">
                        <div className="flex-1 flex flex-col">
                          <div className="flex flex-row items-center justify-between gap-2 mb-2 sm:mb-3">
                            <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-medium w-fit">
                              {category}
                            </span>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                              <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{time}</span>
                            </div>
                          </div>
                          <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                            {news.title}
                          </CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed flex-1">
                            {summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SportsSection;