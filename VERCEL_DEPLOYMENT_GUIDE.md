# Vercel Deployment Guide

## Environment Variables

Set these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

```
API_BASE_URL=https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1
```

## API Configuration

The application is now configured to work with Vercel's serverless functions:

### API Routes

- **Main API Handler**: `/api/index.js` - Handles all API requests
- **Test Endpoint**: `/api/test.js` - Test API connectivity
- **Environment Check**: `/api/env-check.js` - Check environment variables
- **Vercel Rewrites**: All `/api/*` requests are routed to the main handler

### Supported Endpoints

1. **Data Endpoints** (using `?type=` parameter):
   - `GET /api?type=languages` - Get all languages
   - `GET /api?type=categories&language_id={id}` - Get categories for language
   - `GET /api?type=states&language_id={id}` - Get states for language
   - `GET /api?type=districts&language_id={id}&state_id={id}` - Get districts
   - `GET /api?type=urgency-patterns` - Get urgency patterns
   - `GET /api?type=category-keywords` - Get category keywords

2. **Auth Endpoints** (using `?action=` parameter):
   - `POST /api?action=login` - User login
   - `POST /api?action=register` - User registration
   - `POST /api?action=forgot-password` - Forgot password
   - `POST /api?action=verify-code` - Verify OTP
   - `POST /api?action=reset-password` - Reset password

3. **Direct Endpoints**:
   - `GET /api/news/filter-advanced` - Get filtered news
   - `GET /api/news/{id}` - Get single news item
   - `GET /api/local-mandi-categories` - Get local mandi categories
   - `GET /api/e-newspapers` - Get e-newspapers

## Testing

After deployment, test the API connectivity:

1. **Environment Check**: Visit `https://your-domain.vercel.app/api/env-check` to verify environment variables
2. **API Test**: Visit `https://your-domain.vercel.app/api/test` to test API connectivity
3. **Individual Endpoints**: Test specific endpoints using the frontend or curl
4. **Function Logs**: Check Vercel function logs for detailed error information

## Troubleshooting

### Common Issues

1. **CORS Errors**: The API handler includes proper CORS headers
2. **Timeout Errors**: Functions have 30-second timeout (10 seconds for test)
3. **Environment Variables**: Ensure `API_BASE_URL` is set in Vercel
4. **Function Logs**: Check Vercel function logs for detailed error information
5. **Empty Results**: Check if external API is returning data correctly

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   curl https://your-domain.vercel.app/api/env-check
   ```

2. **Test API Connectivity**:
   ```bash
   curl https://your-domain.vercel.app/api/test
   ```

3. **Test Specific Endpoints**:
   ```bash
   # Test languages
   curl "https://your-domain.vercel.app/api?type=languages"
   
   # Test categories
   curl "https://your-domain.vercel.app/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6"
   
   # Test e-newspapers
   curl "https://your-domain.vercel.app/api/e-newspapers?language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6"
   ```

4. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard > Functions
   - Click on the function name
   - Check the logs for errors

5. **Verify External API**:
   ```bash
   curl "https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1/news/languages"
   ```

### Expected Response Format

All API endpoints should return responses in this format:
```json
{
  "status": 1,
  "message": "Success message",
  "result": [...] // Array of data
}
```

## Deployment Commands

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod

# Or use Vercel CLI
vercel deploy
```

## Quick Fixes

If you're still experiencing issues:

1. **Redeploy**: Sometimes a fresh deployment fixes issues
2. **Check Environment Variables**: Ensure `API_BASE_URL` is set correctly
3. **Clear Cache**: Clear browser cache and try again
4. **Check External API**: Verify the external API is working
5. **Function Logs**: Check Vercel function logs for specific errors
