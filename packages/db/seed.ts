import { createClient } from "./client";

export async function seed() {
  const client = createClient();
  console.log("Seeding database...");
  // drop all tables using prisma orm
  await client.cart.deleteMany();
  await client.products.deleteMany();
  await client.orders.deleteMany();
  await client.refreshTokens.deleteMany();
  await client.user.deleteMany();

  // add 3 products
  await client.products.createMany({
    data: [
      {
        title: "Product 1",
        description: "Description for product 1",
        price: 100,
        imageUrl: "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg",
        content: "Content for product 1",
        category: "Category 1",
        quantity: 10,
      },
      {
        title: "Product 2",
        description: "Description for product 2",
        price: 200,
        imageUrl: "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg",
        content: "Content for product 2",
        category: "Category 2",
        quantity: 20,
      },
      {
        title: "Product 3",
        description: "Description for product 3",
        price: 300,
        imageUrl: "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg",
        content: "Content for product 3",
        category: "Category 3",
        quantity: 30,
      },
    ],
  });
}