# Deploy Frontend to Netlify (Alternative to Vercel)

## Quick Netlify Deployment

### 1. Build the Frontend
```bash
cd client
npm run build
```

### 2. Deploy to Netlify
Go to: https://netlify.com
- Sign up/Login with GitHub
- Click "New site from Git"
- Choose your GitHub repository: CHANDRUK3/Freshsip
- Configure:
  - **Build command**: `cd client && npm run build`
  - **Publish directory**: `client/dist`
  - **Environment variables**:
    - `VITE_API_BASE` = `https://freshsip.onrender.com`

### 3. Deploy
- Click "Deploy site"
- You'll get a URL like: `https://amazing-name-123456.netlify.app`

## Alternative: Manual Upload
1. Run `cd client && npm run build` locally
2. Go to https://app.netlify.com/drop
3. Drag and drop the `client/dist` folder
4. Instant deployment!

## Environment Variable Setup
In Netlify dashboard:
- Site settings → Environment variables
- Add: `VITE_API_BASE = https://freshsip.onrender.com`
