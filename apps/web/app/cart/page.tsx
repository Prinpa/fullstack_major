import { AppLayout } from "components/Layout/AppLayout";
import { getCartByUserId } from "components/cartFunctions";
import { getUserData } from "components/authFunctions";
import { CartList } from "components/Cart/CartList";
import { getToken } from "components/tokenFunctions";
import { PaymentFrom } from "components/Cart/paymentForm";
export default async function page() {

  const userData = await getUserData();
  const token = await getToken();
  let cart = [];
  if (token) {
    cart = await getCartByUserId(token);
  }
  return (
   <AppLayout>
      {userData.role === "guest" ? <div>Please log in to view your cart</div> : <CartList cart={cart} />}
      <PaymentFrom/>
   </AppLayout>
  );
}
