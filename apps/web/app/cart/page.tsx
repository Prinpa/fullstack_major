import { AppLayout } from "components/Layout/AppLayout";
import { getCartByUserId } from "components/cartFunctions";
import { getUserData } from "components/authFunctions";
import { CartList } from "components/Cart/CartList";
import { getToken } from "components/tokenFunctions";
export default async function page() {

  const token = await getToken();
  
  const userId = await getUserData();
  if (!userId) {
    return <div>Please log in to view your cart</div>;
  }
  const cart = await getCartByUserId(token);
  return (
   <AppLayout>
      <CartList cart={cart} />
   </AppLayout>
  );
}
