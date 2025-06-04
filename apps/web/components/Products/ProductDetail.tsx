"use client";
import { Product } from "types";
import AddToCartButton from "components/Cart/AddToCartButton";
import { getUserData } from "components/authFunctions";
import { useState, useEffect } from "react";


export function ProductDetail({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const [userData, setUserData] = useState<any>({role: "guest"}); // Default to guest role});
    useEffect(() => {
        async function fetchUserData() {
            const data = await getUserData();
            setUserData(data);
        };
        fetchUserData();
    }, []);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value >= 1) {
            setQuantity(value);
        }
    };
    
    return (
        <div>
            <div>
                <h1>{product.title}</h1>
                <p>{product.content}</p>
                {userData.role !== "guest" ? (
                        <div className="">
                            <div className="">
                                <label htmlFor="quantity" className="">
                                    Quantity:
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className=""
                                />
                            </div>
                        <AddToCartButton
                            productId={product.id}
                            quantity={quantity}
                            price={product.price}
                        />
                    </div>
                ) : (
                    <p>Please login to add items to cart</p>
                )}
            </div>
        </div>
    );
}
