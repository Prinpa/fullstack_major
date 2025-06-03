// get user cart by id
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../../packages/db/client";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/web";
import { headers } from "next/headers";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {

        const prisma = createClient();
        const { id } = params;
        
        const headersList = await headers();
        const authorization = headersList.get("Authorization");
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Unauthorized: No token provided" },
                { status: 401 }
            );
        }
        const token = authorization.split(" ")[1];


        const decoded = jwt.verify(token, env.JWT_SECRET || "your-secret-key");
        console.log("userId here", decoded.userId);

        const userId = Number(id);
        if (isNaN(userId)) {
            return NextResponse.json(
                { message: "Invalid user ID" },
                { status: 400 }
            );
        }



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
            {
                message: "Failed to locate cart",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
