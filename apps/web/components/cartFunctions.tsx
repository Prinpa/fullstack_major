export async function addToCart(productId: number, userId: string, quantity: number) {
  console.log("Adding to cart", { productId, userId, quantity });
  const response = await fetch('http://localhost:3000/api/cart', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, userId, quantity}),
  });
  const data = await response.json();
  return data.data;
}

//get cart by user id
export async function getCartByUserId(userId: string) {
  console.log("Getting cart for userId", userId);
  const response = await fetch(`http://localhost:3000/api/cart/${userId}`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  console.log("data", data);
  return data.data ?? [];
}
