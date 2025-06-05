"use client"
import Link from "next/link";
import { Product } from "types";
import { useEffect } from "react";
import { useState } from "react";
import { getProducts } from "components/productFunctions";
import { FilterForm } from "./filterForm";
import  Image from "next/image";

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
          <Link href={`/product/${product.id}`} key={product.id}>
          <div  className="product-card">
            <div className="product-image">
              <Image
                src={product.imageUrl || "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg"} width={500} height={300} alt="product image">
              </Image>
            </div>
            <div className="product-info">
              <h2 className="product-title">
                {product.title}
              </h2>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className="product-description">{product.content}</p>
            </div>
          </div>
          </Link>

        ))}
      </div>
    </div>
  );
}