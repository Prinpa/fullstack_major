import { AppLayout } from "components/Layout/AppLayout";
import { getProducts } from "components/productFunctions";
import { ProductList } from "components/Products/ProductList";
import { AddProductForm } from "components/forms/addProductForm";


export default async function Home() {
  const products = await getProducts();

  return (  
    <AppLayout>
      <AddProductForm/>
      <div>ADMIN PAGE</div>
    </AppLayout>
  );
}
