import { AppLayout } from "components/Layout/AppLayout";
import { getProducts } from "components/productFunctions";
import { ProductList } from "components/Products/ProductList";
import Login from "components/Auth/Login";


export default async function Home() {

  
  return (
   <AppLayout>
     <div>THIS is the signin page</div>
     <Login/>
   </AppLayout>
  );
}
