import Link from "next/link";
import { CartItem } from "types";

export async function CartList({
  cart,
}: {
  cart: CartItem[],
}) {
  return (
    <div>
      {cart.map((item: CartItem) => (
        <div key={item.id}>
          <h1>Id: {item.id}</h1>
          <h1>user id: {item.userId}</h1>
          <h1>produdct id: {item.productId}</h1>
          <h1>quantity: {item.quantity}</h1>
        </div>
      ))}
    </div>
  )
}