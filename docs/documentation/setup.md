# Setup Guide - BYO v4

## Quick Start (Demo Mode)

The fastest way to try BYO v4 is with demo mode - no backend setup required!

```bash
# Clone the repository
git clone <your-repo-url>
cd byo-v4

# Install dependencies
npm install

# Start development server (demo mode auto-enables)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click "Demo User Login" or "Demo Admin Login" to try the app instantly!

## Production Setup

For production use with a real database, follow these steps:

### 1. Prerequisites

- Node.js 22+ and npm 10+
- Git
- Supabase account (free tier available)

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### A. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be created (~2 minutes)

#### B. Get API Credentials

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

#### C. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbG...your_key_here
   VITE_DEMO_MODE=false
   ```

### 4. Set Up Database Schema

#### A. Install Supabase CLI (Optional but Recommended)

```bash
npm install -g supabase
```

#### B. Apply Migrations

You have two options:

**Option 1: Using Supabase Dashboard (Recommended for First Time)**

1. Go to your project in Supabase Dashboard
2. Click "SQL Editor"
3. Copy and paste the SQL from `/docs/specs/database-schema.md`
4. Execute each section in order:
   - Extensions
   - Types (ENUMs)
   - Helper Functions
   - Tables (in dependency order)
   - RLS Policies
   - Indexes
   - Triggers
   - Seed Data

**Option 2: Using Supabase CLI**

```bash
# Link to your project
supabase link --project-ref your-project-id

# Create migration file
supabase migration new initial_schema

# Copy SQL from docs/specs/database-schema.md to the migration file
# Then apply migrations
supabase db push
```

### 5. Generate TypeScript Types (Optional)

```bash
npx supabase gen types typescript --project-id your-project-id > src/lib/supabase/database.types.ts
```

Update `/src/lib/supabase/types.ts` with generated types.

### 6. Test the Setup

```bash
# Start development server
npm run dev

# Visit http://localhost:5173
# Try logging in with real credentials (or sign up)
```

**Note**: Demo mode will automatically disable once Supabase credentials are configured.

### 7. Verify Everything Works

- [ ] Landing page loads
- [ ] Login page works (no demo buttons visible)
- [ ] User can sign up
- [ ] User receives verification email
- [ ] User can log in after verification
- [ ] Dashboard loads with user info
- [ ] User can log out
- [ ] Protected routes redirect to login

## Development Workflow

### Running the App

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run E2E tests (when configured)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Environment Variables Reference

### Required (Production)

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

### Optional

- `VITE_DEMO_MODE` - Set to `"true"` to force demo mode (default: auto-detect)
- `VITE_APP_NAME` - Application name (default: "BYO v4")
- `VITE_APP_URL` - Application URL (default: "http://localhost:5173")

### Auto-Detection Rules

Demo mode automatically enables when:
1. `VITE_DEMO_MODE=true` is set, OR
2. `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing

## Troubleshooting

### "Demo Mode Active" Banner Won't Go Away

**Cause**: Missing or incorrect Supabase credentials

**Solution**:
1. Verify `.env` file exists in project root
2. Check credentials are correct
3. Restart dev server (`npm run dev`)
4. Check browser console for specific errors

### Build Errors

**TypeScript Errors**:
```bash
npm run type-check
```

**Fix common issues**:
- Run `npm install` to ensure dependencies are installed
- Check `tsconfig.json` is not modified
- Verify import paths use `@/` alias

**ESLint Errors**:
```bash
npm run lint:fix
```

### Database Errors

**"Row Level Security policy violation"**:
- RLS policies are not correctly set up
- User is not authenticated
- Check Supabase logs in Dashboard

**"relation does not exist"**:
- Database schema not applied
- Follow "Set Up Database Schema" section

### Authentication Errors

**"Email not confirmed"**:
- Check Supabase Dashboard → Authentication → Users
- Confirm email or disable email confirmation in settings

**"Invalid login credentials"**:
- User doesn't exist or password is wrong
- Reset password via Supabase Auth

### Preview/Production Issues

**Environment variables not loading**:
- Vite only includes variables prefixed with `VITE_`
- Variables are embedded at build time
- Rebuild after changing `.env`: `npm run build`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

Vercel automatically:
- Installs dependencies
- Runs build command
- Deploys to CDN

### Other Platforms

See `/docs/documentation/deployment.md` for other platforms (Netlify, AWS, etc.)

## Next Steps

After setup is complete:

1. **Customize the app**:
   - Update branding in `index.html`
   - Modify landing page in `src/pages/LandingPage.tsx`
   - Add your business logic to dashboard

2. **Add features**:
   - Organization management
   - Member invitations
   - Admin dashboard
   - User settings page
   - Account page

3. **Set up CI/CD**:
   - GitHub Actions for testing
   - Automated deployments
   - Database migration workflow

4. **Add tests**:
   - Unit tests for business logic
   - Integration tests for auth flow
   - E2E tests for critical paths

5. **Review documentation**:
   - `/docs/specs/database-schema.md` - Database structure
   - `/docs/documentation/remaining-features.md` - Features to implement
   - `CLAUDE.md` - AI assistant context

## Getting Help

- **GitHub Issues**: Report bugs or request features
- **Supabase Discord**: Get help with database/auth issues
- **Documentation**: Check `/docs/` for detailed guides

## Security Checklist

Before going to production:

- [ ] Enable email verification in Supabase
- [ ] Set up custom email templates
- [ ] Configure allowed redirect URLs
- [ ] Enable RLS on all tables
- [ ] Test RLS policies thoroughly
- [ ] Set up proper CORS policies
- [ ] Enable rate limiting
- [ ] Configure error reporting (Sentry, etc.)
- [ ] Set up monitoring and alerts
- [ ] Review security headers
- [ ] Enable HTTPS only
- [ ] Set up backup strategy

## Performance Checklist

- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Optimize images (WebP, lazy loading)
- [ ] Enable code splitting
- [ ] Set up database indexes
- [ ] Configure caching strategy
- [ ] Monitor Core Web Vitals
- [ ] Set up performance monitoring

## Development Best Practices

1. **Always use TypeScript strict mode**
2. **Write tests for critical paths** (auth, payments, admin)
3. **Use Pino logger** instead of console.log
4. **Follow feature-based structure** in `/src/features/`
5. **Keep tests co-located** with source code
6. **Update documentation** when adding features
7. **Test in demo mode** before testing with real backend
8. **Use meaningful commit messages**
9. **Review changes** before committing
10. **Keep dependencies updated**
