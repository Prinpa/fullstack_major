import { test as setup, expect } from '@playwright/test';
import { createClient } from '../../../packages/db/client';
import { env } from './test-env';

const prisma = createClient(); // Note: Unused, remove if not needed

setup('authenticate as user', async ({ page }) => {
  console.log('Running auth.setup.ts');

  try {
    // Go to login page
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    console.log('Navigated to login page');

    // Verify form exists
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitButton = page.locator('button[type="submit"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    console.log('Login form elements found');

    // Fill login form
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password');
    console.log('Filled login form');

    // Click submit
    await submitButton.click();
    console.log('Clicked submit');

    // Wait for navigation
    await page.waitForURL('http://localhost:3000', { timeout: 10000 });
    console.log('Navigated to homepage');

    // Verify logged in (optional, adjust selector as needed)
    await expect(page.locator('text=Welcome')).toBeVisible();
    console.log('Login successful');

    // Save signed-in state
    await page.context().storageState({ path: '.auth/user.json' });
    console.log('Saved session state to .auth/user.json');
  } catch (error) {
    console.error('Auth setup failed:', error);
    await page.screenshot({ path: 'auth-setup-error.png' });
    throw error; // Re-throw to fail the setup
  }
});