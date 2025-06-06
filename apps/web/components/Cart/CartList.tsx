import Link from "next/link";
import { ReturnedOrderItem } from "types";

export async function CartList({
  cart,
}: {
  cart: ReturnedOrderItem[],
}) {
  if (!cart || cart.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg text-gray-600">
        Your cart is empty
      </div>
    );
  }
  return (
    <div className="cart-items">
      {cart.map((item: ReturnedOrderItem) => (
        <div key={item.productId} className="cart-item">
          <img 
            src={item.product?.imageUrl || "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg"} 
            alt={item.product?.title || "Product"} 
            className="cart-item-image"
          />          <div className="cart-item-details">
            <h3 className="cart-item-title" data-testid="cart-item-title">{item.product?.title}</h3>
            <div className="cart-item-price" data-testid="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
            <div className="cart-item-quantity" data-testid="cart-item-quantity">Quantity: {item.quantity}</div>
          </div>
        </div>
      ))}      <div className="cart-total" data-testid="cart-total">
        Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
      </div>
    </div>
  )
}