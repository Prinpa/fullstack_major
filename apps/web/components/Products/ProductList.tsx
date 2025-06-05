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
    <div className="main-layout">
      <aside className="filter-sidebar">
        <FilterForm onFilterChange={async (filters) => {
          const filteredProducts = await getProducts(filters);
          setProducts(filteredProducts);
        }} />
      </aside>
      <div className="product-grid">
        {products.map((product: Product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {/* Add product image here when available */}
              <div className="placeholder-image" />
            </div>
            <div className="product-info">
              <h2 className="product-title">
                <Link href={`/product/${product.id}`}>{product.title}</Link>
              </h2>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-description">{product.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}