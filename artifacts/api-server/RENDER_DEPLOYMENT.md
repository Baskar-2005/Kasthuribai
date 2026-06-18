# Deploying API Server to Render

## Prerequisites

1. Create a Render account at https://render.com
2. Connect your GitHub/GitLab repository to Render

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub/GitLab with the `render.yaml` file
2. In Render dashboard, click "New" > "Blueprint"
3. Select your repository
4. Render will automatically detect the `render.yaml` and create the service
5. Add environment variables in Render dashboard:
   - `RAZORPAY_KEY_ID`: Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay key secret
   - `CORS_ORIGIN`: Your Netlify site URL (e.g., `https://your-site.netlify.app`)

### Option 2: Manual Setup

1. In Render dashboard, click "New" > "Web Service"
2. Connect your repository
3. Configure the service:
   - **Name**: kasthuribai-api
   - **Runtime**: Node
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm run start`
   - **Plan**: Free
4. Add environment variables:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `RAZORPAY_KEY_ID`: Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay key secret
   - `CORS_ORIGIN`: Your Netlify site URL
   - `LOG_LEVEL`: info
5. Click "Create Web Service"

## After Deployment

1. Copy your Render service URL (e.g., `https://kasthuribai-api.onrender.com`)
2. Update your Netlify environment variables:
   - Go to Netlify site settings
   - Navigate to "Build & deploy" > "Environment"
   - Update `VITE_API_URL` to: `https://kasthuribai-api.onrender.com/api`
3. Redeploy your Netlify site

## Health Check

The API server includes a health check endpoint at `/api/health` that Render will use to monitor the service.

## Troubleshooting

### Service won't start
- Check the logs in Render dashboard
- Ensure all environment variables are set correctly
- Verify the build command completes successfully

### CORS errors
- Make sure `CORS_ORIGIN` is set to your exact Netlify site URL
- Include the protocol (https://) in the URL

### Razorpay errors
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set correctly
- Check that you're using test keys for development

## Free Tier Limitations

- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to a paid plan for production use
