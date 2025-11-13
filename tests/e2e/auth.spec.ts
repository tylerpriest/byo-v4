import { test, expect } from '@playwright/test'

test('demo user login works', async ({ page }) => {
  await page.goto('/login')

  // Check for demo mode banner
  await expect(page.getByText(/Demo Mode Active/i)).toBeVisible()

  // Click demo user button
  await page.getByRole('button', { name: /Demo User/i }).click()

  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText(/Welcome back!/i)).toBeVisible()
  await expect(page.getByText(/demo@example.com/i)).toBeVisible()
})

test('demo admin login works and shows admin button', async ({ page }) => {
  await page.goto('/login')

  // Click demo admin button
  await page.getByRole('button', { name: /Demo Admin/i }).click()

  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText(/admin@example.com/i)).toBeVisible()

  // Admin button should be visible
  await expect(page.getByRole('button', { name: /Admin/i })).toBeVisible()
})

test('protected routes redirect to login', async ({ page }) => {
  // Try to access dashboard without auth
  await page.goto('/dashboard')

  // Should redirect to login
  await expect(page).toHaveURL('/login')
})

test('sign out works', async ({ page }) => {
  // Login first
  await page.goto('/login')
  await page.getByRole('button', { name: /Demo User/i }).click()
  await expect(page).toHaveURL('/dashboard')

  // Sign out
  await page.getByRole('button', { name: /Sign Out/i }).click()

  // Should redirect to login
  await expect(page).toHaveURL('/login')
})
