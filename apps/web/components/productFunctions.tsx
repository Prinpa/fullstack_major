import { Product } from "types";
import { getToken } from "./tokenFunctions";
import { FilterState } from "./Products/filterForm";

export async function getProducts(filters?: FilterState) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  let url = new URL('/api/products', baseUrl);
  
  if (filters) {
    if (filters.title) url.searchParams.append('title', filters.title);
    if (filters.category) url.searchParams.append('category', filters.category);
    if (filters.minPrice > 0) url.searchParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice > 0) url.searchParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) url.searchParams.append('sortBy', filters.sortBy);
  }
  console.log("Fetching products from:", url.toString());
  console.log(process.env.NEXT_PUBLIC_API_URL)
  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store', // Don't cache this request
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log("Response status:", response);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

// get product by id
export async function getProductById(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = new URL(`/api/products/${id}`, baseUrl);
  
  const response = await fetch(url.toString(), {
    method: 'GET',
  });
  const data = await response.json();
  return data.data;
}

// add product
export async function addProduct(product: Product) {
  const token = await getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = new URL('/api/products', baseUrl);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  return data;
}

// update product
export async function updateProduct(product: Product) {
  const token = await getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = new URL(`/api/products/${product.id}`, baseUrl);

  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`

    },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  return data;
}

// soft delete product
export async function deleteProduct(id: number) {
  const token = await getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = new URL(`/api/products/${id}`, baseUrl);

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
}