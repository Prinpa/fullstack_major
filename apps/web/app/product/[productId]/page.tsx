import { AppLayout } from "components/Layout/AppLayout";
import { getProductById } from "components/productFunctions";
import { ProductDetail } from "components/Products/ProductDetail";

export default async function page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProductById(productId);
  return (
    <AppLayout>
      <ProductDetail product={product}></ProductDetail>
    </AppLayout>
  );
}
