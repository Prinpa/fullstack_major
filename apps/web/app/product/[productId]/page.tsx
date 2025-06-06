import { AppLayout } from "components/Layout/AppLayout";
import { getProductById } from "components/productFunctions";
import { ProductDetail } from "components/Products/ProductDetail";
import { getUserData } from "components/authFunctions";
import { AddProductForm } from "components/Products/addProductForm";
export default async function page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProductById(productId);
  const userData = await getUserData();
  console.log("User Data:", productId);
  return (
    <AppLayout>
      {userData.role === "admin" ? <AddProductForm product={product}/>:  <ProductDetail product={product}></ProductDetail>}
    </AppLayout>
  );
}
