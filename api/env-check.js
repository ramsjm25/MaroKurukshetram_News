// Environment variables check for Vercel
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
    const environmentInfo = {
      NODE_ENV: process.env.NODE_ENV,
      API_BASE_URL: process.env.API_BASE_URL,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_REGION: process.env.VERCEL_REGION,
      // Don't expose sensitive data
      hasApiBaseUrl: !!process.env.API_BASE_URL,
      timestamp: new Date().toISOString()
    };

    console.log('[ENV CHECK] Environment variables:', environmentInfo);

    return res.status(200).json({
      status: 'success',
      message: 'Environment check completed',
      environment: environmentInfo
    });
  } catch (error) {
    console.error('[ENV CHECK] Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Environment check failed',
      error: error.message
    });
  }
}
