import { test, expect } from './fixture';
import {seed} from "@repo/db/seed"

const waitTime = 600;
let products;
test.describe('yes its all test files in one im sorry', () => {
  
  test.beforeEach(async () => {
    products = await seed();
  });
  
  test("Loading when un authenticated", async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText("nexus")).toBeVisible();
  })

  test("Test user flow",{tag: "@auth"}, async ({ userPage }) => {
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
    await userPage.getByRole("button", { name: "Log in" }).click();
    
    // Wait for login to complete and verify we're logged in
    await userPage.waitForURL('http://localhost:3000');


    // Save the authentication state for future tests
    await userPage.context().storageState({ path: '.auth/user.json' });
    // Verify we're logged in by checking for admin-only content
    await expect(userPage.getByText("Hello, test")).toBeVisible();
  });

  test("Test admin flow",{tag: "@auth"}, async ({ adminPage }) => {
    await adminPage.goto('http://localhost:3000/login');

    
    // Login
    await adminPage.getByLabel("Email").fill("admin@gmail.com");
    await adminPage.getByLabel("Password").fill("password");
    await adminPage.getByRole("button", { name: "Log in" }).click();
    
    // Wait for login to complete and verify we're logged in
    await adminPage.waitForURL('http://localhost:3000');
    
    // Get and log the cookies to verify authentication


    // Save the authentication state for future tests
    await adminPage.context().storageState({ path: '.auth/admin.json' });
    // Verify we're logged in by checking for admin-only content
    const cookies = await adminPage.context().cookies();
    console.log("Admin cookies:", cookies);
    await expect(adminPage.getByText("Hello, admin")).toBeVisible();
  });


  test("Is authenticated", async ({ userPage }) => {
    await userPage.goto('http://localhost:3000');
    await expect(userPage.getByText("Hello")).toBeVisible();
    // print cookies

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

  
  test("Loading cart when un authenticated", async ({ page }) => {
    await page.goto('http://localhost:3000/cart');
    await expect(page.getByText("You need to be logged in to have a cart")).toBeVisible();
  });

  test("Logged in user sees empty cart", async ({ userPage }) => {
    await userPage.goto('http://localhost:3000/cart');
    await expect(userPage.getByText("Your cart is empty")).toBeVisible();
  });
  
  test("User can add item to cart", async ({ userPage }) => {
    // Navigate to a product page first (assuming product ID 1 exists from seed data)
    await userPage.goto(`http://localhost:3000/product/${products[0].id}`);
    
    // Set quantity to 2
    const quantityInput = userPage.getByLabel('Quantity:');
    await quantityInput.click();
    await quantityInput.fill('2');
    
    // Click add to cart button
    await userPage.getByRole('button', { name: 'Add To Cart' }).click();
    
    // Wait for any loading state to finish
    await userPage.waitForTimeout(1000);
    
    // Go to cart page
    await userPage.goto('http://localhost:3000/cart');
    
    // Check that cart is not empty
    await expect(userPage.getByText("Your cart is empty")).not.toBeVisible();
      // Check that we have the correct quantity
    const quantityElement = userPage.getByTestId('cart-item-quantity');
    await expect(quantityElement).toBeVisible();
    await expect(quantityElement).toHaveText('Quantity: 2');
  });

  test("Cart calculates total price correctly", async ({ userPage }) => {
    // Navigate to product page and add 2 items
    await userPage.goto(`http://localhost:3000/product/${products[0].id}`);
    const quantityInput = userPage.getByLabel('Quantity:');
    await quantityInput.click();
    await quantityInput.fill('2');
    await userPage.getByRole('button', { name: 'Add To Cart' }).click();
    
    // Wait for cart update
    await userPage.waitForTimeout(1000);
    
    // Go to cart page
    await userPage.goto('http://localhost:3000/cart');
    
    // Get the product price and calculate expected total
    const priceText = await userPage.getByTestId('cart-item-price').textContent();
    const price = parseFloat(priceText?.replace('$', '') || '0');
    
    // Check total matches expected calculation
    const totalText = await userPage.getByTestId('cart-total').textContent();
    const total = parseFloat(totalText?.replace('Total: $', '') || '0');
    expect(total).toBeCloseTo(price, 2);
  });

  test("User can complete checkout",  async ({ userPage }) => {
    // First add an item to cart
    await userPage.goto(`http://localhost:3000/product/${products[0].id}`);
    await userPage.getByRole('button', { name: 'Add To Cart' }).click();
    await userPage.waitForTimeout(1000);
    
    // Go to cart page
    await userPage.goto('http://localhost:3000/cart');
      // Fill in payment details
    await userPage.locator('#cardHolderName').fill('John Doe');
    await userPage.locator('#cardNumber').fill('4242424242424242');
    await userPage.locator('#expiryDate').fill('12/25');
    await userPage.locator('#cvv').fill('123');
    
    // Submit payment
    await userPage.getByRole('button', { name: 'Complete Payment' }).click();
    
    // Wait for the order to be processed
    await userPage.waitForTimeout(1000);
    
    // Navigate to orders page to verify
    await userPage.goto('http://localhost:3000/orders');
    
    // Verify order is visible in orders page
    await expect(userPage.locator('.order-card')).toBeVisible();
  });

  test("Admin can add a new product", {tag: "@auth"}, async ({ adminPage }) => {
    // Navigate to add product page
    await adminPage.goto(`http://localhost:3000/product/add-product`);
    // print cookies
    const cookies = await adminPage.context().cookies();
    console.log("Admin cookies:", cookies);

    // Fill in the product details
    await adminPage.getByLabel('Title').fill('Test Product');
    await adminPage.getByLabel('Content').fill('This is a test product content');
    await adminPage.getByLabel('category').fill('This is a test product category');
    await adminPage.getByLabel('Description').fill('This is a test product description');
    await adminPage.getByLabel('Price').fill('199.99');
    await adminPage.getByLabel('Quantity').fill('50');
    
    // Submit the form
    await adminPage.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for navigation and check if product appears in the list
    await adminPage.waitForURL('http://localhost:3000');

    await expect(adminPage.getByText('Test Product', {exact: true})).toBeVisible();
    await expect(adminPage.getByText('$199.99')).toBeVisible();

  });

  test("Admin can update a product", async ({ adminPage }) => {
    // Navigate to the first product's detail page
    await adminPage.goto(`http://localhost:3000/product/${products[0].id}`);
    
    
    // Update product details
    const titleInput = adminPage.getByLabel('Title');
    await titleInput.clear();
    await titleInput.fill('Updated Product Title');
    
    const contentInput = adminPage.getByLabel('Content');
    await contentInput.clear();
    await contentInput.fill('Updated product description');
    
    const priceInput = adminPage.getByLabel('Price');
    await priceInput.clear();
    await priceInput.fill('299.99');
    
    const quantityInput = adminPage.getByLabel('Quantity');
    await quantityInput.clear();
    await quantityInput.fill('75');
    
    // Save changes
    await adminPage.getByRole('button', { name: 'Submit' }).click();

    await adminPage.waitForURL('http://localhost:3000');

    
    // Verify updates are visible
    await expect(adminPage.getByText('Updated Product Title')).toBeVisible();
    await expect(adminPage.getByText('$299.99')).toBeVisible();
    await expect(adminPage.getByText('Updated product description')).toBeVisible();
    await expect(adminPage.getByText('In stock: 75')).toBeVisible();
  });

});