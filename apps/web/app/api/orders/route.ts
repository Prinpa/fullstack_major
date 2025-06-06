import { createClient } from "../../../../../packages/db/client";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/web";
import { CartItem } from "types";
import { getUserDataFromAuthHeader } from "components/tokenFunctions";
import { NextResponse, NextRequest } from "next/server";

const prisma = createClient();

export async function GET(request: NextRequest) {
  try {
    const headersList = request.headers;
    const authorization = headersList.get("Authorization");

    const userData = await getUserDataFromAuthHeader(authorization);
    if (typeof userData === "string") {
      return NextResponse.json({ message: userData }, { status: 401 });
    }

    let orders;
    // if the users role is not admin, return only their orders
    if (userData.role !== "admin") {
      orders = await prisma.orders.findMany({
        where: {
          userId: userData.userId,
        },
        select: {
          orderId: true,
          productId: true,
          quantity: true,
          price: true,
          createdAt: true,
          userId: true,
          product: {
            select: {
              id: true,
              title: true,
              content: true,
              description: true,
              imageUrl: true,
              price: true,
              category: true,
              quantity: true,
              active: true,
              sold: true,
            },
          },
        },
      });
    } else {
      orders = await prisma.orders.findMany({
        select: {
          orderId: true,
          productId: true,
          quantity: true,
          price: true,
          createdAt: true,
          userId: true,
          product: {
            select: {
              id: true,
              title: true,
              content: true,
              description: true,
              imageUrl: true,
              price: true,
              category: true,
              quantity: true,
              active: true,
              sold: true,
            },
          },
        },
      });
    }

    // Group orders by orderId
    const groupedOrders = Object.values(
      orders.reduce(
        (acc, order) => {
          const { orderId, userId, createdAt, ...item } = order;
          if (!acc[orderId]) {
            acc[orderId] = {
              orderId,
              userId: userData.role === "admin" ? userId : undefined,
              createdAt,
              items: [],
            };
          }
          acc[orderId].items.push({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            product: item.product,
          });
          return acc;
        },
        {} as Record<
          string,
          { orderId: string; userId?: number; createdAt: Date; items: any[] }
        >
      )
    );
    // Group orders by orderId


    return new Response(JSON.stringify(groupedOrders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to fetch orders",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = request.headers;
    const authorization = headersList.get("Authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ") ||
      authorization.split(" ").length !== 2
    ) {
      return new Response(
        JSON.stringify({
          message:
            "Unauthorized: Ensure authorisation token is correct bearer token",
        }),
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1] as string;
    const userData = jwt.verify(token, env.JWT_SECRET) as { userId: number };

    // Generate a unique orderId using timestamp and userId
    const orderId = `${Date.now()}-${userData.userId}`;

    // Get cart items
    const cart = await prisma.cart.findMany({
      where: {
        userId: userData.userId,
      },
    });

    if (cart.length === 0) {
      return new Response(JSON.stringify({ message: "Cart is empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Create orders with the same orderId for all items
    const order = await prisma.orders.createMany({
      data: cart.map((item: CartItem) => ({
        orderId: orderId,
        userId: userData.userId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    // Clear the user's cart after order is created
    await prisma.cart.deleteMany({
      where: {
        userId: userData.userId,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Order placed successfully",
        orderId: orderId,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to place order",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
