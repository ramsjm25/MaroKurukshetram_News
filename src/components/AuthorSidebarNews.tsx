import { useNavigate } from "react-router-dom";
import { NewsItem } from "../api/apiTypes";

interface AuthorSidebarNewsProps {
  newsItems: NewsItem[];
  side: 'left' | 'right';
}

const AuthorSidebarNews: React.FC<AuthorSidebarNewsProps> = ({
  newsItems,
  side,
}) => {
  const navigate = useNavigate();

  const handleClick = (news: NewsItem) => {
    navigate(`/news/${news.id}`);
  };

  if (!newsItems.length) {
    return null;
  }

  return (
    <div className="w-32">
      <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
        More from Author
      </h3>
      <div className="space-y-3">
        {newsItems.map((news) => (
          <div
            key={news.id}
            className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleClick(news)}
          >
            {/* Image */}
            <div className="w-full h-24 rounded-t-lg overflow-hidden bg-gray-200">
              {news.media?.[0]?.mediaUrl ? (
                <img
                  src={news.media[0].mediaUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <span className="text-lg">📰</span>
                </div>
              )}
            </div>
            {/* Title */}
            <div className="p-2">
              <h4 className="text-xs font-medium text-gray-800 dark:text-white line-clamp-3">
                {news.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorSidebarNews;
