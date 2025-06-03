import { createClient } from "../../../../../../packages/db/client";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { checkToken } from "components/tokenFunctions";

const prisma = createClient();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const product = await prisma.products.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: product, message: "Product retrieved successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to fetch product",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = await headers();
        const authorization = headersList.get("Authorization");
        const userData = await checkToken(authorization);

        if (!userData || userData.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        const { id } = await params;
        const body = await request.json();
        const productHolder = body;

        // if id and body.id are not the same, return an error
        if (id != productHolder.id) {
            return NextResponse.json(
                { message: "Product ID mismatch" },
                { status: 400 }
            );
        }

        if (!productHolder) {
            return NextResponse.json(
                { message: "Product data is required" },
                { status: 400 }
            );
        }

        const existingProduct = await prisma.products.findUnique({
            where: { id: Number(id) },
        });

        if (!existingProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        const product = await prisma.products.update({
            where: { id: 8 },
            data: productHolder,
        });

        return NextResponse.json(
            { data: product, message: "Product updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to update product",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = await headers();
        const authorization = headersList.get("Authorization");
        const userData = await checkToken(authorization);
        // only admins can do this action
        if (!userData || userData.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }            

        const { id } = await params;
        const product = await prisma.products.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: product, message: "Product soft deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to soft delete product",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
