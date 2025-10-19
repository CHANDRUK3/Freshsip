# Deploy Backend to Render

## Steps to Deploy

### 1. Go to Render.com
- Visit https://render.com
- Sign up/Sign in with your GitHub account

### 2. Create New Web Service
- Click **"New"** → **"Web Service"**
- Connect your GitHub account if not already connected
- Select the repository: **CHANDRUK3/Freshsip**

### 3. Configure Service Settings
- **Name**: `freshsip-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose your preferred region (e.g., Ohio, Oregon)
- **Branch**: `main`
- **Root Directory**: `server` (since backend code is in server/ folder)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Add Environment Variables
Click **"Add Environment Variable"** and add these:

```
MONGO_URI = mongodb+srv://chandruk26062005_db_user:_Gn8qgUu6EJSF95@freshsip.vv6nn2h.mongodb.net/freshsip
JWT_SECRET = chan26
NODE_ENV = production
```

### 5. Deploy
- Click **"Create Web Service"**
- Wait for deployment (usually 2-5 minutes)
- Watch the build logs for any errors

### 6. Get Your Backend URL
Once deployed, you'll get a URL like:
```
https://freshsip-backend.onrender.com
```

### 7. Test Your Backend
Visit your backend URL to confirm it's working:
- Root endpoint: `https://your-service.onrender.com/` should return `{"status":"ok","service":"FreshSip API"}`
- Products: `https://your-service.onrender.com/api/products` should return JSON with products array

## Important Notes

1. **Cold Starts**: Free Render services sleep after 15 minutes of inactivity. First request after sleep takes 30+ seconds.

2. **MongoDB IP Whitelist**: Ensure your MongoDB Atlas allows connections from `0.0.0.0/0` (all IPs) or add Render's IP ranges.

3. **CORS**: The backend is already configured to allow your Vercel frontend domains.

## Troubleshooting

- If build fails, check the logs in Render dashboard
- If MongoDB connection fails, verify the MONGO_URI environment variable
- If CORS errors, ensure your frontend domain is in the CORS allowlist in server.js
