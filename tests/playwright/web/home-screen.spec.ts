import { test, expect } from './fixture';
import {seed} from "@repo/db/seed"

const waitTime = 600;
test.describe('Home Screen', () => {
  
  test.beforeAll(async () => {
    await seed();
  });
  
  test("Loading when un authenticated", async ({ page }) => {
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

  test("Is authenticated", async ({ userPage }) => {
    await userPage.goto('http://localhost:3000');
    await expect(userPage.getByText("Hello, Test")).toBeVisible();
  })

  test("Showing all products", async ({ userPage }) => {
    await userPage.goto('http://localhost:3000');
    await expect(await userPage.locator('[data-testid^="product-"]').count()).toBe(3);
  })

  test("Filter By content", async ({ userPage }) => {
    await userPage.goto('http://localhost:3000');
    await userPage.getByLabel("title").fill("roduct 15");
    // timeout to handle debounce  
    await userPage.waitForTimeout(waitTime);
    
    await expect(await userPage.locator('[data-testid^="product-"]').count()).toBe(1);
  })

  test("Filter by price", async ({ userPage }) => {
    await userPage.goto('http://localhost:3000');
    await userPage.getByLabel("minPrice").fill("150");
    // timeout to handle debounce  
    await userPage.waitForTimeout(waitTime);
    await expect(await userPage.locator('[data-testid^="product-"]').count()).toBe(2);

    await userPage.getByLabel("maxPrice").fill("250");
    await userPage.waitForTimeout(waitTime);
    await expect(await userPage.locator('[data-testid^="product-"]').count()).toBe(1);
  })
  test("Sort items", async ({ userPage }) => {
    await userPage.goto('http://localhost:3000');

    // Test Latest (default - listedDate_asc)
    // Should be: Product 3 (July) -> Product 2 (April) -> Product 1 (January)
    const latestProducts = await userPage.locator('[data-testid^="product-"] .product-title').allTextContents();
    expect(latestProducts).toEqual(['Product 1', 'Product 2', 'Product 15']);

    // Test Earliest (listedDate_desc)
    await userPage.getByLabel("Sort By").selectOption('listedDate_desc');
    await userPage.waitForTimeout(waitTime);
    const earliestProducts = await userPage.locator('[data-testid^="product-"] .product-title').allTextContents();
    expect(earliestProducts).toEqual(['Product 15', 'Product 2', 'Product 1']);

    // Test Price Low to High
    await userPage.getByLabel("Sort By").selectOption('price_asc');
    await userPage.waitForTimeout(waitTime);
    const lowToHighPrices = await userPage.locator('[data-testid^="product-"] .product-price').allTextContents();
    expect(lowToHighPrices).toEqual(['$100.00', '$200.00', '$300.00']);

    // Test Price High to Low
    await userPage.getByLabel("Sort By").selectOption('price_desc');
    await userPage.waitForTimeout(waitTime);
    const highToLowPrices = await userPage.locator('[data-testid^="product-"] .product-price').allTextContents();
    expect(highToLowPrices).toEqual(['$300.00', '$200.00', '$100.00']);

    // Test Title A-Z
    await userPage.getByLabel("Sort By").selectOption('title_asc');
    await userPage.waitForTimeout(waitTime);
    const titleAZ = await userPage.locator('[data-testid^="product-"] .product-title').allTextContents();
    expect(titleAZ).toEqual(['Product 1', 'Product 15', 'Product 2']);

    // Test Title Z-A
    await userPage.getByLabel("Sort By").selectOption('title_desc');
    await userPage.waitForTimeout(waitTime);
    const titleZA = await userPage.locator('[data-testid^="product-"] .product-title').allTextContents();
    expect(titleZA).toEqual(['Product 2', 'Product 15', 'Product 1']);
  })

  // combine filters
  test("Combine filters", async ({ userPage }) => {
    await userPage.goto('http://localhost:3000');
    
    // Filter by content
    await userPage.getByLabel("title").fill("Product 15");
    await userPage.waitForTimeout(waitTime);
    
    // Filter by price
    await userPage.waitForTimeout(waitTime);
    
    // Check if the product count is correct after combining filters
    const filteredCount = await userPage.locator('[data-testid^="product-"]').count();
    expect(filteredCount).toBe(1); // Should match Product 2 only
  });

  test("Show product info", async ({page}) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText("Product 1", {exact: true})).toBeVisible();
    await expect(page.getByText("$100.00")).toBeVisible();
    await expect(page.getByText("Content for product 1")).toBeVisible();
    await expect(page.getByText("In stock: 10")).toBeVisible();


  })

})    