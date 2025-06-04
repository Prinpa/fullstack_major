"use client"
import Link from "next/link";
import { Product } from "types";
import { useEffect } from "react";
import { useState } from "react";
import { getProducts } from "components/productFunctions";
import { FilterForm } from "./filterForm";

interface ProductListProps {
  initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  return (
    <div>
      <FilterForm onFilterChange={async (filters) => {
        const filteredProducts = await getProducts(filters);
        setProducts(filteredProducts);
      }} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((product: Product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/product/${product.id}`}>{product.title}</Link>
            </h2>
            <p className="text-lg font-bold text-blue-600">${product.price}</p>
            <p className="text-gray-600 mt-2">{product.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}