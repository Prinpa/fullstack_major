import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { AppLayout } from "../components/Layout/AppLayout";
import { getProducts } from "../components/productFunctions";
import { ProductList } from "../components/Products/ProductList";

export default async function Home() {
  const products = await getProducts();

  return (
   <AppLayout>
     <ProductList products={products}></ProductList>
     <div>THIS (^) IS THE PAGE CONTENT</div>
   </AppLayout>
  );
}
