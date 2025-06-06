# Test info

- Name: yes its all test files in one im sorry >> Admin can add a new product
- Location: C:\Users\pa77y\Documents\Coding-git\fullstack_major\tests\playwright\web\everything.spec.ts:254:7

# Error details

```
Error: locator.hover: Error: strict mode violation: locator('[data-testid^="product-"]') resolved to 4 elements:
    1) <a class="product-card" href="/product/1273" aria-label="productCard" data-testid="product-1273">…</a> aka getByTestId('product-1273')
    2) <a class="product-card" href="/product/1274" aria-label="productCard" data-testid="product-1274">…</a> aka getByTestId('product-1274')
    3) <a class="product-card" href="/product/1275" aria-label="productCard" data-testid="product-1275">…</a> aka getByTestId('product-1275')
    4) <a class="product-card" href="/product/1276" aria-label="productCard" data-testid="product-1276">…</a> aka getByTestId('product-1276')

Call log:
  - waiting for locator('[data-testid^="product-"]')

    at C:\Users\pa77y\Documents\Coding-git\fullstack_major\tests\playwright\web\everything.spec.ts:274:58
```

# Page snapshot

```yaml
- navigation:
  - link "Nexus":
    - /url: /
  - text: Hello, admin
  - link "Orders":
    - /url: /orders
    - img
    - text: Orders
  - link "Cart":
    - /url: /cart
    - img
    - text: Cart
  - link "Add Product":
    - /url: /add-product
    - img
    - text: Add Product
  - button "Logout"
- main:
  - heading "Filters" [level=3]
  - text: Title
  - textbox "Title"
  - heading "Category" [level=4]
  - combobox:
    - option "All Categories" [selected]
    - option "Electronics"
    - option "Games"
    - option "Phones"
    - option "Computing"
    - option "Accessories"
  - heading "Price Range" [level=4]
  - spinbutton "minPrice"
  - text: to
  - spinbutton "maxPrice"
  - text: Sort By
  - combobox "Sort By":
    - option "Earliest" [selected]
    - option "Latest"
    - 'option "Price: Low to High"'
    - 'option "Price: High to Low"'
    - option "Title (A-Z)"
    - option "Title (Z-A)"
  - link "productCard":
    - /url: /product/1273
    - img "Product 1"
    - heading "Product 1" [level=2]
    - paragraph: $1.00
    - paragraph: Content for product 1
    - paragraph: "In Stock: 10"
  - link "productCard":
    - /url: /product/1274
    - img "Product 2"
    - heading "Product 2" [level=2]
    - paragraph: $2.00
    - paragraph: Content for product 2
    - paragraph: "In Stock: 20"
  - link "productCard":
    - /url: /product/1275
    - img "Product 15"
    - heading "Product 15" [level=2]
    - paragraph: $3.00
    - paragraph: Content for product 3
    - paragraph: "In Stock: 30"
  - link "productCard":
    - /url: /product/1276
    - img "Test Product"
    - heading "Test Product" [level=2]
    - paragraph: $199.99
    - paragraph: This is a test product content
    - paragraph: "In Stock: 50"
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
  174 |     await expect(userPage.getByText("Your cart is empty")).toBeVisible();
  175 |   });
  176 |   
  177 |   test("User can add item to cart", async ({ userPage }) => {
  178 |     // Navigate to a product page first (assuming product ID 1 exists from seed data)
  179 |     await userPage.goto(`http://localhost:3000/product/${products[0].id}`);
  180 |     
  181 |     // Set quantity to 2
  182 |     const quantityInput = userPage.getByLabel('Quantity:');
  183 |     await quantityInput.click();
  184 |     await quantityInput.fill('2');
  185 |     
  186 |     // Click add to cart button
  187 |     await userPage.getByRole('button', { name: 'Add To Cart' }).click();
  188 |     
  189 |     // Wait for any loading state to finish
  190 |     await userPage.waitForTimeout(1000);
  191 |     
  192 |     // Go to cart page
  193 |     await userPage.goto('http://localhost:3000/cart');
  194 |     
  195 |     // Check that cart is not empty
  196 |     await expect(userPage.getByText("Your cart is empty")).not.toBeVisible();
  197 |       // Check that we have the correct quantity
  198 |     const quantityElement = userPage.getByTestId('cart-item-quantity');
  199 |     await expect(quantityElement).toBeVisible();
  200 |     await expect(quantityElement).toHaveText('Quantity: 2');
  201 |   });
  202 |
  203 |   test("Cart calculates total price correctly", async ({ userPage }) => {
  204 |     // Navigate to product page and add 2 items
  205 |     await userPage.goto(`http://localhost:3000/product/${products[0].id}`);
  206 |     const quantityInput = userPage.getByLabel('Quantity:');
  207 |     await quantityInput.click();
  208 |     await quantityInput.fill('2');
  209 |     await userPage.getByRole('button', { name: 'Add To Cart' }).click();
  210 |     
  211 |     // Wait for cart update
  212 |     await userPage.waitForTimeout(1000);
  213 |     
  214 |     // Go to cart page
  215 |     await userPage.goto('http://localhost:3000/cart');
  216 |     
  217 |     // Get the product price and calculate expected total
  218 |     const priceText = await userPage.getByTestId('cart-item-price').textContent();
  219 |     const price = parseFloat(priceText?.replace('$', '') || '0');
  220 |     
  221 |     // Check total matches expected calculation
  222 |     const totalText = await userPage.getByTestId('cart-total').textContent();
  223 |     const total = parseFloat(totalText?.replace('Total: $', '') || '0');
  224 |     expect(total).toBeCloseTo(price, 2);
  225 |   });
  226 |
  227 |   test("User can complete checkout",  async ({ userPage }) => {
  228 |     // First add an item to cart
  229 |     await userPage.goto(`http://localhost:3000/product/${products[0].id}`);
  230 |     await userPage.getByRole('button', { name: 'Add To Cart' }).click();
  231 |     await userPage.waitForTimeout(1000);
  232 |     
  233 |     // Go to cart page
  234 |     await userPage.goto('http://localhost:3000/cart');
  235 |       // Fill in payment details
  236 |     await userPage.locator('#cardHolderName').fill('John Doe');
  237 |     await userPage.locator('#cardNumber').fill('4242424242424242');
  238 |     await userPage.locator('#expiryDate').fill('12/25');
  239 |     await userPage.locator('#cvv').fill('123');
  240 |     
  241 |     // Submit payment
  242 |     await userPage.getByRole('button', { name: 'Complete Payment' }).click();
  243 |     
  244 |     // Wait for the order to be processed
  245 |     await userPage.waitForTimeout(1000);
  246 |     
  247 |     // Navigate to orders page to verify
  248 |     await userPage.goto('http://localhost:3000/orders');
  249 |     
  250 |     // Verify order is visible in orders page
  251 |     await expect(userPage.locator('.order-card')).toBeVisible();
  252 |   });
  253 |
  254 |   test("Admin can add a new product", {tag: "@auth"}, async ({ adminPage }) => {
  255 |     // Navigate to add product page
  256 |     await adminPage.goto(`http://localhost:3000/product/add-product`);
  257 |     // print cookies
  258 |     const cookies = await adminPage.context().cookies();
  259 |     console.log("Admin cookies:", cookies);
  260 |
  261 |     // Fill in the product details
  262 |     await adminPage.getByLabel('Title').fill('Test Product');
  263 |     await adminPage.getByLabel('Content').fill('This is a test product content');
  264 |     await adminPage.getByLabel('category').fill('This is a test product category');
  265 |     await adminPage.getByLabel('Description').fill('This is a test product description');
  266 |     await adminPage.getByLabel('Price').fill('199.99');
  267 |     await adminPage.getByLabel('Quantity').fill('50');
  268 |     
  269 |     // Submit the form
  270 |     await adminPage.getByRole('button', { name: 'Submit' }).click();
  271 |     
  272 |     // Wait for navigation and check if product appears in the list
  273 |     await adminPage.waitForURL('http://localhost:3000');
> 274 |     await adminPage.locator('[data-testid^="product-"]').hover();
      |                                                          ^ Error: locator.hover: Error: strict mode violation: locator('[data-testid^="product-"]') resolved to 4 elements:
  275 |
  276 |     await expect(adminPage.getByText('Test Product', {exact: true})).toBeVisible();
  277 |     await expect(adminPage.getByText('$199.99')).toBeVisible();
  278 |     await expect(adminPage.getByText('This is a test product description')).toBeVisible();
  279 |     await expect(adminPage.getByText('In stock: 50')).toBeVisible();
  280 |   });
  281 |
  282 |   test("Admin can update a product", async ({ adminPage }) => {
  283 |     // Navigate to the first product's detail page
  284 |     await adminPage.goto(`http://localhost:3000/product/${products[0].id}`);
  285 |     
  286 |     // Click edit button
  287 |     
  288 |     // Update product details
  289 |     const titleInput = adminPage.getByLabel('Title');
  290 |     await titleInput.clear();
  291 |     await titleInput.fill('Updated Product Title');
  292 |     
  293 |     const contentInput = adminPage.getByLabel('Content');
  294 |     await contentInput.clear();
  295 |     await contentInput.fill('Updated product description');
  296 |     
  297 |     const priceInput = adminPage.getByLabel('Price');
  298 |     await priceInput.clear();
  299 |     await priceInput.fill('299.99');
  300 |     
  301 |     const quantityInput = adminPage.getByLabel('Quantity');
  302 |     await quantityInput.clear();
  303 |     await quantityInput.fill('75');
  304 |     
  305 |     // Save changes
  306 |     await adminPage.getByRole('button', { name: 'Submit' }).click();
  307 |
  308 |     await adminPage.waitForURL('http://localhost:3000');
  309 |
  310 |     
  311 |     // Verify updates are visible
  312 |     await expect(adminPage.getByText('Updated Product Title')).toBeVisible();
  313 |     await expect(adminPage.getByText('$299.99')).toBeVisible();
  314 |     await expect(adminPage.getByText('Updated product description')).toBeVisible();
  315 |     await expect(adminPage.getByText('In stock: 75')).toBeVisible();
  316 |   });
  317 |
  318 | });
```