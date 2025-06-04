import { getUserData } from "components/authFunctions";
import { AppLayout } from "components/Layout/AppLayout";
import { getProducts } from "components/productFunctions";
import { ProductList } from "components/Products/ProductList";
import { getOrders } from "components/cartFunctions";

export default async function Home() {
    const userData = await getUserData();
    const orders = await getOrders();
    return (
        <AppLayout>
            {orders.map((order: any) => (
                <div key={order.id}>
                  <h1>Id: {order.id}</h1>
                  <h1>Order id: {order.orderId}</h1>
                  <h1>User id: {order.userId}</h1>
                  <h1>Qnty: {order.quantity}</h1>
                  <hr />
                </div>
            ))}
        </AppLayout>
    );
}
