import { AppLayout } from "components/Layout/AppLayout";
import { getProducts } from "components/productFunctions";
import { ProductList } from "components/Products/ProductList";

export default async function Home() {
    const initialProducts = await getProducts();

    return (
        <AppLayout>
            <ProductList initialProducts={initialProducts} />
        </AppLayout>
    );
}
