import { getProducts } from "../productFunctions"
import Link from "next/link";

export async function ProductList({
  products,
}: {
  products: any,
}) {
  // TODO UPDATE TYPES
  return (
    <div>
      Listing every product
      {products.map((product: any) => (
        <div key={product.id}>
          <h1><Link href={`/product/${product.id}`}>{product.title}</Link></h1>
          
          <p>{product.content}</p>
        </div>
      ))}
    </div>
  )
}