# Netlify Deployment Guide for Kasthuribai E-commerce

## Quick Deploy Options

### Option 1: Deploy via Netlify UI (Recommended for beginners)

1. **Build your project locally first:**
   ```bash
   cd artifacts/kasthuribai
   pnpm install
   pnpm run build
   ```

2. **Go to [Netlify](https://app.netlify.com/) and sign in**

3. **Click "Add new site" → "Import an existing project"**

4. **Connect your Git repository** (GitHub, GitLab, or Bitbucket)

5. **Configure build settings:**
   - **Base directory:** `artifacts/kasthuribai`
   - **Build command:** `pnpm run build`
   - **Publish directory:** `artifacts/kasthuribai/dist`

6. **Click "Deploy site"**

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize Netlify in your project:**
   ```bash
   cd artifacts/kasthuribai
   netlify init
   ```

4. **Follow the prompts:**
   - Create & configure a new site
   - Select your team
   - Enter site name (or leave blank for random name)
   - Build command: `pnpm run build`
   - Directory to deploy: `dist`

5. **Deploy:**
   ```bash
   # Deploy to draft URL for testing
   netlify deploy

   # Deploy to production
   netlify deploy --prod
   ```

### Option 3: Drag & Drop Deploy

1. **Build your project:**
   ```bash
   cd artifacts/kasthuribai
   pnpm install
   pnpm run build
   ```

2. **Go to [Netlify](https://app.netlify.com/)**

3. **Drag and drop the `dist` folder** to the Netlify dashboard

## Environment Variables

If your application uses environment variables, add them in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Add your variables:
   ```
   VITE_API_URL=https://your-api.com
   VITE_APP_NAME=Kasthuribai
   ```

## Custom Domain Setup

1. Go to **Domain settings** → **Add custom domain**
2. Enter your domain name
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Netlify)

## Continuous Deployment

Once connected to Git:
- Every push to `main` branch → Production deploy
- Pull requests → Deploy previews
- Other branches → Branch deploys

## Build Configuration

The `netlify.toml` file includes:

### Build Settings
- **Publish directory:** `dist` (Vite output)
- **Build command:** `pnpm run build`
- **Node version:** 20
- **PNPM version:** 9

### Redirect Rules
- SPA routing: All routes redirect to `index.html`
- Ensures React Router works correctly

### Security Headers
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Content-Security-Policy: Configured for React app

### Caching
- Static assets: 1 year cache (immutable)
- Images: 1 year cache
- Videos: 1 year cache
- Audio files: 1 year cache

## Troubleshooting

### Build Fails
1. Check Node version (should be 20)
2. Ensure pnpm is installed: `npm install -g pnpm`
3. Clear cache: `pnpm store prune`
4. Check build logs in Netlify dashboard

### 404 Errors on Refresh
- The `netlify.toml` includes SPA redirect rules
- If still having issues, check the redirects in Netlify dashboard

### Large Files Not Uploading
- Netlify has a 100MB file size limit
- For large videos, consider using a CDN like Cloudinary or AWS S3

### Environment Variables Not Working
- Ensure variables start with `VITE_` for Vite
- Redeploy after adding environment variables

## Performance Optimization

The configuration includes:
- ✅ Static asset caching (1 year)
- ✅ Image optimization headers
- ✅ Video streaming support
- ✅ Security headers
- ✅ SPA routing

## Monitoring

After deployment:
1. Check **Analytics** in Netlify dashboard
2. Monitor **Functions** logs if using serverless functions
3. Set up **Forms** if needed
4. Enable **Lighthouse** plugin for performance monitoring

## Support

For Netlify-specific issues:
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community](https://community.netlify.com/)
- [Netlify Support](https://www.netlify.com/support/)

## Quick Commands Reference

```bash
# Local development
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run serve

# Deploy to Netlify (draft)
netlify deploy

# Deploy to Netlify (production)
netlify deploy --prod

# Open Netlify admin
netlify open

# View deploy logs
netlify logs
```
