import { test, expect } from '@playwright/test'

test('landing page loads successfully', async ({ page }) => {
  await page.goto('/')

  // Check for main heading
  await expect(page.getByRole('heading', { name: /BYO v4 SaaS Boilerplate/i })).toBeVisible()

  // Check for CTA buttons
  await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Sign In/i })).toBeVisible()

  // Check for features section
  await expect(page.getByText(/Multi-Tenancy/i)).toBeVisible()
  await expect(page.getByText(/Dual RBAC/i)).toBeVisible()
  await expect(page.getByText(/Demo Mode/i)).toBeVisible()
})

test('navigation to login page works', async ({ page }) => {
  await page.goto('/')

  // Click sign in button
  await page.getByRole('link', { name: /Sign In/i }).click()

  // Should navigate to login page
  await expect(page).toHaveURL('/login')
  await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible()
})

test('navigation to signup page works', async ({ page }) => {
  await page.goto('/')

  // Click get started button
  await page.getByRole('link', { name: /Get Started/i }).click()

  // Should navigate to signup page
  await expect(page).toHaveURL('/signup')
  await expect(page.getByRole('heading', { name: /Create an account/i })).toBeVisible()
})
