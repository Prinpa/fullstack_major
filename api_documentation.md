# API Documentation

## Base URL
`https://fullstack-major-web.vercel.app/api`

## Authentication
- Most endpoints require a JWT token in the `Authorization` header as a Bearer token: `Bearer <token>`.
- The token is obtained via `POST /api/auth` (login) and stored in an HTTP-only cookie named `token`.
- A refresh token is stored in a cookie named `refresh` for session persistence.
- Admin-only endpoints require the user’s `role` to be `"admin"` in the JWT payload.


## 1. Authentication (`/api/auth`)

### GET `/api/auth`
Validates a JWT token and returns user data.

- **Description**: Verifies the provided Bearer token and returns the decoded user information if valid.
- **Authentication**: Requires `Authorization: Bearer <token>` header.
- **Request**:
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Token is valid",
      "user": {
        "userId": number,
        "email": string,
        "role": string,
        "firstName": string
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "No authorization header" }
    { "message": "Invalid token format" }
    { "message": "No token provided" }
    { "message": "Invalid token" }
    ```

### POST `/api/auth`
Handles user login or signup.

- **Description**: If `firstName` is provided, creates a new user (signup). Otherwise, authenticates an existing user (login) and returns a JWT token and refresh token.
- **Request**:
  - **Body** (JSON):
    ```json
    {
      "firstName": "string", // Optional; include for signup
      "lastName": "string", // Optional; include for signup
      "email": "string", // Required
      "password": "string" // Required
    }
    ```
- **Responses**:
  - **201 Created** (Signup):
    ```json
    { "message": "User created" }
    ```
  - **200 OK** (Login):
    ```json
    {
      "message": "Login successful",
      "user": {
        "id": number,
        "email": string,
        "firstName": string,
        "lastName": string,
        "role": string
      }
    }
    ```
    - Sets cookies:
      - `token`: JWT token (HTTP-only, 59-minute expiry)
      - `refresh`: Refresh token (HTTP-only, 7-day expiry)
  - **401 Unauthorized**:
    ```json
    { "error": "User already exists" }
    { "error": "Email or Password incorrect" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "error": "Internal server error" }
    { "error": "Error creating refresh token" }
    ```
- **Issues/Recommendations**:
  - **Password Handling**: Passwords are stored in plaintext and compared directly. Use `bcrypt` to hash passwords:
    ```typescript
    // Signup
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { ..., password: hashedPassword } });

    // Login
    const isValid = await bcrypt.compare(password, user.password);
    if (!user || !isValid) { ... }
    ```
  - **Input Validation**: Validate `email` and `password` presence before processing.
  - **Refresh Token**: Use a cryptographically secure method for refresh tokens (e.g., `crypto.randomBytes`).

### DELETE `/api/auth`
Logs out the user by clearing authentication cookies.

- **Description**: Clears the `token` and `refresh` cookies to log out the user.
- **Request**: None
- **Responses**:
  - **200 OK**:
    ```json
    { "message": "Logged out successfully" }
    ```
    - Clears cookies: `token` and `refresh`
- **Issues/Recommendations**:
  - **Refresh Token Cleanup**: Invalidate the refresh token in the database:
    ```typescript
    const refreshToken = headers().get('Cookie')?.match(/refresh=([^;]+)/)?.[1];
    if (refreshToken) {
      await prisma.refreshTokens.deleteMany({ where: { refreshToken } });
    }
    ```
  - **Authentication**: Require a valid token to ensure only authenticated users can log out.


## 2. Orders (`/api/orders`)

### GET `/api/orders`
Retrieves a user's orders or all orders (for admins).

- **Description**: Returns orders grouped by `orderId`. Non-admins see only their orders; admins see all orders with `userId`.
- **Authentication**: Requires `Authorization: Bearer <token>` header.
- **Request**:
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
- **Responses**:
  - **200 OK**:
    ```json
    [
      {
        "orderId": "string",
        "userId": number, // Included for admins only
        "createdAt": "string", // ISO date
        "items": [
          {
            "productId": number,
            "quantity": number,
            "price": number,
            "product": {
              "id": number,
              "title": "string",
              "content": "string",
              "description": "string",
              "imageUrl": "string",
              "price": number,
              "category": "string",
              "quantity": number,
              "active": boolean,
              "sold": boolean
            }
          }
        ]
      }
    ]
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "No authorization header" }
    { "message": "Invalid token format" }
    { "message": "No token provided" }
    { "message": "Invalid token" }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to fetch orders",
      "error": "string"
    }
    ```

### POST `/api/orders`
Creates a new order from the user's cart.

- **Description**: Converts cart items into an order with a unique `orderId`, clears the cart, and returns the `orderId`.
- **Authentication**: Requires `Authorization: Bearer <token>` header.
- **Request**:
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
- **Responses**:
  - **201 Created**:
    ```json
    {
      "message": "Order placed successfully",
      "orderId": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Cart is empty" }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "message": "Unauthorized: Ensure authorisation token is correct bearer token"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to place order",
      "error": "string"
    }
    ```
- **Issues/Recommendations**:
  - **Order ID**: The `orderId` (`${Date.now()}-${userId}`) may collide. Use a UUID:
    ```typescript
    import { v4 as uuidv4 } from 'uuid';
    const orderId = uuidv4();
    ```
  - **Transaction**: Use a Prisma transaction for atomicity:
    ```typescript
    await prisma.$transaction([
      prisma.orders.createMany({ data: ... }),
      prisma.cart.deleteMany({ where: { userId: userData.userId } }),
    ]);
    ```

---

## 3. Cart (`/api/cart`)

**File**: `app/api/cart/route.ts`

### GET `/api/cart`
Retrieves the user's cart items.

- **Description**: Returns all cart items for the authenticated user.
- **Authentication**: Requires `Authorization: Bearer <token>` header.
- **Request**:
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": number,
          "userId": number,
          "productId": number,
          "quantity": number,
          "price": number
        }
      ],
      "message": "Users cart retrieved successfully"
    }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "Unauthorized: No token provided" }
    { "message": "Invalid token" }
    ```
  - **500 Internal Server Error**:
    ```json
    { "message": "Failed to locate cart",
      "error": "string"
    }
    ```

### POST `/api/cart`
Adds an item to the user's cart.

- **Description**: Creates a new cart item for the authenticated user.
- **Authentication**: Requires `Authorization: Bearer <token>` header.
- **Request**:
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
  - **Body** (JSON):
    ```json
    {
      "productId": number,
      "userId": number,
      "quantity": number,
      "price": number
    }
    ```
- **Responses**:
  - **201 Created**:
    ```json
    {
      "data": {
        "id": number,
        "userId": number,
        "productId": number,
        "quantity": number,
        "price": number
      },
      "message": "Cart updated successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Missing product data" }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "Unauthorized: No token provided" }
    { "message": "Invalid token" }
    ```
  - **403 Forbidden**:
    ```json
    { "message": "Unauthorized: Can only modify your own cart" }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to create cart item",
      "error": "string"
    }
    ```
- **Issues/Recommendations**:
  - **Validation**: Verify `productId` exists and has sufficient stock before adding to cart:
    ```typescript
    const product = await prisma.products.findUnique({ where: { id: productId } });
    if (!product || product.quantity < quantity) {
      return NextResponse.json({ message: "Invalid product or insufficient stock" }, { status: 400 });
    }
    ```
  - **Duplicates**: Prevent duplicate cart items by updating existing items:
    ```typescript
    const existingItem = await prisma.cart.findFirst({
      where: { userId, productId },
    });
    if (existingItem) {
      await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cart.create({ data: ... });
    }
    ```
  - **Price Validation**: Ensure `price` matches the product’s current price to prevent manipulation.

---

## 4. Products (`/api/products`)

**File**: `app/api/products/route.ts`

### GET `/api/products`
Retrieves a list of products with optional filters.

- **Description**: Returns products filtered by title, category, price range, and sorted by specified criteria. Excludes soft-deleted products unless `showDeleted=true`.
- **Authentication**: None required.
- **Request**:
  - **Query Parameters**:
    - `title` (string, optional): Filter by product title (contains).
    - `category` (string, optional): Filter by category.
    - `minPrice` (number, optional): Minimum price.
    - `maxPrice` (number, optional): Maximum price.
    - `sortBy` (string, optional): Sort by:
      - `price_asc`, `price_desc`
      - `title_asc`, `title_desc`
      - `listedDate_asc`, `listedDate_desc`
    - `showDeleted` (boolean, optional): Include soft-deleted products if `true`.
  - **Example**:
    ```
    GET /api/products?title=shirt&category=clothing&minPrice=10&maxPrice=50&sortBy=price_asc
    ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": [
        {
          "id": number,
          "title": "string",
          "content": "string",
          "description": "string",
          "imageUrl": "string",
          "listedDate": "string",
          "soldDate": "string|null",
          "price": number,
          "quantity": number,
          "category": "string",
          "sold": boolean,
          "active": boolean,
          "deletedAt": "string|null"
        }
      ],
      "message": "Products retrieved successfully"
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to fetch products",
      "error": "string"
    }
    ```
- **Issues/Recommendations**:
  - **Input Sanitization**: Sanitize `title` to prevent SQL injection (though Prisma mitigates this).
  - **Pagination**: Add `skip` and `take` query parameters for large datasets:
    ```typescript
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "10");
    await prisma.products.findMany({ where, orderBy, skip, take });
    ```

### POST `/api/products`
Creates a new product (admin only).

- **Description**: Adds a product to the database with an optional image upload to Vercel Blob.
- **Authentication**: Requires `Authorization: Bearer <token>` header; user must be admin.
- **Request**:
  - **Headers**:
    ```
    Authorization: Bearer <token>
    Content-Type: multipart/form-data
    ```
  - **Body** (FormData):
    ```
    title: string
    content: string
    description: string
    price: number
    quantity: number
    category: string
    sold: boolean
    active: boolean
    image: File|null
    ```
- **Responses**:
  - **201 Created**:
    ```json
    {
      "data": {
        "id": number,
        "title": "string",
        "content": "string",
        "description": "string",
        "imageUrl": "string",
        "listedDate": "string",
        "soldDate": "string|null",
        "price": number,
        "quantity": number,
        "category": "string",
        "sold": boolean,
        "active": boolean,
        "deletedAt": "string|null"
      },
      "message": "Product created successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Missing required fields" }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "No authorization header" }
    { "message": "Invalid token format" }
    { "message": "No token provided" }
    { "message": "Invalid token" }
    { "message": "Unauthorized" }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to create product",
      "error": "string"
    }
    ```
- **Issues/Recommendations**:
  - **Image Default**: If no image is provided, `imageUrl` is set to `""`. Use a default placeholder:
    ```typescript
    imageUrl = image ? blob.url : "https://example.com/default-image.jpg";
    ```
  - **Validation**: Validate `price` and `quantity` are positive numbers.

### PUT `/api/products`
Updates an existing product (admin only).

- **Description**: Updates a product’s details with an optional image upload.
- **Authentication**: Requires `Authorization: Bearer <token>` header; user must be admin.
- **Request**:
  - **Headers**:
    ```
    Authorization: Bearer <token>
    Content-Type: multipart/form-data
    ```
  - **Body** (FormData):
    ```
    id: number
    title: string
    content: string
    description: string
    price: number
    quantity: number
    category: string
    sold: boolean
    active: boolean
    image: File|null
    ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": number,
        "title": "string",
        "content": "string",
        "description": "string",
        "imageUrl": "string",
        "listedDate": "string",
        "soldDate": "string|null",
        "price": number,
        "quantity": number,
        "category": "string",
        "sold": boolean,
        "active": boolean,
        "deletedAt": "string|null"
      },
      "message": "Product updated successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Missing required fields" }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "No authorization header" }
    { "message": "Invalid token format" }
    { "message": "No token provided" }
    { "message": "Invalid token" }
    { "message": "Unauthorized" }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Product not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to update product",
      "error": "string"
    }
    ```
- **Issues/Recommendations**:
  - **Validation**: Ensure `id` is a valid number and matches an existing product.
  - **Image Handling**: Delete the old image from Vercel Blob if a new one is uploaded.

### DELETE `/api/products`
Deletes a product (admin only).

- **Description**: Permanently deletes a product by ID.
- **Authentication**: Requires `Authorization: Bearer <token>` header; user must be admin.
- **Request**:
  - **Body** (JSON):
    ```json
    { "id": number }
    ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": number,
        "title": "string",
        "content": "string",
        "description": "string",
        "imageUrl": "string",
        "listedDate": "string",
        "soldDate": "string|null",
        "price": number,
        "quantity": number,
        "category": "string",
        "sold": boolean,
        "active": boolean,
        "deletedAt": "string|null"
      },
      "message": "Product deleted successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Missing product ID" }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "No authorization header" }
    { "message": "Invalid token format" }
    { "message": "No token provided" }
    { "message": "Invalid token" }
    { "message": "Unauthorized" }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to delete product",
      "error": "string"
    }
    ```
- **Issues/Recommendations**:
  - **Soft Delete**: This endpoint permanently deletes products, unlike `DELETE /api/products/[id]`. Standardize to soft deletion:
    ```typescript
    await prisma.products.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    ```
  - **Authentication**: Use `getUserDataFromAuthHeader` for consistency with other admin endpoints.

---

## 5. Product by ID (`/api/products/[id]`)

**File**: `app/api/products/[id]/route.ts`

### GET `/api/products/:id`
Retrieves a single product by ID.

- **Description**: Returns a product’s details by its ID.
- **Authentication**: None required.
- **Request**:
  - **Path Parameters**:
    - `id` (number): Product ID
  - **Example**:
    ```
    GET /api/products/123
    ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": number,
        "title": "string",
        "content": "string",
        "description": "string",
        "imageUrl": "string",
        "listedDate": "string",
        "soldDate": "string|null",
        "price": number,
        "quantity": number,
        "category": "string",
        "sold": boolean,
        "active": boolean,
        "deletedAt": "string|null"
      },
      "message": "Product retrieved successfully"
    }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Product not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to fetch product",
      "error": "string"
    }
    ```
- **Issues/Recommendations**:
  - **Soft Delete Check**: Optionally filter out soft-deleted products unless requested:
    ```typescript
    const product = await prisma.products.findUnique({
      where: { id: Number(id), deletedAt: null },
    });
    ```

## 5. Product by ID (`/api/products/[id]`)

**File**: `app/api/products/[id]/route.ts`

### PUT `/api/products/:id`
Updates a single product (admin only).

- **Description**: Updates a product’s details by ID, allowing modification of fields such as title, content, price, and more.
- **Authentication**: Requires `Authorization: Bearer <token>` header; user must be admin.
- **Request**:
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
  - **Path Parameters**:
    - `id` (number): Product ID
  - **Body** (JSON):
    ```json
    {
      "id": number,
      "title": "string",
      "content": "string",
      "description": "string",
      "imageUrl": "string",
      "listedDate": "string",
      "soldDate": "string|null",
      "price": number,
      "quantity": number,
      "category": "string",
      "sold": boolean,
      "active": boolean,
      "deletedAt": "string|null"
    }
    ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": number,
        "title": "string",
        "content": "string",
        "description": "string",
        "imageUrl": "string",
        "listedDate": "string",
        "soldDate": "string|null",
        "price": number,
        "quantity": number,
        "category": "string",
        "sold": boolean,
        "active": boolean,
        "deletedAt": "string|null"
      },
      "message": "Product updated successfully"
    }
    ```
  - **400 Bad Request**:
    ```json
    { "message": "Product ID mismatch" }
    { "message": "Product data is required" }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "No authorization header" }
    { "message": "Invalid token format" }
    { "message": "No token provided" }
    { "message": "Invalid token" }
    { "message": "Unauthorized" }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Product not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to update product",
      "error": "string"
    }

### DELETE `/api/products/:id`
Soft-deletes a product (admin only).

- **Description**: Marks a product as deleted by setting `deletedAt`.
- **Authentication**: Requires `Authorization: Bearer <token>` header; user must be admin.
- **Request**:
  - **Headers**:
    ```
    Authorization: Bearer <token>
    ```
  - **Path Parameters**:
    - `id` (number): Product ID
- **Responses**:
  - **200 OK**:
    ```json
    {
      "data": {
        "id": number,
        "title": "string",
        "content": "string",
        "description": "string",
        "imageUrl": "string",
        "listedDate": "string",
        "soldDate": "string|null",
        "price": number,
        "quantity": number,
        "category": "string",
        "sold": boolean,
        "active": boolean,
        "deletedAt": "string"
      },
      "message": "Product soft deleted successfully"
    }
    ```
  - **401 Unauthorized**:
    ```json
    { "message": "No authorization header" }
    { "message": "Invalid token format" }
    { "message": "No token provided" }
    { "message": "Invalid token" }
    { "message": "Unauthorized" }
    ```
  - **404 Not Found**:
    ```json
    { "message": "Product not found" }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Failed to soft delete product",
      "error": "string"
    }
    ```
- **Issues/Recommendations**:
  - **Consistency**: Ensure `DELETE /api/products` uses soft deletion to align with this endpoint.
  - **Validation**: Check if the product exists before updating `deletedAt`.

---

## Notes
- **Dependencies**: Routes use Prisma (`@repo/db`), JWT (`jsonwebtoken`), bcrypt (`bcrypt`), and Vercel Blob (`@vercel/blob`).
- **Environment Variables**:
  - `JWT_SECRET`: Required for JWT signing/verification.
  - `NODE_ENV`: Determines cookie security settings.
- **Database Schema**: Assumes Prisma models for `users`, `orders`, `cart`, `products`, and `refreshTokens`.
- **Security Considerations**:
  - Implement rate limiting to prevent brute-force attacks.
  - Sanitize inputs to prevent injection attacks (Prisma helps mitigate SQL injection).
  - Use HTTPS in production for secure cookie transmission.
- **Testing**: Test endpoints with tools like Postman or `curl`. Example:
  ```bash
  curl -X POST http://localhost:3000/api/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}'