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

1. Visit `https://your-domain.vercel.app/api/test` to test API connectivity
2. Check Vercel function logs for any errors
3. Test the main endpoints using the frontend

## Troubleshooting

### Common Issues

1. **CORS Errors**: The API handler includes proper CORS headers
2. **Timeout Errors**: Functions have 30-second timeout (10 seconds for test)
3. **Environment Variables**: Ensure `API_BASE_URL` is set in Vercel
4. **Function Logs**: Check Vercel function logs for detailed error information

### Debug Steps

1. Check Vercel function logs
2. Test individual endpoints using curl or Postman
3. Verify environment variables are set correctly
4. Check external API connectivity

## Deployment Commands

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod

# Or use Vercel CLI
vercel deploy
```
