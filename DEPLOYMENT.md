# Deployment Guide for Fubo Affiliate Partner Home Base

This guide covers the steps required to deploy the Fubo Affiliate Partner Home Base application to either Vercel or Netlify.

## Prerequisites

Before deployment, ensure you have:

1. A GitHub account and repository containing the project code
2. A Vercel or Netlify account
3. Properly configured environment variables (see `.env.example`)

## Deploying to Vercel

Vercel is the recommended platform for Next.js applications, offering seamless integration and optimized performance.

### Step 1: Prepare Your Project

1. Make sure your project has a `next.config.js` file with proper configuration:
   ```javascript
   module.exports = {
     images: {
       domains: ['images.fubo.tv'],
     },
   }
   ```

2. Ensure the `package.json` has the correct build scripts:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "next lint"
   }
   ```

### Step 2: Deploy with Vercel

1. Log in to [Vercel](https://vercel.com/) and click "New Project"
2. Import your GitHub repository
3. Configure project settings:
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. Configure environment variables:
   - Copy the variables from `.env.example` and add the production values
   - Make sure to set `NEXT_PUBLIC_APP_ENV=production`

5. Click "Deploy"

### Step 3: Custom Domain (Optional)

1. In your project settings on Vercel, go to "Domains"
2. Add your custom domain (e.g., `affiliate.fubo.tv`)
3. Follow the DNS configuration instructions provided by Vercel

## Deploying to Netlify

Netlify is another excellent platform for hosting modern web applications.

### Step 1: Prepare Your Project

1. Create a `netlify.toml` file in the root of your project:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [build.environment]
     NODE_VERSION = "18.0.0"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. Install the Netlify Next.js plugin as a dev dependency:
   ```bash
   npm install -D @netlify/plugin-nextjs
   ```

### Step 2: Deploy with Netlify

1. Log in to [Netlify](https://app.netlify.com/) and click "New site from Git"
2. Connect to your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

4. Configure environment variables:
   - Go to Site settings > Build & Deploy > Environment
   - Add the variables from `.env.example` with production values
   - Make sure to set `NEXT_PUBLIC_APP_ENV=production`

5. Click "Deploy site"

### Step 3: Custom Domain (Optional)

1. In your site settings on Netlify, go to "Domain management"
2. Click "Add custom domain"
3. Enter your domain (e.g., `affiliate.fubo.tv`)
4. Follow the DNS configuration instructions provided by Netlify

## Post-Deployment Verification

After deploying to either platform, verify that:

1. The application loads correctly
2. API requests work as expected
3. Images are loading properly
4. Authentication (if enabled) functions correctly
5. No console errors appear in the browser

## Continuous Integration/Deployment

Both Vercel and Netlify support automatic deployments when you push to your repository:

- **Production Branch**: Configure `main` or `master` to deploy to production
- **Preview Branches**: Feature branches can deploy to preview URLs for testing

## Troubleshooting Common Issues

### Images Not Loading

- Verify that the domain is properly configured in `next.config.js`
- Check that image URLs are properly formatted in the code

### API Requests Failing

- Ensure environment variables are correctly set
- Check CORS configuration if using a separate API

### Build Errors

- Check build logs for specific error messages
- Ensure all dependencies are included in package.json

## Monitoring and Analytics

Consider adding:

1. **Error Monitoring**: Integrate Sentry or similar service
2. **Analytics**: Configure Google Analytics or Vercel Analytics
3. **Performance Monitoring**: Use Lighthouse CI for automated performance checks

## Regular Maintenance

Schedule regular updates for:

1. Next.js and other dependency updates
2. Security patches
3. Performance optimizations 