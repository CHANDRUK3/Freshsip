#!/bin/bash

# Update Frontend with Render Backend URL
# Run this script after deploying backend to Render

echo "🔄 Updating frontend to use Render backend..."

# Get the Render URL from user
read -p "Enter your Render backend URL (e.g., https://freshsip-backend.onrender.com): " RENDER_URL

# Remove trailing slash if present
RENDER_URL=${RENDER_URL%/}

# Update .env.production
echo "# Environment variables for production deployment" > client/.env.production
echo "VITE_API_BASE=$RENDER_URL" >> client/.env.production

echo "✅ Updated client/.env.production with: $RENDER_URL"

# Also update any hardcoded URLs in the codebase
echo "🔍 Checking for hardcoded localhost URLs..."

# Search for localhost references in client src
grep -r "localhost:5000" client/src/ || echo "✅ No hardcoded localhost URLs found"

echo ""
echo "📝 Next steps:"
echo "1. Commit and push changes: git add . && git commit -m 'Update API base to Render backend' && git push"
echo "2. Redeploy frontend on Vercel (automatic if connected to GitHub)"
echo "3. Test your app at: https://freshsippp.vercel.app"
echo ""
echo "🧪 Test endpoints:"
echo "Backend root: $RENDER_URL/"
echo "Products API: $RENDER_URL/api/products"
echo "Auth API: $RENDER_URL/api/auth/signup"
