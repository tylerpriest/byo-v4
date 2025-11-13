# Vercel Deployment Guide

## Quick Deploy

The easiest way to deploy BYO v4 is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## Manual Deployment

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase project (for production)

### Step 1: Prepare Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### Step 3: Environment Variables

Add the following environment variables in Vercel:

**Required** (for production mode):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...your_key_here
```

**Optional**:
```
VITE_DEMO_MODE=false
VITE_APP_NAME=BYO v4
VITE_APP_URL=https://your-domain.vercel.app
```

To add environment variables:
1. Go to Project Settings → Environment Variables
2. Add each variable with:
   - **Key**: Variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value**: Your value
   - **Environment**: Production (and Preview if needed)

### Step 4: Deploy

Click "Deploy" and wait for the build to complete (~2 minutes).

Your app will be live at: `https://your-project.vercel.app`

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Pull Request** → Preview deployment
- **Push to other branches** → Preview deployment (optional)

### Configure Branch Deployments

1. Go to Project Settings → Git
2. Configure:
   - **Production Branch**: `main`
   - **Preview Deployments**: Enable for all branches

## Custom Domain

### Add Custom Domain

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `app.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (~24 hours)

### Update Supabase

After adding a custom domain, update Supabase settings:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your domain to:
   - **Site URL**: `https://app.yourdomain.com`
   - **Redirect URLs**: `https://app.yourdomain.com/**`

## Environment-Specific Configuration

### Production

```
VITE_SUPABASE_URL=https://production.supabase.co
VITE_SUPABASE_ANON_KEY=production_key
VITE_DEMO_MODE=false
VITE_APP_URL=https://app.yourdomain.com
```

### Preview (Optional)

```
VITE_SUPABASE_URL=https://staging.supabase.co
VITE_SUPABASE_ANON_KEY=staging_key
VITE_DEMO_MODE=true  # Optional: use demo mode for previews
VITE_APP_URL=https://preview.vercel.app
```

## Build Configuration

### vercel.json (Optional)

Create `vercel.json` in root for advanced configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Performance Optimization

Vercel automatically optimizes:
- ✅ Static file compression (Gzip, Brotli)
- ✅ CDN distribution (global edge network)
- ✅ Image optimization (optional)
- ✅ Serverless functions (if used)
- ✅ Smart caching

## Monitoring & Analytics

### Vercel Analytics

Enable analytics in Project Settings → Analytics

Features:
- Real User Monitoring (RUM)
- Core Web Vitals
- Page load times
- Geographic distribution

### Custom Monitoring

Consider adding:
- **Sentry** for error tracking
- **PostHog** for product analytics
- **LogRocket** for session replay

## Deployment Verification

After deployment, verify:

- [ ] App loads at production URL
- [ ] Demo mode is disabled (if Supabase configured)
- [ ] Login/signup works
- [ ] Protected routes redirect correctly
- [ ] Environment variables are loaded
- [ ] No console errors
- [ ] SSL certificate is valid
- [ ] Custom domain works (if configured)

### Quick Test Script

```bash
# Test production URL
curl -I https://your-app.vercel.app

# Should return 200 OK
# SSL certificate should be valid
```

## Troubleshooting

### Build Fails

**Check build logs** in Vercel dashboard for errors.

Common issues:
- TypeScript errors: Run `npm run type-check` locally
- Missing dependencies: Ensure `package.json` is committed
- Build command incorrect: Verify in `package.json` scripts

### Environment Variables Not Loading

- Vercel embeds env vars at **build time**
- After changing variables, **trigger a redeploy**
- Check variables are prefixed with `VITE_`

### 404 Errors on Routes

Add `vercel.json` with rewrites (see above) to handle client-side routing.

### Supabase Connection Issues

- Verify environment variables are correct
- Check Supabase URL configuration
- Ensure redirect URLs are set in Supabase
- Test locally with same credentials

## Rolling Back

If deployment has issues:

1. Go to Deployments in Vercel
2. Find working deployment
3. Click "..." → "Promote to Production"

## Database Migrations

### Manual Migration on Deploy

1. Apply migrations in Supabase Dashboard
2. Deploy application
3. Verify schema matches

### Automated Migrations (Advanced)

Use Vercel Deploy Hooks with Supabase CLI:

```yaml
# .github/workflows/deploy.yml
name: Deploy with Migrations

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Supabase CLI
        run: npm install -g supabase

      - name: Run migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## Cost Estimation

### Vercel Pricing (as of 2024)

**Hobby (Free)**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Good for: Side projects, demos

**Pro ($20/month)**:
- ✅ Unlimited team members
- ✅ 1 TB bandwidth/month
- ✅ Advanced analytics
- ✅ Priority support
- ✅ Good for: Small teams, production apps

**Enterprise (Custom)**:
- ✅ Dedicated infrastructure
- ✅ SLA guarantees
- ✅ Advanced security
- ✅ Good for: Large organizations

### Supabase Pricing

**Free Tier**:
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- Good for: Development, small apps

**Pro ($25/month)**:
- 8 GB database
- 100 GB file storage
- 100,000 monthly active users
- Daily backups
- Good for: Production apps

## Security Checklist

Before deploying to production:

- [ ] Environment variables are set correctly
- [ ] Demo mode is disabled for production
- [ ] Supabase RLS policies are enabled
- [ ] Email verification is enabled
- [ ] Redirect URLs are configured
- [ ] HTTPS is enforced
- [ ] Security headers are set (via vercel.json)
- [ ] Error reporting is configured
- [ ] Monitoring is set up
- [ ] Backups are enabled

## Post-Deployment

After successful deployment:

1. **Test thoroughly** in production
2. **Monitor errors** in first 24 hours
3. **Set up alerts** for downtime
4. **Configure backups** (Supabase)
5. **Document** production URLs and credentials
6. **Share** with team

## Alternative Platforms

While Vercel is recommended, you can also deploy to:

- **Netlify**: Similar to Vercel
- **AWS Amplify**: AWS ecosystem
- **Cloudflare Pages**: Edge-first
- **Railway**: Full-stack deployment
- **Fly.io**: Distributed applications

See platform-specific guides in their documentation.

## Getting Help

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: Report problems in your repository
- **Community**: Vercel Discord, Supabase Discord

## Maintenance

Regular maintenance tasks:

- **Weekly**: Check error logs
- **Monthly**: Review analytics, update dependencies
- **Quarterly**: Security audit, backup verification
- **Yearly**: Review hosting costs, scale as needed
