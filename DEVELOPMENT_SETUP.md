# Development Setup Guide

## 🚀 Quick Start

### Option 1: Using Vercel Dev (Recommended)
This runs the full Vercel environment locally with the API handler.

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Start the development server with Vercel
npm run dev:vercel
```

This will:
- Start the Vercel development server
- Run the API handler (`api/index.js`) locally
- Handle all API calls through the Vercel proxy
- Work exactly like production

### Option 2: Using Vite Dev with Proxy
This uses Vite's proxy to connect directly to the external API.

```bash
# Start the Vite development server
npm run dev
```

This will:
- Start Vite on port 8080
- Proxy API calls to the external API
- Handle CORS issues automatically

## 🔧 Environment Variables

### For Development
Create a `.env.local` file in the root directory:

```env
# Optional: Override the external API URL
VITE_API_BASE_URL=https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1

# Optional: Override the proxy target
VITE_PROXY_TARGET=https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1
```

### For Production (Vercel)
Set these in your Vercel dashboard:

```env
API_BASE_URL=https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1
```

## 🐛 Troubleshooting

### Issue: 404 Errors in Development
If you see 404 errors like:
```
GET http://localhost:8080/api/?type=categories&language_id=... 404 (Not Found)
```

**Solution 1: Use Vercel Dev**
```bash
npm run dev:vercel
```

**Solution 2: Check Vite Proxy**
Make sure the Vite proxy is working by checking the network tab in browser dev tools. The requests should show:
- Request URL: `http://localhost:8080/api?type=categories&language_id=...`
- Response should come from the external API

### Issue: CORS Errors
If you see CORS errors, use the Vercel dev server:
```bash
npm run dev:vercel
```

### Issue: API Not Responding
1. Check if the external API is accessible:
   ```bash
   curl "https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1/news/languages"
   ```

2. Check the Vercel function logs if using `vercel dev`

## 📁 File Structure

```
├── api/
│   └── index.js              # Vercel API handler
├── src/
│   ├── services/
│   │   └── api.ts           # API client configuration
│   ├── utils/
│   │   ├── categoryUtils.ts # Dynamic category management
│   │   └── newsUtils.ts     # Dynamic news fetching
│   └── components/          # All news components
├── vite.config.ts           # Vite configuration with proxy
└── vercel.json             # Vercel configuration
```

## 🔄 API Flow

### Development (Vite)
```
Frontend → Vite Proxy → External API
/api?type=categories → /news/categories
```

### Production (Vercel)
```
Frontend → Vercel API Handler → External API
/api?type=categories → api/index.js → /news/categories
```

## 🚀 Deployment

### Deploy to Vercel
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Set Environment Variables in Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add: `API_BASE_URL=https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1`

## ✅ Testing

### Test API Endpoints
```bash
# Test locally with Vercel dev
curl "http://localhost:3000/api?type=languages"

# Test locally with Vite dev
curl "http://localhost:8080/api?type=languages"

# Test production
curl "https://your-domain.vercel.app/api?type=languages"
```

### Test Dynamic Functionality
1. Start the development server
2. Open the application
3. Check browser console for any errors
4. Verify that news loads dynamically based on selected language
5. Test language switching
6. Test category-based news filtering

## 🎯 Key Features

- ✅ **Fully Dynamic**: No hardcoded data
- ✅ **Multi-language Support**: Works with any language from API
- ✅ **Multi-region Support**: Works with any state/district from API
- ✅ **Dynamic Categories**: Fetches categories based on language
- ✅ **Dynamic News**: Fetches news based on available categories
- ✅ **Error Handling**: Graceful fallbacks for API failures
- ✅ **Caching**: Performance optimization with category caching
