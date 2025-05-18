import { createClient } from "../../../../../../packages/db/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = createClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
      { message: "Failed to fetch product", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}