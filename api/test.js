// Simple test API to verify Vercel deployment
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, query } = req;
    const { type } = query;
    
    console.log('[Test API] Request received:', { method, query, type });
    
    // Test the external API directly
    const apiBaseUrl = process.env.API_BASE_URL || 'https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1';
    
    if (type === 'categories') {
      const languageId = query.language_id || '5dd95034-d533-4b09-8687-cd2ed3682ab6';
      const targetUrl = `${apiBaseUrl}/news/categories?language_id=${languageId}`;
      
      console.log('[Test API] Testing categories URL:', targetUrl);
      
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MaroKurukshetram-Web/1.0',
          'Accept': 'application/json',
        },
      });
      
      console.log('[Test API] Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`External API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('[Test API] Raw data received:', {
        status: data.status,
        resultLength: data.result?.length || 0
      });
      
      // Apply the same filtering as the main API
      if (data.status === 1 && data.result) {
        const originalLength = data.result.length;
        data.result = data.result.filter(category => 
          category.is_active === 1 && (category.is_deleted === 0 || category.is_deleted === null)
        );
        console.log(`[Test API] Filtered from ${originalLength} to ${data.result.length} categories`);
      }
      
      return res.status(200).json({
        message: 'Test API working',
        externalApiUrl: targetUrl,
        externalApiStatus: response.status,
        data: data,
        filteredCategories: data.result?.length || 0
      });
    }
    
    if (type === 'languages') {
      const targetUrl = `${apiBaseUrl}/news/languages`;
      
      console.log('[Test API] Testing languages URL:', targetUrl);
      
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MaroKurukshetram-Web/1.0',
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      
      return res.status(200).json({
        message: 'Test API working',
        externalApiUrl: targetUrl,
        externalApiStatus: response.status,
        data: data,
        languagesCount: data.result?.length || 0
      });
    }
    
    return res.status(200).json({
      message: 'Test API working',
      method: method,
      query: query,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Test API] Error:', error);
    return res.status(500).json({
      error: 'Test API Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}