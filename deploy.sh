#!/bin/bash

# Vercel Deployment Script for MaroK News

echo "🚀 Starting deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please login first:"
    echo "vercel login"
    exit 1
fi

echo "✅ Vercel CLI is ready"

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Set the API_BASE_URL environment variable in Vercel dashboard:"
    echo "   https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1"
    echo ""
    echo "2. Test the API connectivity:"
    echo "   Visit: https://your-domain.vercel.app/api/test"
    echo ""
    echo "3. Check function logs in Vercel dashboard if there are any issues"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
