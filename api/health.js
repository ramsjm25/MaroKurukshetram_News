// Simple health check endpoint
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
    
    console.log('[Health Check] Testing external API connection...');
    
    // Test external API
    const response = await fetch(`${apiBaseUrl}/news/languages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MaroKurukshetram-Web/1.0',
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      externalApi: {
        url: `${apiBaseUrl}/news/languages`,
        status: response.status,
        working: response.ok,
        dataReceived: !!data.result,
        languagesCount: data.result?.length || 0
      },
      environment: {
        nodeVersion: process.version,
        vercelRegion: process.env.VERCEL_REGION || 'unknown',
        apiBaseUrl: apiBaseUrl
      }
    });
    
  } catch (error) {
    console.error('[Health Check] Error:', error);
    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      environment: {
        nodeVersion: process.version,
        vercelRegion: process.env.VERCEL_REGION || 'unknown'
      }
    });
  }
}
