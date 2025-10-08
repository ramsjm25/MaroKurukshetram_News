@echo off
REM Vercel Deployment Script for MaroK News

echo 🚀 Starting deployment process...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Please install it first:
    echo npm install -g vercel
    pause
    exit /b 1
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Vercel. Please login first:
    echo vercel login
    pause
    exit /b 1
)

echo ✅ Vercel CLI is ready

REM Build the project
echo 📦 Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix the errors and try again.
    pause
    exit /b 1
)

echo ✅ Build successful

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
call vercel --prod

if %errorlevel% eq 0 (
    echo ✅ Deployment successful!
    echo.
    echo 🔧 Next steps:
    echo 1. Set the API_BASE_URL environment variable in Vercel dashboard:
    echo    https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1
    echo.
    echo 2. Test the API connectivity:
    echo    Visit: https://your-domain.vercel.app/api/test
    echo.
    echo 3. Check function logs in Vercel dashboard if there are any issues
) else (
    echo ❌ Deployment failed. Please check the errors above.
)

pause
