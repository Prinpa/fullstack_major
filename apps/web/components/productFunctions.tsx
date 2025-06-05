import { Product } from "types";
import { getToken } from "./tokenFunctions";
import { FilterState } from "./Products/filterForm";

export async function getProducts(filters?: FilterState) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let url = new URL("/api/products", baseUrl);

  if (filters) {
    if (filters.title) url.searchParams.append("title", filters.title);
    if (filters.category) url.searchParams.append("category", filters.category);
    if (filters.minPrice > 0) url.searchParams.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice > 0) url.searchParams.append("maxPrice", filters.maxPrice.toString());
    if (filters.sortBy) url.searchParams.append("sortBy", filters.sortBy);
    if (filters.showDeleted) {
      url.searchParams.append("showDeleted", "true");
    } else {
      url.searchParams.append("showDeleted", "false");
    }
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

export async function getProductById(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = new URL(`/api/products/${id}`, baseUrl);

  const response = await fetch(url.toString(), {
    method: "GET",
  });
  const data = await response.json();
  return data.data;
}

export async function addProduct(formData: FormData) {
  const token = await getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = new URL("/api/products", baseUrl);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to add product");
  }
  return data;
}

export async function updateProduct(formData: FormData) {
  const token = await getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = new URL("/api/products", baseUrl);

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update product");
  }
  return data;
}

export async function deleteProduct(id: number) {
  const token = await getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = new URL(`/api/products/${id}`, baseUrl);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }
  return data;
}