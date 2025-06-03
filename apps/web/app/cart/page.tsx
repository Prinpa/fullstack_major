import { AppLayout } from "components/Layout/AppLayout";
import { getCartByUserId } from "components/cartFunctions";
import { ProductList } from "components/Products/ProductList";
import { getUserData } from "components/authFunctions";
import { CartList } from "components/Cart/CartList";
import { cookies } from 'next/headers';



export default async function page() {

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  const userId = await getUserData(token);
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
