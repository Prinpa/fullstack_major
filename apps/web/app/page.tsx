import { getUserData } from "components/authFunctions";
import { AppLayout } from "components/Layout/AppLayout";
import { getProducts } from "components/productFunctions";
import { ProductList } from "components/Products/ProductList";

export default async function Home() {
  const products = await getProducts();

  const userData = await getUserData();
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome to Our Store</h1>
          </div>
          <ProductList products={products} />
      </div>
    </AppLayout>
  );
}
