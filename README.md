# BYO v4 - SaaS Boilerplate

**Version:** 4.0.2
**Status:** In Development (Phases 0-10 Complete)

Production-ready multi-tenant SaaS starter template built from scratch with modern technologies.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## ✨ Features

### Currently Implemented (Phases 0-10)

- ✅ **Modern Tech Stack** - React 18, Vite 5, TypeScript with strict mode
- ✅ **Styling** - TailwindCSS v3 with CSS variables and dark mode support
- ✅ **Development Tools** - ESLint v9, Prettier, Husky pre-commit hooks
- ✅ **Authentication System** - Complete auth flows with Supabase
- ✅ **Demo Mode (3-Tier)** - Admin toggle, environment variable, auto-fallback
- ✅ **ShadCN UI Components** - Button, Card, Input, Label with variants
- ✅ **React Router** - Navigation with protected routes
- ✅ **Pages** - Landing, Login, Signup, Dashboard
- ✅ **Mock Supabase Client** - Realistic demo data without real backend

### Planned (Phases 11-15)

- ⏳ **Dual RBAC** - Platform roles + Organization roles
- ⏳ **Multi-Tenancy** - Organizations, members, invitations
- ⏳ **Layout Components** - Sidebar, Header, Footer
- ⏳ **Admin Dashboard** - User management, system controls
- ⏳ **Testing** - Vitest unit tests + Playwright E2E
- ⏳ **CI/CD** - GitHub Actions + Vercel deployment
- ⏳ **Logging** - Pino integration

## 🎭 Demo Mode

The application includes a sophisticated 3-tier demo mode system:

1. **Admin Dashboard Toggle** (highest priority) - Runtime control
2. **Environment Variable** - `VITE_DEMO_MODE=true`
3. **Auto-Fallback** (lowest priority) - Missing credentials

### Demo Login Credentials

- **Regular User:** `demo@example.com` / any password
- **Platform Admin:** `admin@example.com` / any password

## 🏗️ Project Structure

```
byo-v4/
├── docs/
│   ├── prompt-v4.md              # Project specifications
│   ├── implementation-plan.md    # Detailed phase tracking
│   └── notes.md                  # Build session notes
├── src/
│   ├── components/
│   │   ├── ui/                   # ShadCN components
│   │   └── DemoModeBanner.tsx
│   ├── features/
│   │   └── auth/                 # Authentication
│   ├── lib/
│   │   ├── supabase/             # Supabase client + mock
│   │   └── utils.ts              # Utility functions
│   ├── pages/                    # Route pages
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── .husky/                       # Git hooks
├── eslint.config.js              # ESLint v9 flat config
├── tailwind.config.js            # TailwindCSS config
├── tsconfig.json                 # TypeScript config
└── vite.config.ts                # Vite config
```

## 🛠️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript 5.6** - Type safety with strict mode
- **Vite 5.4** - Build tool and dev server

### Styling
- **TailwindCSS 3.4** - Utility-first CSS
- **ShadCN UI** - Component library (Radix UI + Tailwind)

### Backend
- **Supabase** - Auth, Database, Storage
- **PostgreSQL** - Database with RLS

### Development
- **ESLint 9** - Linting (flat config)
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vitest** - Testing framework (planned)
- **Playwright** - E2E testing (planned)

### Routing
- **React Router 6** - Client-side routing

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Optional: Supabase Configuration
# Leave empty to use demo mode
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Optional: Force demo mode
VITE_DEMO_MODE=
```

### Supabase Setup (Optional)

If you want to use a real Supabase backend:

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Add to `.env` file
4. Run database migrations (when implemented)

## 📝 Development

### Code Quality

- **TypeScript strict mode** - Maximum type safety
- **ESLint** - Catches errors and enforces patterns
- **Prettier** - Consistent formatting
- **Pre-commit hooks** - Automatic linting and formatting

### Testing (Planned)

- **Unit Tests** - Vitest with React Testing Library
- **E2E Tests** - Playwright for user workflows
- **Coverage** - >80% for auth/RBAC/admin, 30% overall

## 🚢 Deployment

### Vercel (Planned)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 📚 Documentation

- [Implementation Plan](docs/implementation-plan.md) - Detailed phase tracking
- [Build Session Notes](docs/notes.md) - Development log
- [Project Specifications](docs/prompt-v4.md) - Complete requirements

## 🤝 Contributing

This is a template project. Fork it and customize for your needs!

### Customization

1. Update branding and colors in `tailwind.config.js`
2. Add your business logic to the Dashboard
3. Customize the Landing page
4. Add your own features and pages

## 📄 License

MIT License - Use freely for personal or commercial projects

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Supabase](https://supabase.com)
- [TailwindCSS](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com)

---

**Status:** Phases 0-10 Complete (66% of initial implementation)
**Next:** RBAC, Multi-tenancy, Testing, CI/CD
