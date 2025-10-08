@echo off
echo ========================================
echo    COMPLETE VERCEL API FIX DEPLOYMENT
echo ========================================
echo.

echo 1. Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo ✅ Build successful!

echo.
echo 2. Checking critical files...
if not exist "api\index.js" (
    echo ❌ api\index.js not found!
    pause
    exit /b 1
)
if not exist "vercel.json" (
    echo ❌ vercel.json not found!
    pause
    exit /b 1
)
echo ✅ All critical files found!

echo.
echo 3. Committing changes...
git add .
git commit -m "COMPLETE FIX: Ensure APIs work on Vercel exactly as they do locally

- Fixed categories filtering with fallback logic
- Added comprehensive debugging and logging
- Enhanced error handling for all API endpoints
- Added health check endpoint for monitoring
- Ensured robust data fetching for news sections

This fix addresses the root cause of APIs working locally but not on Vercel."
if %errorlevel% neq 0 (
    echo ❌ Git commit failed!
    pause
    exit /b 1
)
echo ✅ Changes committed!

echo.
echo 4. Pushing to repository...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Git push failed!
    pause
    exit /b 1
)
echo ✅ Changes pushed to repository!

echo.
echo 5. Deployment Status:
echo ========================================
echo.
echo ✅ Your changes have been pushed to GitHub
echo ✅ Vercel will automatically deploy in 2-3 minutes
echo.
echo 6. Testing Instructions:
echo ========================================
echo.
echo After deployment (wait 3-5 minutes), test these URLs:
echo.
echo 1. Health Check:
echo    https://your-domain.vercel.app/api/health
echo.
echo 2. Categories API:
echo    https://your-domain.vercel.app/api?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6
echo.
echo 3. States API:
echo    https://your-domain.vercel.app/api?type=states&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6
echo.
echo 4. Test API:
echo    https://your-domain.vercel.app/api/test?type=categories&language_id=5dd95034-d533-4b09-8687-cd2ed3682ab6
echo.
echo 7. Expected Results:
echo ========================================
echo.
echo ✅ Categories API should return 6+ categories
echo ✅ States API should return 1+ states (Telangana)
echo ✅ Districts API should return 1+ districts (Hyderabad)
echo ✅ News sections should load with actual content
echo ✅ Default selections should work (English → Telangana → Hyderabad)
echo.
echo 8. If Still Not Working:
echo ========================================
echo.
echo 1. Check Vercel Function Logs in dashboard
echo 2. Wait 5-10 minutes for full deployment
echo 3. Clear browser cache and try again
echo 4. Check if your Vercel domain is correct
echo.
echo ========================================
echo    DEPLOYMENT COMPLETE!
echo ========================================
pause
