import { getUserData } from "./authFunctions";
import { getToken } from "./tokenFunctions";
import { CartItem } from "types";

export async function addToCart(
    productId: number,
    userId: string,
    quantity: number,
    price: number
) {
    const token = await getToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = new URL("/api/cart", baseUrl);
    const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, userId, quantity, price }),
    });
    const data = await response.json();
    return data.data;
}

//get cart by user id
export async function getCartByUserId(token: string | null) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = new URL("/api/cart", baseUrl);
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data.data ?? [];
}

export async function placeOrder() {
    const token = await getToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = new URL("/api/orders", baseUrl);
    const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data.data;
}

export async function getOrders() {
    const token = await getToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = new URL("/api/orders", baseUrl);
    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data ?? [];
}
