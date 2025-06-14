"use client"
import { addToCart } from "components/cartFunctions"
import { getUserData } from "components/authFunctions";
import { useState } from "react"


export function AddToCartButton( {productId, quantity, price}: {productId: number; quantity: number, price: number}) {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleAddToCart = async () => {
    try {

      setIsLoading(true);
      setError(null);
      const userData = await getUserData();
      
      if (!userData) {
        setError("Please login to add items to cart");
        return;
      }
      await addToCart(productId, userData.userId, quantity, price);
      // Optional: Add success feedback here
    } catch (err) {
      setError("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <button 
        onClick={handleAddToCart}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? 'Adding...' : 'Add To Cart'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default AddToCartButton;