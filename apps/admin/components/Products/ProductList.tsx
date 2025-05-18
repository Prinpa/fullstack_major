import { getProducts } from "../productFunctions"
import Link from "next/link";
import { Product } from "types";

export async function ProductList({
  products,
}: {
  products: Product[],
}) {
  // TODO UPDATE TYPES
  return (
    <div>
      Listing every product V
      {products.map((product: any) => (
        <div key={product.id}>
          <h1><Link href={`/update-product/${product.id}`}>{product.title}</Link></h1>
          
          <p>{product.content}</p>
        </div>
      ))}
    </div>
  )
}