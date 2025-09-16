# Vercel Deployment Guide

## Issues Fixed

### 1. React Version Compatibility
- **Problem**: React 19 was causing compatibility issues with dependencies
- **Solution**: Downgraded to React 18.3.1 and compatible Three.js versions
- **Changes**: 
  - React: 19.0.0 → 18.3.1
  - React-DOM: 19.0.0 → 18.3.1
  - @react-three/fiber: 9.2.0 → 8.15.19
  - @react-three/drei: 10.5.1 → 9.88.13

### 2. Environment Variables
- **Problem**: Hardcoded Supabase credentials
- **Solution**: Made environment variables configurable
- **Changes**: Updated `lib/supabaseClient.js` to use environment variables

### 3. Middleware Configuration
- **Problem**: Middleware might interfere with static assets
- **Solution**: Improved middleware matcher and added static asset exclusions

## Deployment Steps

### 1. Environment Variables in Vercel
Set these environment variables in your Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://ihqtqrrzthefvkdivqbp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocXRxcnJ6dGhlZnZrZGl2cWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Mzc5MzQsImV4cCI6MjA2ODAxMzkzNH0.-sbD9bWfWLyI45LE6974rImSZ7WH4kjl0LUkJ-O4ekc
AUTH_COOKIE_NAME=bhasha_admin
NODE_ENV=production
```

### 2. Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Framework**: Next.js
- **Node.js Version**: 18.x

### 3. Vercel Configuration
The `vercel.json` file has been created with optimal settings:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "pages/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Pre-Deployment Checklist

- [x] Build passes locally (`npm run build`)
- [x] All dependencies are compatible
- [x] Environment variables are configured
- [x] Middleware is properly configured
- [x] Static assets are excluded from middleware
- [x] Vercel configuration is set

## Common Vercel Issues & Solutions

### 1. Build Failures
- **Cause**: React version incompatibility
- **Solution**: Use React 18.x instead of React 19

### 2. Runtime Errors
- **Cause**: Missing environment variables
- **Solution**: Set all required environment variables in Vercel dashboard

### 3. Middleware Issues
- **Cause**: Middleware interfering with static assets
- **Solution**: Exclude static paths from middleware matcher

### 4. Three.js Issues
- **Cause**: Incompatible Three.js versions
- **Solution**: Use versions compatible with React 18

## Testing Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Start production server:
   ```bash
   npm start
   ```

## Deployment Commands

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Fix deployment issues and update dependencies"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

## Monitoring

After deployment, monitor:
- Build logs in Vercel dashboard
- Runtime logs for any errors
- Environment variables are properly set
- All routes are accessible

## Rollback Plan

If deployment fails:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Rollback to previous working commit if needed
