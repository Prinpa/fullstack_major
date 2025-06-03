import { Product } from "types";
import AddToCartButton from "components/Cart/AddToCartButton";
import { getUserData } from "components/authFunctions";

export async function ProductDetail({ product }: { product: Product }) {
    const userData = await getUserData();
    return (
        <div>
            {userData.role === "admin" ? (
                <>admin test</>
            ) : (
                <div>
                    <h1>{product.title}</h1>
                    <p>{product.content}</p>
                    {userData ? (
                        <AddToCartButton productId={product.id} />
                    ) : (
                        <p>Please login to add items to cart</p>
                    )}
                </div>
            )}
        </div>
    );
}
