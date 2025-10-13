import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Briefcase, Clock, Loader2 } from "lucide-react";
import { useDynamicData } from '../contexts/DynamicDataContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrl } from '@/services/api';
import { fetchJobsNews as fetchJobsNewsUtil } from '@/utils/newsUtils';

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

const JobsNews = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Get dynamic data from context
  const {
    selectedLanguage,
    categories,
    getCurrentLanguageId,
    getCategoryIdsByType,
  } = useDynamicData();

  const [jobsNews, setJobsNews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const language_id = getCurrentLanguageId();

  const fetchJobsNews = async () => {
    if (!language_id) {
      console.log('[JobsNews] Missing required data:', { language_id, categoriesLength: categories.length });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[JobsNews] Fetching jobs news for language:', language_id);

      // Use the new dynamic utility function
      const news = await fetchJobsNewsUtil(language_id, 6);
      
      if (news && news.length > 0) {
        setJobsNews(news);
        console.log('[JobsNews] Successfully fetched jobs news:', news.length, 'items');
        setError(null);
      } else {
        console.log('[JobsNews] No jobs news items found');
        setJobsNews([]);
        setError('No jobs news available');
      }
    } catch (err) {
      console.error('[JobsNews] Error fetching jobs news:', err);
      setError('Failed to fetch jobs news');
      setJobsNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsNews();
  }, [language_id]);

  const handleCardClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  return (
    <section id="jobs" className="py-8 sm:py-12 bg-gray-50 font-mandali scroll-mt-20 sm:scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t("jobsNews")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {t("latestJobOpportunities")}
          </p>
        </div>

        {/* Loading/Error */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">{t("loadingNews")}</span>
          </div>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Jobs News */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
          {jobsNews.map((news: any) => {
            const imageUrl = getImageUrl(news, 'jobs');
            const summary =
              news.shortNewsContent || news.excerpt || t("noSummary");
            const category = news.categoryName || t("jobs");
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
                <div className="sm:w-[45%] lg:w-[45%] xl:w-[45%] h-40 sm:h-48 lg:h-52 xl:h-56 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/600x400?text=Jobs+News";
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="sm:w-[55%] lg:w-[55%] xl:w-[55%] flex flex-col justify-between p-3 sm:p-4 md:p-5 h-auto sm:h-48 lg:h-52 xl:h-56">
                  <CardHeader className="p-0 pb-3">
                    <div className="flex flex-row items-center justify-between gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium w-fit">
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

        {jobsNews.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-600">
            {t("labels.noNewsAvailable")}
            <span className="block text-sm mt-1">
              No jobs news available
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsNews;
