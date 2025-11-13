# BYO v4 - SaaS Boilerplate

Production-ready multi-tenant SaaS starter template with React 19, Vite 7, TypeScript, TailwindCSS v4, and Supabase.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:5173 and click **"Demo User Login"** to try instantly!

## Features

- ✅ **Demo Mode**: Zero-config demo with mock data
- ✅ **Authentication**: Supabase Auth with demo support
- ✅ **Modern Stack**: React 19, Vite 7, TypeScript, TailwindCSS v4
- ✅ **Testing**: Vitest 4.0, Playwright ready
- ✅ **Code Quality**: ESLint v9, Prettier, Husky hooks
- 🚧 **Multi-Tenancy**: Organizations, members (to be implemented)
- 🚧 **RBAC**: Dual role system (to be implemented)
- 🚧 **Admin Dashboard**: System management (to be implemented)

## Documentation

- **Setup Guide**: [/docs/documentation/setup.md](/docs/documentation/setup.md)
- **Database Schema**: [/docs/specs/database-schema.md](/docs/specs/database-schema.md)
- **Remaining Features**: [/docs/documentation/remaining-features.md](/docs/documentation/remaining-features.md)
- **Deployment**: [/docs/documentation/vercel-deployment.md](/docs/documentation/vercel-deployment.md)
- **AI Context**: [CLAUDE.md](CLAUDE.md)

## Demo Mode

The app automatically enables demo mode when Supabase credentials are missing. Try it now:

**Demo Users** (any password works):
- Regular user: `demo@example.com`
- Admin user: `admin@example.com`

## Production Setup

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`
3. Add your Supabase credentials
4. Apply database schema from `/docs/specs/database-schema.md`
5. Deploy to Vercel

See [Setup Guide](/docs/documentation/setup.md) for detailed instructions.

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm test             # Run tests
npm run type-check   # TypeScript validation
npm run lint         # Lint code
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7, TailwindCSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Testing**: Vitest 4.0, Playwright
- **Code Quality**: ESLint v9, Prettier, Husky

## What's Next?

See [Remaining Features](/docs/documentation/remaining-features.md) for the complete roadmap.

Priority items:
1. Database schema implementation
2. RBAC system (platform + organization roles)
3. Organization management
4. Member invitations
5. Admin dashboard

## License

MIT
