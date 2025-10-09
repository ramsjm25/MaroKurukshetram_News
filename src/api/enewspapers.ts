import axios from 'axios';
import { ENewspaperResponse, GetENewspapersParams } from "./apiTypes";

// Create a public API client for endpoints that don't require authentication
const publicApiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Fetch e-newspapers with date range and language filter
export async function getENewspapers(params: GetENewspapersParams): Promise<ENewspaperResponse> {
  console.log('Fetching e-newspapers with params:', params);
  
  try {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    
    // Use authenticated API client if token is available
    const client = token ? 
      axios.create({
        baseURL: "/api",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        timeout: 10000,
      }) : 
      publicApiClient;
    
    console.log('Using', token ? 'authenticated' : 'public', 'API client for e-newspapers');
    
    const response = await client.get<ENewspaperResponse>("/e-newspapers", {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        language_id: params.language_id,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        type: params.type || "paper"
      }
    });
    
    console.log('E-newspapers API response:', response.data);
    console.log('Number of newspapers found:', response.data.result?.items?.length || 0);
    
    // Log each newspaper's PDF URL for debugging
    if (response.data.result?.items) {
      response.data.result.items.forEach((newspaper, index) => {
        console.log(`Real Newspaper ${index + 1}:`, {
          date: newspaper.date,
          pdfUrl: newspaper.pdfUrl,
          pdfPath: newspaper.pdfPath,
          hasPdf: !!(newspaper.pdfUrl || newspaper.pdfPath)
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching e-newspapers from API:', error);
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle authentication errors specifically
    if (error.response?.status === 401) {
      console.log('Authentication required for e-newspapers. User may need to log in.');
      // Throw an error that React Query can catch
      const authError = new Error("Authentication required. Please log in to access newspapers.");
      authError.name = 'AuthenticationError';
      authError.status = 401;
      throw authError;
    }
    
    // Throw error for other cases so React Query can handle it
    console.log('API failed, throwing error');
    throw error;
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