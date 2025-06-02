import { AppLayout } from "components/Layout/AppLayout";
import { getCartByUserId } from "components/cartFunctions";
import { ProductList } from "components/Products/ProductList";
import { getUserId } from "utils/auth";
import { CartList } from "components/Cart/CartList";



export default async function page() {
  const userId = await getUserId();
  if (!userId) {
    return <div>Please log in to view your cart</div>;
  }
  const cart = await getCartByUserId(userId);
  console.log("cart", cart);
  return (
   <AppLayout>
      <CartList cart={cart} />
   </AppLayout>
  );
}
