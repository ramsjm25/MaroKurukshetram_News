import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TrendingUp, Clock, Loader2 } from "lucide-react";
import { useDynamicData } from '../contexts/DynamicDataContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchNewsByCategory, getImageUrl } from '@/services/api';

// Removed hardcoded language mapping - now using dynamic data context

interface MarketStat {
  labelKey: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

interface NewsItem {
  id: string;
  title: string;
  shortNewsContent?: string;
  excerpt?: string;
  categoryName?: string;
  authorName?: string;
  createdAt: string;
  publishedAt?: string;
  districtName?: string;
  media?: Array<{
    mediaUrl: string;
    mediaType: string;
  }>;
  source?: string;
}

interface NewsResponse {
  status: number;
  result: {
    items: NewsItem[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

const BusinessNews = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Get dynamic data from context
  const {
    selectedLanguage,
    categories,
    getCurrentLanguageId,
    getCategoryIdsByType,
  } = useDynamicData();

  const [businessNews, setBusinessNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const language_id = getCurrentLanguageId();

  const fetchBusinessNews = async () => {
    if (!language_id || !categories.length) {
      console.log('[BusinessNews] Missing required data:', { language_id, categoriesLength: categories.length });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get business category IDs dynamically using the context function
      const businessCategoryIds = getCategoryIdsByType('business');

      if (!businessCategoryIds || businessCategoryIds.length === 0) {
        console.log('[BusinessNews] No business categories found for language:', language_id);
        setBusinessNews([]);
        setError(`No business categories available for ${selectedLanguage?.language_name || 'selected language'}`);
        return;
      }

      console.log('[BusinessNews] Found business categories:', businessCategoryIds);

      // Fetch news for all business categories
      const allNews = [];
      for (const categoryId of businessCategoryIds) {
        try {
          const news = await fetchNewsByCategory(language_id, categoryId, 8, 1);
          if (news && news.length > 0) {
            allNews.push(...news);
            console.log(`[BusinessNews] Fetched ${news.length} news items for category ${categoryId}`);
          }
        } catch (categoryError) {
          console.error(`[BusinessNews] Error fetching news for category ${categoryId}:`, categoryError);
          // Continue with other categories even if one fails
        }
      }
      
      if (allNews.length > 0) {
        setBusinessNews(allNews.slice(0, 8)); // Take only first 8 items
        console.log('[BusinessNews] Successfully fetched business news:', allNews.length, 'items');
        setError(null);
      } else {
        console.log('[BusinessNews] No news items found for any business categories');
        setBusinessNews([]);
        setError('No business news available');
      }
    } catch (err) {
      console.error('[BusinessNews] Error fetching business news:', err);
      setError('Failed to fetch business news');
      setBusinessNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessNews();
  }, [language_id, categories]);

  const handleCardClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  return (
    <section id="business" className="py-8 sm:py-12 bg-gray-50 font-mandali scroll-mt-20 sm:scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t("businessNews")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {t("latestMarketTrends")}
          </p>
        </div>

        {/* Market Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {marketStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {t(stat.labelKey)}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex items-center ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    <TrendingUp
                      className={`h-4 w-4 mr-1 ${
                        stat.trend === "down" ? "rotate-180" : ""
                      }`}
                    />
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        {/* Loading/Error */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">{t("loadingNews")}</span>
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Business News */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          {businessNews.map((news: any) => {
            const imageUrl = getImageUrl(news, 'business');
            const summary =
              news.shortNewsContent || news.excerpt || t("noSummary");
            const category = news.categoryName || t("business");
            const time = news.createdAt
              ? new Date(news.createdAt).toLocaleDateString("en-IN")
              : t("recently");

            return (
              <Card
                key={news.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col sm:flex-row lg:flex-row xl:flex-row"
                onClick={() => handleCardClick(news.id)}
              >
                {/* Image */}
                <div className="sm:w-[45%] lg:w-[45%] xl:w-[45%] h-56 sm:h-48 lg:h-52 xl:h-56 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/600x400?text=Business+News";
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="sm:w-[55%] lg:w-[55%] xl:w-[55%] flex flex-col justify-between p-3 sm:p-4 md:p-5 h-auto sm:h-48 lg:h-52 xl:h-56">
                  <CardHeader className="p-0 pb-3">
                    <div className="flex flex-row items-center justify-between gap-2 mb-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium w-fit">
                        {category}
                      </span>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </div>
                    </div>
                    <CardTitle className="text-base sm:text-lg md:text-xl line-clamp-2 leading-tight">
                      {news.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 flex flex-col justify-end">
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base line-clamp-3 leading-relaxed">
                      {summary}
                    </p>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>

        {businessNews.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-600">
            {t("labels.noNewsAvailable")}
            <span className="block text-sm mt-1">
              No business news available
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessNews;