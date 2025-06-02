import { Product } from "types";
import AddToCartButton from "components/Cart/AddToCartButton";

export async function ProductDetail({
  product,
}: {
  product: Product,
}) {
  return (
    <div>
        <div>
          <h1>{product.title}</h1>
          <p>{product.content}</p>
          <AddToCartButton productId={product.id} />
        </div>
    </div>
  )
}