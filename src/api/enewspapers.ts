import axios from "axios";
import { ENewspaperResponse, GetENewspapersParams, ENewspaper } from "./apiTypes";

// Generate fallback newspapers for development environment when API requires authentication
function generateFallbackNewspapers(params: GetENewspapersParams): ENewspaperResponse {
  const newspapers: ENewspaper[] = [];
  const languageId = params.language_id || '5dd95034-d533-4b09-8687-cd2ed3682ab6'; // Default to English
  const dateFrom = params.dateFrom || new Date().toISOString().split('T')[0];
  const dateTo = params.dateTo || new Date().toISOString().split('T')[0];
  
  // Generate newspapers for the requested date range
  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    newspapers.push({
      id: `fallback-${dateStr}`,
      language_id: languageId,
      date: dateStr,
      pdfPath: null,
      pdfUrl: `https://via.placeholder.com/800x1200/f3f4f6/9ca3af?text=MARO+KURUKSHETRAM+${dateStr}`,
      type: 'paper',
      thumbnail: `https://via.placeholder.com/400x600/f3f4f6/9ca3af?text=Newspaper+${dateStr}`,
      addedBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: {
        id: languageId,
        languageName: 'English',
        icon: '🇺🇸',
        code: 'en',
        createdAt: new Date().toISOString(),
        is_active: true
      },
      user: {
        id: 'system-user',
        email: 'system@marokurukshetram.com',
        firstName: 'System',
        lastName: 'User',
        phone: '',
        gender: '',
        dob: '',
        status: 'active',
        is_active: true,
        profilePicture: '',
        avatar: '',
        preferences: {
          theme: 'light',
          notifications: false
        },
        lastLoginAt: new Date().toISOString(),
        createdBy: null,
        updatedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roleId: 'admin',
        isDeleted: false,
        deletedAt: null,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });
  }
  
  return {
    status: 1,
    message: 'E-newspapers (development fallback)',
    result: {
      items: newspapers.slice(0, params.limit || 10),
      limit: params.limit || 10,
      page: params.page || 1,
      total: newspapers.length
    }
  };
}

// Determine the base URL based on environment (same logic as main API client)
const getBaseURL = () => {
  // In development, use the Vite proxy
  if (import.meta.env.DEV) {
    return "/api";
  }
  // In production, use the Vercel proxy
  return "/api";
};

// Create a public API client for e-newspapers (no authentication required)
const publicApiClient = axios.create({
  baseURL: getBaseURL(), // Use the same base URL logic as the main API client
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for public API client (no JWT token)
publicApiClient.interceptors.request.use(
  (config) => {
    console.log('[E-Newspaper] Making public API request to:', config.url);
    console.log('[E-Newspaper] Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('[E-Newspaper] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for public API client
publicApiClient.interceptors.response.use(
  (response) => {
    console.log('[E-Newspaper] API Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[E-Newspaper] API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Fetch e-newspapers with date range and language filter
export async function getENewspapers(params: GetENewspapersParams): Promise<ENewspaperResponse> {
  console.log('[E-Newspaper] Fetching e-newspapers with params:', params);
  
  try {
    // Use public API client (no authentication required)
    const response = await publicApiClient.get<ENewspaperResponse>("?type=e-newspapers", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        language_id: params.language_id,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo
        // Remove the duplicate type parameter - it's already in the URL
      }
    });
    
    console.log('[E-Newspaper] API response:', response.data);
    console.log('[E-Newspaper] Number of newspapers found:', response.data.result?.items?.length || 0);
    
    // Log each newspaper's PDF URL for debugging
    if (response.data.result?.items) {
      response.data.result.items.forEach((newspaper, index) => {
        console.log(`[E-Newspaper] Newspaper ${index + 1}:`, {
          date: newspaper.date,
          pdfUrl: newspaper.pdfUrl,
          pdfPath: newspaper.pdfPath,
          hasPdf: !!(newspaper.pdfUrl || newspaper.pdfPath)
        });
      });
    }
    
    return response.data;
  } catch (error: any) {
    console.error('[E-Newspaper] Error fetching e-newspapers from API:', error);
    console.error('[E-Newspaper] API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle 401 Unauthorized error in development environment
    if (error.response?.status === 401) {
      console.log('[E-Newspaper] 401 Unauthorized in development, providing fallback data');
      return generateFallbackNewspapers(params);
    }
    
    // Return empty result for other failed requests
    console.log('[E-Newspaper] API failed, returning empty result');
    return {
      status: 0,
      message: "Failed to fetch newspapers",
      result: {
        items: [],
        limit: params.limit || 10,
        page: params.page || 1,
        total: 0
      }
    };
  }
}

// Helper function to get date range for last 7 days
export function getLast7DaysDateRange(): { dateFrom: string; dateTo: string } {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  return {
    dateFrom: sevenDaysAgo.toISOString().split('T')[0], // YYYY-MM-DD format
    dateTo: today.toISOString().split('T')[0] // YYYY-MM-DD format
  };
}

// Helper function to generate last 7 dates (oldest to newest, left to right)
export function generateLast7Dates() {
  const dates = [];
  const today = new Date();
  
  console.log('Generating last 7 dates from:', today.toISOString());
  
  // Start from 6 days ago and go to today
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const dateItem = {
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate().toString(),
      monthName: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0, // Today is at the end (rightmost)
      fullDate: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    console.log(`Date ${i}:`, dateItem);
    dates.push(dateItem);
  }
  
  console.log('Generated dates:', dates);
  return dates;
}

// Helper function to format date for display
export function formatDateForDisplay(dateString: string, language: string = "en"): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  
  // Check if it's yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  
  // Format as "Month Day" (e.g., "Aug 13")
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
  const locale = language === "te" ? "te-IN" : "en-US";
  const formatted = date.toLocaleDateString(locale, options).split(" ");
  const month = formatted[0];
  const day = parseInt(formatted[1]);
  return `${month} ${day}`;
}