import { products } from "@prisma/client";
import { Product } from "types";

export async function getProducts({ filter }: { filter?: boolean } = {}) {
  const response = await fetch('http://localhost:3001/api/products', {
    method: 'GET',
  });
  const data = await response.json();
  return data.data;
}

// get product by id
export async function getProductById(id: string) {
  const response = await fetch(`http://localhost:3001/api/products/${id}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

// add product
export async function addProduct(product: Product) {
  const response = await fetch('http://localhost:3001/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productHolder: product }),
  });
  const data = await response.json();
  return data;
}