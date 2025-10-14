import React, { useState, useEffect } from "react";
import { Clock, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getImageUrl } from '@/services/api';
import { fetchTechnologyNews as fetchTechnologyNewsUtil, fetchEntertainmentNews as fetchEntertainmentNewsUtil } from '@/utils/newsUtils';
import { formatTimeAgo } from "@/utils/timeUtils";
import { useDynamicData } from '../contexts/DynamicDataContext';

import { NewsItem } from '../api/apiTypes';

interface NewsResponse {
  status: number;
  result: {
    items: NewsItem[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

// Removed hardcoded language mapping - now using dynamic data context

const TechAndEntertainmentNews: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Get dynamic data from context
  const {
    selectedLanguage,
    categories,
    getCurrentLanguageId,
    getCategoryIdsByType,
  } = useDynamicData();

  const [technologyNews, setTechnologyNews] = useState<NewsItem[]>([]);
  const [entertainmentNews, setEntertainmentNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const language_id = getCurrentLanguageId();

  const fetchNews = async () => {
    if (!language_id) {
      console.log('[TechAndEntertainment] Missing required data:', { language_id, categoriesLength: categories.length });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[TechAndEntertainment] Fetching technology and entertainment news for language:', language_id);

      // Use the new dynamic utility functions
      const [techNews, entNews] = await Promise.all([
        fetchTechnologyNewsUtil(language_id, 6),
        fetchEntertainmentNewsUtil(language_id, 3)
      ]);

      setTechnologyNews(techNews);
      setEntertainmentNews(entNews);

      console.log('[TechAndEntertainment] Successfully fetched news:', {
        technology: techNews.length,
        entertainment: entNews.length
      });

      if (techNews.length === 0 && entNews.length === 0) {
        setError('No technology or entertainment news available');
      }
    } catch (err) {
      console.error('[TechAndEntertainment] Error fetching news:', err);
      setError('Failed to fetch technology and entertainment news');
      setTechnologyNews([]);
      setEntertainmentNews([]);
    } finally {
      setLoading(false);
    }
  };


  // Navigate to details
  const handleCardClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  useEffect(() => {
    fetchNews();
  }, [language_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">{t("loading.newsLoading")}</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-6">{error}</div>;
  }

  return (
    <>
      {/* Technology Section */}
      <section id="technology" className="py-12 bg-gray-50 dark:bg-gray-800 font-mandali scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            {t("headings.technologyLatestNews")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologyNews.map((news) => (
              <Card
                key={news.id}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handleCardClick(news.id)}
              >
                <div className="relative">
                  <img
                    src={getImageUrl(news, 'technology')}
                    alt={news.title}
                    className="w-full h-40 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/lovable-uploads/default-tech.jpg";
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                    {news.shortNewsContent ||
                      news.excerpt ||
                      t("labels.noDetails")}
                  </p>
                  <div className="flex flex-row items-center justify-between gap-2 text-xs text-gray-500">
                    <span className="flex items-center min-w-0 flex-1">
                      <User className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {news.authorName || t("labels.unknownAuthor")}
                      </span>
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                      {formatTimeAgo(news.createdAt, { t })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Entertainment Section */}
      <section id="entertainment" className="py-12 bg-white dark:bg-gray-800 font-mandali scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            {t("headings.entertainmentLatestNews")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entertainmentNews.map((news) => (
              <Card
                key={news.id}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handleCardClick(news.id)}
              >
                <div className="relative">
                  <img
                    src={getImageUrl(news, 'entertainment')}
                    alt={news.title}
                    className="w-full h-40 sm:h-56 md:h-64 lg:h-72 object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/lovable-uploads/default-ent.jpg";
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                    {news.shortNewsContent ||
                      news.excerpt ||
                      t("labels.noDetails")}
                  </p>
                  <div className="flex flex-row items-center justify-between gap-2 text-xs text-gray-500">
                    <span className="flex items-center min-w-0 flex-1">
                      <User className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {news.authorName || t("labels.unknownAuthor")}
                      </span>
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                      {formatTimeAgo(news.createdAt, { t })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TechAndEntertainmentNews;
