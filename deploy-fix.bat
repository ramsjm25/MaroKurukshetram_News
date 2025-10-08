@echo off
echo ========================================
echo    Vercel API Fix Deployment Script
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
echo 2. Checking API files...
if not exist "api\index.js" (
    echo ❌ api\index.js not found!
    pause
    exit /b 1
)
echo ✅ API files found!

echo.
echo 3. Checking Vercel configuration...
if not exist "vercel.json" (
    echo ❌ vercel.json not found!
    pause
    exit /b 1
)
echo ✅ Vercel configuration found!

echo.
echo 4. Committing changes...
git add .
git commit -m "Fix Vercel API categories filtering and add comprehensive debugging"
if %errorlevel% neq 0 (
    echo ❌ Git commit failed!
    pause
    exit /b 1
)
echo ✅ Changes committed!

echo.
echo 5. Pushing to repository...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Git push failed!
    pause
    exit /b 1
)
echo ✅ Changes pushed to repository!

echo.
echo 6. Deployment instructions:
echo ========================================
echo.
echo Your changes have been pushed to the repository.
echo Vercel should automatically deploy the changes.
echo.
echo To test the deployment:
echo 1. Wait 2-3 minutes for Vercel to deploy
echo 2. Run: node test-production-apis.js
echo 3. Check your Vercel dashboard for deployment status
echo.
echo If deployment doesn't happen automatically:
echo 1. Go to your Vercel dashboard
echo 2. Find your project
echo 3. Click "Deploy" or "Redeploy"
echo.
echo ========================================
pause
