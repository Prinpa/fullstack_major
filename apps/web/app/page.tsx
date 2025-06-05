import { getUserData } from "components/authFunctions";
import { AppLayout } from "components/Layout/AppLayout";
import { getProducts } from "components/productFunctions";
import { ProductList } from "components/Products/ProductList";
import  { Product } from "types";
import { FilterForm } from "components/Products/filterForm";

export default async function Home() {
  const initialProducts = await getProducts();
  
  return (
      <div className="flex flex-col gap-4">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome to Our Store</h1>
          </div>
      </div>
  );
}
