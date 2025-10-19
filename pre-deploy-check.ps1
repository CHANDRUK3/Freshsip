# Pre-Deploy Verification Script
# Run this tomorrow morning before Vercel deployment

Write-Host "🚀 FreshSip Pre-Deploy Verification Starting..." -ForegroundColor Green

# Test 1: Verify Render Backend
Write-Host "`n1. Testing Render Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://freshsip.onrender.com/api/products" -Method GET -TimeoutSec 10
    $productCount = $response.products.Count
    Write-Host "   ✅ Backend working: $productCount products found" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend test failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Check Environment Files
Write-Host "`n2. Checking Environment Files..." -ForegroundColor Yellow

if (Test-Path "client/.env.local") {
    $clientEnv = Get-Content "client/.env.local"
    if ($clientEnv -match "VITE_API_BASE=https://freshsip.onrender.com") {
        Write-Host "   ✅ client/.env.local correct" -ForegroundColor Green
    } else {
        Write-Host "   ❌ client/.env.local incorrect" -ForegroundColor Red
        Write-Host "      Content: $clientEnv" -ForegroundColor Gray
    }
}

if (Test-Path "client/.env.production") {
    $prodEnv = Get-Content "client/.env.production"
    if ($prodEnv -match "VITE_API_BASE=https://freshsip.onrender.com") {
        Write-Host "   ✅ client/.env.production correct" -ForegroundColor Green
    } else {
        Write-Host "   ❌ client/.env.production needs update" -ForegroundColor Red
    }
}

# Test 3: Verify No API Folder
Write-Host "`n3. Checking for Serverless Conflicts..." -ForegroundColor Yellow
if (Test-Path "api/") {
    Write-Host "   ❌ api/ folder exists - REMOVE IT!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "   ✅ No api/ folder - serverless conflicts prevented" -ForegroundColor Green
}

# Test 4: Check Package.json Dependencies  
Write-Host "`n4. Verifying Package Dependencies..." -ForegroundColor Yellow
$packageJson = Get-Content "client/package.json" | ConvertFrom-Json
if ($packageJson.dependencies.vite) {
    Write-Host "   ✅ vite in dependencies (not devDependencies)" -ForegroundColor Green
} else {
    Write-Host "   ❌ vite missing from dependencies" -ForegroundColor Red
}

# Test 5: Git Status
Write-Host "`n5. Checking Git Status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   ⚠️  Uncommitted changes found:" -ForegroundColor Yellow
    git status --short
    Write-Host "   Consider committing before deploy" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Git working directory clean" -ForegroundColor Green
}

Write-Host "`n🎯 READY FOR VERCEL DEPLOY!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel Dashboard" -ForegroundColor White
Write-Host "2. Set Environment Variable: VITE_API_BASE = https://freshsip.onrender.com" -ForegroundColor White
Write-Host "3. Trigger deploy (push to main or manual deploy)" -ForegroundColor White
Write-Host "4. Monitor build logs for errors" -ForegroundColor White
Write-Host "5. Test shops loading after deploy completes" -ForegroundColor White
