import { createClient } from "../../../../../packages/db/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { env } from "@repo/env/web"

export async function POST(request: NextRequest) {
  try {
    const prisma = createClient();
    const body = await request.json();
    const { productId, userId, quantity } = {...body};
    
    // Get and verify token directly in the route handler
    const authToken = request.cookies.get('auth_token')?.value
    console.log("authToken", authToken);
    if (!authToken) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode token to get user information
    const decoded = jwt.verify(authToken, env.JWT_SECRET) as {
      userId: string;
      role: string;
    }

    // Check if user is admin or if they're accessing their own cart
    if (decoded.role !== 'admin' && userId !== decoded.userId) {
      return NextResponse.json(
        { message: "Unauthorized: Can only modify your own cart" },
        { status: 403 }
      );
    }

    if (!productId || !userId || !quantity) {
      return NextResponse.json(
        { message: "Missing product data" },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cart.create({
      data: {
        userId: userId,
        productId: productId,
        quantity: quantity,
      },
    });

    return NextResponse.json(
      { data: cartItem, message: "Cart updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create cart item", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}