# Vercel API Troubleshooting Guide

## 🚨 Current Issue: APIs Not Working on Vercel

### Problem Description
After deploying to Vercel, the following APIs are not returning data:
- ❌ Categories API returns empty array
- ❌ States API returns 0 items  
- ❌ Districts API returns 0 items
- ❌ News data not loading

### Root Cause Analysis

#### 1. Categories API Issue
**Problem**: The filtering logic was too strict, filtering out valid categories
**Solution**: Updated filtering to include categories with `is_deleted: null`

```javascript
// Before (WRONG)
data.result = data.result.filter(category => 
  category.is_active === 1 && category.is_deleted === 0
);

// After (FIXED)
data.result = data.result.filter(category => 
  category.is_active === 1 && (category.is_deleted === 0 || category.is_deleted === null)
);
```

#### 2. API Handler Location
**File**: `api/index.js`
**Status**: ✅ Updated with comprehensive debugging and robust filtering

#### 3. Vercel Configuration
**File**: `vercel.json`
**Status**: ✅ Correctly configured to route `/api/*` to `api/index.js`

## 🔧 Fix Implementation

### Step 1: Verify Local Fix
```bash
# Test locally with Vercel dev
npm run dev:vercel

# In another terminal, test the APIs
node test-vercel-fix.js
```

### Step 2: Deploy to Vercel
```bash
# Option 1: Use deployment script
deploy-fix.bat

# Option 2: Manual deployment
git add .
git commit -m "Fix Vercel API categories filtering"
git push origin main
```

### Step 3: Test Production
```bash
# Update the baseUrl in test-production-apis.js with your Vercel domain
node test-production-apis.js
```

## 🧪 Testing Commands

### Test Individual APIs
```bash
# Test categories
curl "https://your-domain.vercel.app/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6"

# Test states
curl "https://your-domain.vercel.app/api?type=states&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6"

# Test districts
curl "https://your-domain.vercel.app/api?type=districts&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6&state_id=b6be8d5c-f276-4d63-b878-6fc765180ccf"

# Test test endpoint
curl "https://your-domain.vercel.app/api/test?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6"
```

### Expected Results
```json
// Categories API should return:
{
  "status": 1,
  "message": "Categories fetched successfully",
  "result": [
    {
      "id": "8f8d4645-fe69-449f-8cc9-7b86f739d62b",
      "category_name": "Breaking News",
      "is_active": 1,
      "is_deleted": 0
    },
    // ... more categories
  ]
}
```

## 🔍 Debugging Steps

### 1. Check Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Click on `api/index.js`
5. Check the logs for errors

### 2. Check API Response
```bash
# Test with verbose output
curl -v "https://your-domain.vercel.app/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6"
```

### 3. Check External API
```bash
# Test external API directly
curl "https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1/news/categories?language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6"
```

## 🚀 Deployment Checklist

- [ ] ✅ Updated `api/index.js` with robust filtering
- [ ] ✅ Added comprehensive debugging logs
- [ ] ✅ Created test endpoints (`api/test.js`)
- [ ] ✅ Verified `vercel.json` configuration
- [ ] ✅ Created test scripts
- [ ] ⏳ Deploy to Vercel
- [ ] ⏳ Test production APIs
- [ ] ⏳ Verify news loading

## 📊 Expected Console Output

After the fix, you should see in Vercel logs:
```
[Categories API] Raw categories before filtering: 11
[Categories API] Sample category before filtering: {id: "...", category_name: "Breaking News", ...}
[Categories API] Filtering out category: Technology (active: 1, deleted: 1)
[Categories API] Filtered from 11 to 6 active categories
[Categories API] Active categories: ["Breaking News", "International News", "Politics", "National", "Entertainment", "Business", "Sports"]
[Categories API] Final response: {status: 1, resultType: "array", resultLength: 6, hasResult: true}
```

## 🎯 Success Criteria

The fix is successful when:
- ✅ Categories API returns 6+ active categories
- ✅ States API returns 1+ states (Telangana)
- ✅ Districts API returns 1+ districts (Hyderabad)
- ✅ News sections load with actual content
- ✅ Default selections work (English → Telangana → Hyderabad)

## 🆘 If Still Not Working

1. **Check Vercel Function Logs**: Look for errors in the Vercel dashboard
2. **Verify Environment Variables**: Ensure `API_BASE_URL` is set correctly
3. **Test External API**: Verify the external API is still working
4. **Check Network Tab**: Look for 404 or 500 errors in browser dev tools
5. **Redeploy**: Try redeploying the function manually

## 📞 Support

If the issue persists after following this guide:
1. Check Vercel function logs
2. Test the external API directly
3. Verify the deployment was successful
4. Check for any CORS or network issues
