"use client";
import { Product } from "types";
import AddToCartButton from "components/Cart/AddToCartButton";
import { getUserData } from "components/authFunctions";
import { useState, useEffect } from "react";
import Image from "next/image";

export function ProductDetail({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const [userData, setUserData] = useState<any>({role: "guest"}); // Default to guest role;

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
    console.log("Product Detail:", product);
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={product.imageUrl || "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                {/* Product Information */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                        <p className="text-2xl font-semibold text-gray-700 mb-4">${product.price.toFixed(2)}</p>
                        <div className="prose prose-sm text-gray-600">
                            <p>{product.content}</p>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="border-t border-b border-gray-200 py-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Category</span>
                            <span className="text-sm font-medium text-gray-900">{product.category}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">Available Stock</span>
                            <span className="text-sm font-medium text-gray-900">{product.quantity}</span>
                        </div>
                    </div>

                    {/* Add to Cart Section */}
                    {userData.role !== "guest" ? (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                    Quantity:
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    max={product.quantity}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="shadow-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-20"
                                />
                            </div>
                            <div className="w-full">
                                <AddToCartButton
                                    productId={product.id}
                                    quantity={quantity}
                                    price={product.price}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Please login to add items to cart
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
