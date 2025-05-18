import { AppLayout } from "components/Layout/AppLayout";
import { getProducts, getProductById } from "components/productFunctions";
import { ProductList } from "components/Products/ProductList";
import { AddProductForm } from "components/forms/addProductForm";

export default async function Page({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const product = await getProductById(id);

  return (  
    <AppLayout>
      <AddProductForm product={product.data}/>
      <div>ADMIN PAGE</div>
    </AppLayout>
  );
}
