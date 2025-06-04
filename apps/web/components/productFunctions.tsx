import { products } from "@prisma/client";
import { Product } from "types";
import { getToken } from "./tokenFunctions";


export async function getProducts({ filter }: { filter?: boolean } = {}) {
  const response = await fetch('http://localhost:3000/api/products', {
    method: 'GET',
  });
  const data = await response.json();
  return data.data;
}

// get product by id
export async function getProductById(id: string) {
  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data.data;
}

// add product
export async function addProduct(product: Product) {
  const token = await getToken();
  const response = await fetch('http://localhost:3000/api/products', {
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

  const response = await fetch(`http://localhost:3000/api/products/${product.id}`, {
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

  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data;
}