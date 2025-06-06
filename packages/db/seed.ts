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
        listedDate: new Date(2023, 0, 15) // January 15, 2023
      },
      {
        title: "Product 2",
        description: "Description for product 2",
        price: 200,
        imageUrl: "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg",
        content: "Content for product 2",
        category: "Category 2",
        quantity: 20,
        listedDate: new Date(2023, 3, 1) // April 1, 2023
      },
      {
        title: "Product 15",
        description: "Description for product 3",
        price: 300,
        imageUrl: "https://25dikzmikm3htwyx.public.blob.vercel-storage.com/products/clown-cMVZhEWtDCLR4TXJYbbo6O0smIuHIL.jpg",
        content: "Content for product 3",
        category: "Category 3",
        quantity: 30,
        listedDate: new Date(2023, 6, 20) // July 20, 2023
      },
    ],
  });
  const products = await client.products.findMany();
  return products;
}