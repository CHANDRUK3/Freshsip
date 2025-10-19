# VERCEL DEPLOYMENT CHECKLIST - ERROR PREVENTION GUIDE
*Run this checklist tomorrow morning before deploying to avoid all previous errors*

## PREVIOUS ERRORS RECAP & SOLUTIONS

### 1. BUILD ERRORS (Fixed)
❌ **Previous Error**: `vite` in devDependencies caused build failures
✅ **Solution**: Moved `vite` to dependencies in package.json
✅ **Status**: Already fixed and committed

❌ **Previous Error**: Duplicate imports in components
✅ **Solution**: Removed duplicate React imports
✅ **Status**: Already fixed and committed

### 2. SERVERLESS FUNCTION CONFLICTS (Fixed)
❌ **Previous Error**: `FUNCTION_INVOCATION_FAILED` due to api/[...path].js
✅ **Solution**: Deleted entire api/ folder to prevent Vercel routing conflicts
✅ **Status**: Verified - no api/ folder exists

### 3. ENVIRONMENT VARIABLE ERRORS (Critical - Must Verify)
❌ **Previous Error**: VITE_API_BASE pointing to localhost or placeholder domains
✅ **Solution**: Must set VITE_API_BASE=https://freshsip.onrender.com in Vercel dashboard
⚠️ **Action Required**: Set this in Vercel Environment Variables (Production)

### 4. CORS ERRORS (Fixed)
❌ **Previous Error**: CORS failures due to placeholder domains
✅ **Solution**: Updated server CORS to allow Vercel domains
✅ **Status**: Already fixed in server.js

## PRE-DEPLOYMENT VERIFICATION STEPS

### STEP 1: Environment Variables Audit
**Check Files:**
- ✅ `client/.env.local` contains: `VITE_API_BASE=https://freshsip.onrender.com`
- ✅ `client/.env.production` contains: `VITE_API_BASE=https://freshsip.onrender.com`
- ⚠️ Verify `server/.env.local` doesn't contain client vars (only server secrets)

**Vercel Dashboard Action:**
- Go to Vercel Project → Settings → Environment Variables
- Add: `VITE_API_BASE` = `https://freshsip.onrender.com` (Production)
- Ensure no old localhost or placeholder values exist

### STEP 2: Backend API Health Check
**Test Render Backend:**
```bash
curl https://freshsip.onrender.com/api/products
# Should return 8 products in JSON format
```

### STEP 3: File Structure Verification
**Must NOT Exist:**
- ❌ `api/` folder (deleted to prevent serverless conflicts)
- ❌ `vercel.json` with serverless config (if present, remove)

**Must Exist and Be Correct:**
- ✅ `client/package.json` - vite in dependencies
- ✅ `client/vite.config.js` - proper build config
- ✅ Root `.env` with `VITE_API_BASE=https://freshsip.onrender.com`

### STEP 4: Code Changes Verification
**Client API Integration:**
- ✅ `src/utils/api.js` uses `import.meta.env.VITE_API_BASE`
- ✅ All auth calls use centralized API_BASE
- ✅ No hardcoded localhost URLs in components

### STEP 5: Git Status Clean
**Before Deploy:**
```bash
git status
# Should show clean working directory or only intended changes
git push
# Ensure all fixes are on main branch
```

## DEPLOYMENT EXECUTION PLAN

### Phase 1: Pre-Deploy (Tomorrow Morning)
1. **Verify Vercel Limit Reset**: Check deployment count in dashboard
2. **Run Health Check**: Test Render backend endpoints
3. **Set Environment Variables**: Add VITE_API_BASE in Vercel dashboard
4. **Clean Commit**: Ensure all changes are pushed to main

### Phase 2: Deploy
1. **Trigger Deploy**: Push to main or manual deploy in Vercel dashboard
2. **Monitor Build Logs**: Watch for any build errors
3. **Wait for Deploy**: Typically 2-3 minutes for static site

### Phase 3: Post-Deploy Verification
1. **Test Homepage**: Verify site loads without errors
2. **Test Shops/Products**: Navigate to juice collection page
3. **Test API Calls**: Check network tab for successful API calls
4. **Test Auth Flow**: Try signup/login (optional but recommended)

## EMERGENCY ROLLBACK PLAN
If deployment fails:
1. **Check Vercel Function Logs**: Look for specific error messages
2. **Verify Environment Variables**: Ensure VITE_API_BASE is set correctly
3. **Check Network Tab**: Verify API calls go to Render, not localhost
4. **Rollback Option**: Revert to previous Vercel deployment if needed

## SUCCESS CRITERIA
✅ Homepage loads without console errors
✅ Juice Collection page shows products from Render backend
✅ No 404 errors on API calls
✅ No CORS errors in browser console
✅ Authentication flows work (signup/login)

## CONTACT POINTS
- Render Backend: https://freshsip.onrender.com
- Expected API: https://freshsip.onrender.com/api/products
- Vercel Frontend: [Will be available after deploy]

---
**Last Updated**: October 19, 2025
**Next Action**: Run this checklist tomorrow when Vercel limits reset
