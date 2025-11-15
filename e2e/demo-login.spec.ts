import { test, expect } from '@playwright/test'

test.describe('Demo Mode Authentication', () => {
  test('should display demo login button on login page', async ({ page }) => {
    await page.goto('/login')

    // Check for demo login button
    const demoButton = page.getByText(/demo login/i)
    await expect(demoButton).toBeVisible()
  })

  test('should successfully login with demo account', async ({ page }) => {
    await page.goto('/login')

    // Click demo login button
    const demoButton = page.getByText(/demo login/i)
    await demoButton.click()

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Should see dashboard content
    await expect(page.getByText(/dashboard/i)).toBeVisible()
  })

  test('should navigate to organizations page', async ({ page }) => {
    // Login first
    await page.goto('/login')
    const demoButton = page.getByText(/demo login/i)
    await demoButton.click()
    await expect(page).toHaveURL('/dashboard')

    // Navigate to organizations (if there's a link)
    await page.goto('/organizations')
    await expect(page).toHaveURL('/organizations')
    await expect(page.getByText(/organizations/i)).toBeVisible()
  })
})
