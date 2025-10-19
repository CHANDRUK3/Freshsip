# Update Frontend with Render Backend URL
# Run this script after deploying backend to Render

Write-Host "🔄 Updating frontend to use Render backend..." -ForegroundColor Yellow

# Get the Render URL from user
$RENDER_URL = Read-Host "Enter your Render backend URL (e.g., https://freshsip-backend.onrender.com)"

# Remove trailing slash if present
$RENDER_URL = $RENDER_URL.TrimEnd('/')

# Update .env.production
$envContent = @"
# Environment variables for production deployment
VITE_API_BASE=$RENDER_URL
"@

$envContent | Out-File -FilePath "client\.env.production" -Encoding UTF8

Write-Host "✅ Updated client/.env.production with: $RENDER_URL" -ForegroundColor Green

# Check for hardcoded localhost URLs
Write-Host "🔍 Checking for hardcoded localhost URLs..." -ForegroundColor Yellow
$localhostRefs = Get-ChildItem -Path "client\src" -Recurse -Include "*.js","*.jsx","*.ts","*.tsx" | Select-String "localhost:5000"

if ($localhostRefs) {
    Write-Host "⚠️  Found hardcoded localhost references:" -ForegroundColor Red
    $localhostRefs | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" }
    Write-Host "Please update these manually to use the API_BASE variable" -ForegroundColor Yellow
} else {
    Write-Host "✅ No hardcoded localhost URLs found" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Commit and push changes: git add . && git commit -m 'Update API base to Render backend' && git push"
Write-Host "2. Redeploy frontend on Vercel (automatic if connected to GitHub)"
Write-Host "3. Test your app at: https://freshsippp.vercel.app"
Write-Host ""
Write-Host "🧪 Test endpoints:" -ForegroundColor Cyan
Write-Host "Backend root: $RENDER_URL/"
Write-Host "Products API: $RENDER_URL/api/products"
Write-Host "Auth API: $RENDER_URL/api/auth/signup"
