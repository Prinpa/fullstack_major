// get user cart by id
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../../packages/db/client";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/web";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the auth_token cookie
    // const authToken = request.cookies.get("auth_token")?.value;
    // if (!authToken) {
    //   return NextResponse.json(
    //     { message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    // // Verify and decode the JWT
    // let tokenPayload: any;
    // try {
    //   tokenPayload = jwt.verify(authToken, env.JWT_SECRET);
    // } catch (err) {
    //   return NextResponse.json(
    //     { message: "Invalid or expired token" },
    //     { status: 401 }
    //   );
    // }

    const prisma = createClient();
    const { id } = params;
    console.log("userId here", id);

    const userId = Number(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Check if user is admin or accessing their own cart
    // if (tokenPayload.role !== 'admin' && tokenPayload.userId !== id) {
    //   return NextResponse.json(
    //     { message: "Forbidden: You can only view your own cart" },
    //     { status: 403 }
    //   );
    // }

    const cart = await prisma.cart.findMany({
      where: {
        userId: userId,
      },
    });
    console.log("cart", cart);

    return NextResponse.json(
      { data: cart, message: "Users cart retrieved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to locate cart", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}