import { getUserData } from "components/authFunctions";
import { AppLayout } from "components/Layout/AppLayout";
import { getOrders } from "components/cartFunctions";
import { OrderList } from "components/Orders/OrderList";

export default async function Home() {
    const userData = await getUserData();
    const orders = await getOrders();
    console.log("Orders up top:", orders);
    return (
        <AppLayout>
            <OrderList orders={orders}/>
        </AppLayout>
    );
}
