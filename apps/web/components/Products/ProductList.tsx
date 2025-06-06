"use client";
import Link from "next/link";
import { Product } from "types";
import { useState } from "react";
import { getProducts } from "components/productFunctions";
import { FilterForm } from "./filterForm";
import Image from "next/image";

interface ProductListProps {
  initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  return (
    <div className="flex w-full">
      <FilterForm
        onFilterChange={async (filters) => {
          const filteredProducts = await getProducts(filters);
          setProducts(filteredProducts);
        }}
      />
      <div className="product-grid">
        {products.map((product: Product) => (
          <Link aria-label="productCard" href={`/product/${product.id}`} key={product.id} className="product-card" data-testid={`product-${product.id}`}>
            <div className="product-image" >
              <Image
                src={product.imageUrl || "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg"}
                width={300}
                height={200}
                alt={product.title}
                className="object-cover w-full"
                style={{ maxHeight: "200px" }}
              />
            </div>
            <div className="product-info">
              <div className="product-title-price">
                <h2 className="product-title">{product.title}</h2>
                <p className="product-price">${(product.price / 100).toFixed(2)}</p>
                

              </div>
              <div className="product-extra">
                <p className="product-content">{product.content}</p>
                <p className="product-quantity">In Stock: {product.quantity}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}