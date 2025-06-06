import { test, expect } from './fixture';
import { cookies } from 'next/headers';
import {seed} from "@repo/db/seed"
test.beforeAll(async () => {
  await seed();
});

test.describe('Home Screen', () => {
  
  test("Is working", async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText("nexus")).toBeVisible();
  })

  test("Test auth flow", async ({ userPage }) => {
    // Sign up
    await userPage.goto('http://localhost:3000/signUp');
    await userPage.getByLabel("firstName").fill("Test");
    await userPage.getByLabel("lastName").fill("Admin");
    await userPage.getByLabel("email").fill("test@example.com");
    await userPage.getByLabel("password", { exact: true }).fill("hashedPassword");
    await userPage.getByLabel("ConfirmPassword").fill("hashedPassword");
    await userPage.getByRole("button", { name: "Sign Up" }).click();
    
    // Wait for signup and navigation
    await userPage.goto('http://localhost:3000/login');

    await userPage.waitForURL('http://localhost:3000/login');
    
    // Login
    await userPage.getByLabel("Email").fill("test@example.com");
    await userPage.getByLabel("Password").fill("hashedPassword");
    await userPage.getByRole("button", { name: "Login" }).click();
    
    // Wait for login to complete and verify we're logged in
    await userPage.waitForURL('http://localhost:3000');
    
    // Get and log the cookies to verify authentication
    const cookies = await userPage.context().cookies();

    // Save the authentication state for future tests
    await userPage.context().storageState({ path: '.auth/admin.json' });
    
    // Verify we're logged in by checking for admin-only content
    await expect(userPage.getByText("Nexus")).toBeVisible();
  });

  test("Is asd", async ({ userPage }) => {
    await userPage.goto('http://localhost:3000');
    await expect(userPage.getByText("hello")).toBeVisible();
  })
})    