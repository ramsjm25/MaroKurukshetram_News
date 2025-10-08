// Simple test endpoint to verify API is working
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
    const apiBaseUrl = process.env.API_BASE_URL || 'https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1';
    
    // Test the external API connection
    const testUrl = `${apiBaseUrl}/news/test-connection`;
    console.log(`[API Test] Testing connection to: ${testUrl}`);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MaroKurukshetram-Web/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });
    
    console.log(`[API Test] Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        status: 'success',
        message: 'API connection test successful',
        externalApi: {
          url: apiBaseUrl,
          reachable: true,
          status: response.status,
          statusText: response.statusText,
          response: data
        },
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(200).json({
        status: 'error',
        message: 'API connection test failed',
        externalApi: {
          url: apiBaseUrl,
          reachable: false,
          status: response.status,
          statusText: response.statusText
        },
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('[API Test] Error:', error);
    return res.status(200).json({
      status: 'error',
      message: 'API connection test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
