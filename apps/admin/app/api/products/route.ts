import { createClient } from "../../../../../packages/db/client";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "types"

export async function GET(request: NextRequest) {
  try {
    const prisma = createClient();
    const products = await prisma.products.findMany({
      where: {
        deletedAt: null
      }
    });

    return NextResponse.json(
      { data: products, message: "Products retrieved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = createClient();
    const body = await request.json();
    const { productHolder } = body;

    if (!productHolder) {
      return NextResponse.json(
        { message: "Missing product data" },
        { status: 400 }
      );
    }

    const product = await prisma.products.create({
      data: {
        title: productHolder.title,
        content: productHolder.content,
        description: productHolder.description,
        imageUrl: productHolder.imageUrl,
        listedDate: new Date(),
        soldDate: null,
        price: productHolder.price,
        quantity: productHolder.quantity,
        category: productHolder.category,
        sold: productHolder.sold,
        active: productHolder.active,
      },
    });

    return NextResponse.json(
      { data: product, message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create product", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const prisma = createClient();
    const body = await request.json();
    const { productHolder } = body;
    // TODO maybe below overkill on validation
    if (!productHolder || !productHolder.id) {
      return NextResponse.json(
        { message: "Missing product data or ID" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.products.findUnique({
      where: { id: productHolder.id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const product = await prisma.products.update({
      where: {
        id: productHolder.id,
      },
      data: {
        title: productHolder.title,
        content: productHolder.content,
        description: productHolder.description,
        imageUrl: productHolder.imageUrl,
        listedDate: productHolder.listedDate,
        soldDate: productHolder.soldDate,
        price: productHolder.price,
        quantity: productHolder.quantity,
        category: productHolder.category,
        sold: productHolder.sold,
        active: productHolder.active,
      },
    });

    return NextResponse.json(
      { data: product, message: "Product updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update product", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}