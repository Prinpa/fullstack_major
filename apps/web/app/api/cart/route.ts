import { createClient } from "../../../../../packages/db/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/web";
import { headers } from "next/headers";

// get method
export async function GET(request: NextRequest) {
    try {
        const prisma = createClient();
        const headersList = await headers();
        const authorization = headersList.get("Authorization");

        if (!authorization) {
            return NextResponse.json(
                { message: "Unauthorized: No authorization provided" },
                { status: 401 }
            );
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized: No token provided" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as {
            userId: number;
        };

        const cart = await prisma.cart.findMany({
            where: {
                userId: decoded.userId,
            },
        });

        return NextResponse.json(
            { data: cart, message: "Users cart retrieved successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to locate cart",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const prisma = createClient();
        const body = await request.json();
        const { productId, userId, quantity } = { ...body };
        
        const headersList = await headers();
        const authorization = headersList.get("Authorization");
        const token = authorization?.split(" ")[1];
        console.log("Request Body:", token);
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized: No token provided" },
                { status: 401 }
            );
        }
        const userData = jwt.verify(token, env.JWT_SECRET) as {userId: number};

        // Check if user is admin or if they're accessing their own cart
        console.log("User Data:", userData);
        console.log(userId)
        if (userId != userData.userId) {
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
            {
                message: "Failed to create cart item",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
