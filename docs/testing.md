# Testing Strategy

## Overview

This project uses a comprehensive testing strategy with enforced coverage thresholds to ensure code quality and reliability.

## Testing Stack

- **Unit & Integration Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Vitest with v8 provider

## Coverage Thresholds

### Global Thresholds

The following minimum coverage thresholds are enforced across the codebase:

- **Statements**: 60%
- **Branches**: 55%
- **Functions**: 55%
- **Lines**: 60%

### Critical Path Requirements

For critical application paths, higher coverage is expected:

- **Authentication** (`src/features/auth/*`): Target 80%+
- **RBAC** (`src/features/rbac/*`): Target 80%+
- **Payment Processing** (when implemented): Target 90%+
- **Data Validation** (`src/lib/validations.ts`): Target 85%+

## Running Tests

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Test Organization

```
src/
  features/
    auth/
      __tests__/
        AuthContext.test.tsx
        ProtectedRoute.test.tsx
    rbac/
      __tests__/
        useRoles.test.tsx
        AdminRoute.test.tsx
  components/
    __tests__/
      Header.test.tsx
      Footer.test.tsx
  lib/
    __tests__/
      validations.test.ts
      supabase.test.ts
  test/
    setup.ts           # Test setup and global mocks
    utils.tsx          # Test utilities and helpers
    mockData.ts        # Mock data for tests
```

## What to Test

### Components

1. **Rendering**: Does the component render without errors?
2. **Props**: Does it handle props correctly?
3. **User Interactions**: Do clicks, inputs, and other events work?
4. **Conditional Rendering**: Do different states render correctly?
5. **Accessibility**: Is the component accessible?

### Hooks

1. **Return Values**: Does the hook return expected values?
2. **State Changes**: Do state updates work correctly?
3. **Side Effects**: Do effects run when expected?
4. **Edge Cases**: How does it handle errors and edge cases?

### Utilities

1. **Input/Output**: Does it produce correct outputs for given inputs?
2. **Edge Cases**: How does it handle boundary conditions?
3. **Error Handling**: Does it throw/handle errors appropriately?
4. **Type Safety**: Does TypeScript catch type errors?

## Coverage Exclusions

The following files/patterns are excluded from coverage requirements:

- Configuration files (`*.config.ts`)
- Type definition files (`*.d.ts`)
- Test files and utilities (`src/test/**`)
- Storybook stories (`*.stories.tsx`)
- Main entry point (`src/main.tsx`)
- App routing (`src/App.tsx`)
- Mock data files

## CI/CD Integration

Tests run automatically on:
- Every pull request
- Every commit to main branch
- Pre-commit hook (via Husky)

The build will fail if:
- Any test fails
- Coverage thresholds are not met
- TypeScript errors exist
- Linting errors exist

## Best Practices

### 1. Write Tests First (TDD)

For new features, consider writing tests first:

```typescript
// ✅ Good: Write test first
describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    expect(calculateTotal(100, 0.1)).toBe(110)
  })
})

// Then implement the function
```

### 2. Test User Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation details
expect(component.state.isOpen).toBe(true)

// ✅ Good: Testing user-visible behavior
expect(screen.getByText('Modal Content')).toBeVisible()
```

### 3. Keep Tests Simple and Focused

```typescript
// ❌ Bad: Testing too many things at once
it('should handle form submission', () => {
  // Tests form validation, submission, API call, and success message
})

// ✅ Good: Separate concerns
it('should validate email format', () => { })
it('should submit form with valid data', () => { })
it('should show success message after submission', () => { })
```

### 4. Use Meaningful Test Names

```typescript
// ❌ Bad: Vague test name
it('works', () => { })

// ✅ Good: Descriptive test name
it('should display error message when email is invalid', () => { })
```

### 5. Clean Up After Tests

```typescript
import { render, cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
```

## Mock Data

Use the centralized mock data from `src/test/mockData.ts`:

```typescript
import { mockUser, mockOrganization } from '@/test/mockData'

it('should render user profile', () => {
  render(<UserProfile user={mockUser} />)
  expect(screen.getByText(mockUser.email)).toBeInTheDocument()
})
```

## Testing Supabase

Use the mock Supabase client for tests:

```typescript
import { getSupabaseClient } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: vi.fn(() => mockSupabaseClient),
}))
```

## Continuous Improvement

Coverage goals:

- **Short term** (Q1): Maintain 60% coverage minimum
- **Medium term** (Q2): Reach 70% average coverage
- **Long term** (Q3+): Reach 80% coverage for critical paths

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Questions?

If you have questions about testing strategy or need help writing tests:

1. Check existing test files for examples
2. Review this documentation
3. Ask in team chat or stand-up
4. Pair with a team member on test writing
