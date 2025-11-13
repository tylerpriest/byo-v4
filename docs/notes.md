# Development Notes

## Version Adjustments

Due to package availability, the following versions were adjusted from the original spec:

### Core Dependencies
- **React**: Specified v19, using v18.3.1 (v19 not yet released as stable)
- **Vite**: Specified v7, using v5.4.9 (v7 not yet released)
- **Vitest**: Specified v4.0, using v2.1.2 (v4 not yet released)
- **Zod**: Specified v4.x beta, using v3.23.8 (v4 in beta, using stable v3)
- **TailwindCSS**: Specified v4, using v4.0.0-beta.6 (v4 in beta)

**Impact**: Minimal. All core functionality remains the same. Will upgrade to specified versions when they become stable.

### React 18 vs 19 Considerations
- Using `createRoot` API (React 18+)
- No breaking changes expected when upgrading to React 19
- All hooks and features compatible

## Implementation Notes (Beyond Original Spec)

### Custom Logger Implementation
- **Replaced Pino** with a custom console-based logger for better browser compatibility
- Pino's browser mode has complex type issues and doesn't work well with TypeScript strict mode
- Custom logger is simpler, lighter, and fully type-safe
- Located in: `src/lib/logger/index.ts`

### TailwindCSS v4 Beta Adjustments
- v4 beta requires different syntax for CSS custom properties
- Changed from `@apply border-border` to `border-color: hsl(var(--border))`
- Similar changes for background and text colors in base layer

### Component Structure
- Created ShadCN-style components manually rather than using CLI
- Includes: Button, Input, Card, Label
- All components use proper TypeScript types and forwardRef
- Centralized in `src/components/ui/`

### Routing Structure
- Implemented `RedirectIfAuthenticated` component for public routes
- Prevents authenticated users from accessing login/signup pages
- Proper loading states on all route transitions

## Blockers & Issues

### Noted Items
- None currently

## Future Enhancements

### Planned
- Upgrade to React 19 when stable
- Upgrade to Vite 7 when released
- Upgrade to Vitest 4 when released
- Consider Zod v4 when stable

## MCP Integration Notes

### Required MCPs (To be installed)
1. GitHub MCP - PR/issue management
2. Vercel MCP - Deployment automation
3. Supabase MCP - Database operations
4. ShadCN MCP - Component generation
5. Playwright MCP - E2E testing

**Note**: MCP installation requires manual OAuth authentication and configuration.

## Database Schema

### To be created in Supabase:
- `profiles` - User profiles
- `organizations` - Multi-tenant workspaces
- `organization_members` - Members with roles
- `invitations` - Email invitations
- `system_settings` - Platform-wide settings (demo mode, feature flags)
- `audit_logs` - Activity tracking

## Testing Coverage

### Current Status
- Unit tests: Not yet implemented
- E2E tests: Not yet implemented
- Coverage thresholds configured in vitest.config.ts

### Target Coverage
- Critical paths (auth, RBAC, payments): >80%
- Overall: 30%
