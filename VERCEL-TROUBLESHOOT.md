# Vercel Environment Variable Setup

## Current Issue: FUNCTION_INVOCATION_FAILED

This error occurs because Vercel might still be caching the old serverless functions or the environment variable isn't set properly.

## Solution Steps:

### 1. Set Environment Variable in Vercel Dashboard
Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add:
```
VITE_API_BASE = https://freshsip.onrender.com
```
**Environment:** Production
**Git Branch:** main

### 2. Force Redeploy
After setting the environment variable:
- Go to Deployments tab
- Click "Redeploy" on the latest deployment
- Select "Use existing Build Cache: No"

### 3. Alternative: Add .env to Root (Backup)
If Vercel doesn't read client/.env.production, create root-level .env:

```bash
# .env (root level)
VITE_API_BASE=https://freshsip.onrender.com
```

### 4. Verify Deployment
After redeploy, check:
- No /api folder should exist in deployment
- All requests should go to https://freshsip.onrender.com
- No FUNCTION_INVOCATION_FAILED errors

## Current Status:
✅ Serverless functions removed
✅ API_BASE configuration updated  
✅ Frontend committed and pushed
⏳ Waiting for Vercel environment variable setup
