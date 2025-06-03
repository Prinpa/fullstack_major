import { getToken } from "./tokenFunctions";
export async function addToCart(
    productId: number,
    userId: string,
    quantity: number,
) {
    const token = await getToken();
    console.log("Token:", token);
    const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, userId, quantity }),
    });
    const data = await response.json();
    return data.data;
}

//get cart by user id
export async function getCartByUserId(token: string | undefined) {
      const response = await fetch(`http://localhost:3000/api/cart`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    return data.data ?? [];
}
