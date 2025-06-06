"use client";
import Image from "next/image";
import { GroupedOrder, ReturnedOrderItem } from "types"; // Adjust path if needed

interface OrderListProps {
  orders: GroupedOrder[];
}

export function OrderList({ orders }: OrderListProps) {
  console.log("Orders in OrderList:", orders);

  if (!orders || orders.length === 0) {
    return <div className="order-empty">No orders found.</div>;
  }

  return (
    <div className="order-list">
      {orders.map((order) => (
        <div key={order.orderId} className="order-card">
          <div className="order-header">
            <h2 className="order-id">Order #{order.orderId}</h2>
            <p className="order-date">
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            {order.userId && (
              <p className="order-user">User ID: {order.userId}</p>
            )}
          </div>
          <div className="order-items">
            {order.items.map((item: ReturnedOrderItem) => (
              <div key={item.productId} className="order-item">
                <div className="order-item-image">
                  <Image
                    src={
                      item.product.imageUrl ||
                      "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg"
                    }
                    alt={item.product.title}
                    width={60}
                    height={60}
                    className="object-cover rounded"
                  />
                </div>
                <div className="order-item-details">
                  <h3 className="order-item-title">{item.product.title}</h3>
                  <p className="order-item-quantity">Qty: {item.quantity}</p>
                  <p className="order-item-price">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}