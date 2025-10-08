// Comprehensive API handler for all endpoints
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
    const { method, query, body } = req;
    const { type, action, id, slug } = query;
    
    console.log(`[API Handler] Request received:`, {
      method,
      query,
      type,
      action,
      id,
      slug,
      url: req.url
    });
    
    // Construct the target URL
    const apiBaseUrl = process.env.API_BASE_URL || 'https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1';
    let targetUrl = '';
    let logPrefix = '[API]';

    // Handle different endpoint types
    if (type) {
      // Data endpoints (languages, categories, states, districts, local-mandis, health-check)
      switch (type) {
        case 'languages':
          targetUrl = `${apiBaseUrl}/news/languages`;
          logPrefix = '[Languages API]';
          break;
        case 'categories':
          if (!query.language_id) {
            return res.status(400).json({ 
              status: 0, 
              message: 'language_id parameter is required for categories',
              result: null 
            });
          }
          targetUrl = `${apiBaseUrl}/news/categories?language_id=${query.language_id}`;
          logPrefix = '[Categories API]';
          break;
        case 'states':
          if (!query.language_id) {
            return res.status(400).json({ 
              status: 0, 
              message: 'language_id parameter is required for states',
              result: null 
            });
          }
          targetUrl = `${apiBaseUrl}/news/states?language_id=${query.language_id}`;
          logPrefix = '[States API]';
          break;
        case 'districts':
          if (!query.language_id) {
            return res.status(400).json({ 
              status: 0, 
              message: 'language_id parameter is required for districts',
              result: null 
            });
          }
          if (!query.state_id) {
            return res.status(400).json({ 
              status: 0, 
              message: 'state_id parameter is required for districts',
              result: null 
            });
          }
          targetUrl = `${apiBaseUrl}/news/districts?language_id=${query.language_id}&state_id=${query.state_id}`;
          logPrefix = '[Districts API]';
          break;
        case 'local-mandis':
          targetUrl = `${apiBaseUrl}/local-mandis`;
          logPrefix = '[Local Mandis API]';
          break;
        case 'urgency-patterns':
          // Return empty urgency patterns to prevent breaking the system
          console.log(`${logPrefix} Returning empty urgency patterns`);
          return res.status(200).json({
            status: 1,
            message: 'Urgency patterns not available, using fallback',
            result: {}
          });
        case 'category-keywords':
          // Return empty category keywords to prevent breaking the system
          console.log(`${logPrefix} Returning empty category keywords`);
          return res.status(200).json({
            status: 1,
            message: 'Category keywords not available, using fallback',
            result: {}
          });
        case 'roles':
          targetUrl = `${apiBaseUrl}/roles`;
          logPrefix = '[Roles API]';
          break;
        case 'health-check':
          return res.status(200).json({
            status: 1,
            message: 'API is healthy',
            result: { timestamp: new Date().toISOString() }
          });
        default:
          return res.status(400).json({ 
            status: 0, 
            message: 'Invalid type. Must be one of: languages, categories, states, districts, local-mandis, roles, health-check',
            result: null 
          });
      }
    } else if (action) {
      // Auth endpoints
      switch (action) {
        case 'login':
          targetUrl = `${apiBaseUrl}/auth/userLogin`;
          logPrefix = '[Auth Login]';
          break;
        case 'register':
          targetUrl = `${apiBaseUrl}/auth/register`;
          logPrefix = '[Auth Register]';
          break;
        case 'forgot-password':
          targetUrl = `${apiBaseUrl}/auth/forgot-password`;
          logPrefix = '[Auth Forgot Password]';
          break;
        case 'verify-code':
          targetUrl = `${apiBaseUrl}/auth/verify-code`;
          logPrefix = '[Auth Verify Code]';
          break;
        case 'reset-password':
          targetUrl = `${apiBaseUrl}/auth/reset-password`;
          logPrefix = '[Auth Reset Password]';
          break;
        default:
          return res.status(400).json({ 
            status: 0, 
            message: 'Invalid auth action. Must be one of: login, register, forgot-password, verify-code, reset-password',
            result: null 
          });
      }
    } else if (id) {
      // Single news by ID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid news ID format',
          status: 400,
          type: 'VALIDATION_ERROR'
        });
      }
      targetUrl = `${apiBaseUrl}/news/${id}`;
      logPrefix = '[News API]';
    } else if (slug) {
      // Dynamic slug endpoints
      const path = Array.isArray(slug) ? slug.join('/') : slug;
      targetUrl = `${apiBaseUrl}/${path}`;
      logPrefix = '[Dynamic API]';
    } else {
      // Handle direct path routing (e.g., /api/news/filter-advanced, /api/auth/userLogin)
      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = url.pathname.replace('/api', '');
      
      if (pathname.startsWith('/news/') || pathname.startsWith('/auth/') || pathname.startsWith('/local-mandi-categories') || pathname.startsWith('/e-newspapers') || pathname.startsWith('/local-mandis')) {
        targetUrl = `${apiBaseUrl}${pathname}`;
        logPrefix = '[Direct API]';
      } else {
        return res.status(400).json({ 
          status: 0, 
          message: 'Missing required parameter. Use type, action, id, or provide a valid path',
          result: null 
        });
      }
    }

    // Add query parameters
    const queryParams = new URLSearchParams();
    Object.keys(query).forEach(key => {
      if (!['type', 'action', 'id', 'slug'].includes(key)) {
        queryParams.append(key, query[key]);
      }
    });
    
    if (queryParams.toString()) {
      targetUrl += `?${queryParams.toString()}`;
    }

    console.log(`${logPrefix} Proxying request to: ${targetUrl}`);
    console.log(`${logPrefix} Method: ${method}`);

    // Prepare request options
    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MaroKurukshetram-Web/1.0',
        'Accept': 'application/json',
      },
    };

    // Add Authorization header if present
    if (req.headers.authorization) {
      requestOptions.headers['Authorization'] = req.headers.authorization;
    }

    // Add body for POST/PUT requests
    if (body && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(body);
    }

    // Make the request to the external API
    console.log(`${logPrefix} Making request with options:`, requestOptions);
    console.log(`${logPrefix} Target URL: ${targetUrl}`);
    const response = await fetch(targetUrl, requestOptions);
    
    console.log(`${logPrefix} Response status: ${response.status}`);
    console.log(`${logPrefix} Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error(`${logPrefix} API response not ok: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      return res.status(response.status).json({
        error: 'API request failed',
        message: errorData.message || `API returned ${response.status}: ${response.statusText}`,
        status: response.status,
        type: 'API_ERROR',
        details: errorData
      });
    }
    
    const data = await response.json();
    console.log(`${logPrefix} Response data received:`, {
      status: data.status,
      hasResult: !!data.result,
      resultType: Array.isArray(data.result) ? 'array' : typeof data.result,
      resultLength: Array.isArray(data.result) ? data.result.length : 'N/A'
    });
    
    // Apply specific filtering for categories
    if (type === 'categories' && data.status === 1 && data.result) {
      console.log(`${logPrefix} Raw categories before filtering:`, data.result.length);
      console.log(`${logPrefix} Sample categories:`, data.result.slice(0, 3).map(cat => ({
        name: cat.category_name,
        active: cat.is_active,
        deleted: cat.is_deleted
      })));
      
      const originalLength = data.result.length;
      const originalCategories = [...data.result]; // Keep a copy of original data
      
      // First try: strict filtering (active and not deleted)
      data.result = data.result.filter(category => {
        const isActive = category.is_active === 1;
        const isNotDeleted = category.is_deleted === 0 || category.is_deleted === null || category.is_deleted === undefined;
        const shouldInclude = isActive && isNotDeleted;
        
        console.log(`${logPrefix} Category "${category.category_name}": active=${category.is_active}, deleted=${category.is_deleted}, include=${shouldInclude}`);
        
        return shouldInclude;
      });
      
      console.log(`${logPrefix} Strict filtering: ${originalLength} -> ${data.result.length} categories`);
      
      // If no categories after strict filtering, try relaxed filtering (only active)
      if (data.result.length === 0) {
        console.log(`${logPrefix} No categories after strict filtering, trying relaxed filtering (active only)`);
        data.result = originalCategories.filter(category => {
          const isActive = category.is_active === 1;
          console.log(`${logPrefix} Relaxed: Category "${category.category_name}": active=${category.is_active}, include=${isActive}`);
          return isActive;
        });
        console.log(`${logPrefix} Relaxed filtering: ${originalLength} -> ${data.result.length} categories`);
      }
      
      // If still no categories, return all categories (last resort)
      if (data.result.length === 0) {
        console.log(`${logPrefix} No categories after relaxed filtering, returning ALL categories as last resort`);
        data.result = originalCategories;
        console.log(`${logPrefix} Last resort: ${originalLength} -> ${data.result.length} categories`);
      }
      
      console.log(`${logPrefix} Final result: ${data.result.length} categories`);
      console.log(`${logPrefix} Final categories:`, data.result.map(cat => cat.category_name));
    }
    
    // Additional validation for critical endpoints
    if (type === 'categories' && (!data.result || data.result.length === 0)) {
      console.warn(`${logPrefix} WARNING: No categories returned after filtering!`);
    }
    
    if (type === 'states' && (!data.result || data.result.length === 0)) {
      console.warn(`${logPrefix} WARNING: No states returned!`);
    }
    
    if (type === 'districts' && (!data.result || data.result.length === 0)) {
      console.warn(`${logPrefix} WARNING: No districts returned!`);
    }
    
    console.log(`${logPrefix} Final response:`, {
      status: data.status,
      message: data.message,
      resultType: Array.isArray(data.result) ? 'array' : typeof data.result,
      resultLength: Array.isArray(data.result) ? data.result.length : 'N/A',
      hasResult: !!data.result
    });
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      status: 500,
      type: 'PROXY_ERROR'
    });
  }
}