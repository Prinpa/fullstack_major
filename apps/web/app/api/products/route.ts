import { createClient } from "../../../../../packages/db/client";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "types";
import { put } from '@vercel/blob';
import { headers } from "next/headers";
import { getUserDataFromAuthHeader } from "components/tokenFunctions";

const prisma = createClient();

// retreiving all products filtered by filters
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const title = searchParams.get("title");
        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sortBy = searchParams.get("sortBy");
        const showDeleted = searchParams.get("showDeleted") === "true";
                
        let orderBy: any = {};
        if (sortBy === "price_asc") {
            orderBy.price = "asc";
        } else if (sortBy === "price_desc") {
            orderBy.price = "desc";
        } else if (sortBy === "title_asc") {
            orderBy.title = "asc";
        } else if (sortBy === "title_desc") {
            orderBy.title = "desc";
        } else if (sortBy === "listedDate_desc") {
            orderBy.listedDate = "desc"; 
        } else if (sortBy === "listedDate_asc") {
            orderBy.listedDate = "asc";
        } 

        const where: any = {};


        if (title) {
            where.title = {
                contains: title,
            };
        }
        if (category) {
            where.category = category;
        }
        if (minPrice) {
            where.price = {
                ...where.price,
                gte: parseFloat(minPrice),
            };
        }
        if (maxPrice) {
            where.price = {
                ...where.price,
                lte: parseFloat(maxPrice),
            };
        }
        
        if (!showDeleted) {
            where.deletedAt = null; 
        }

        const products = await prisma.products.findMany({
            where: where,
            orderBy: orderBy,
        });
        return NextResponse.json(
            { data: products, message: "Products retrieved successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            {
                message: "Failed to fetch products",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// adding products
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const headersList = await headers();
    const authorization = headersList.get("Authorization");
    const userData = await getUserDataFromAuthHeader(authorization);
    if (typeof userData === "string") {
      return NextResponse.json({ message: userData }, { status: 401 });
    }
    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    // Extract product fields
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);
    const category = formData.get("category") as string;
    const sold = formData.get("sold") === "true";
    const active = formData.get("active") === "true";
    const image = formData.get("image") as File | null;

    if (!title || !content || !description || !category || isNaN(price) || isNaN(quantity)) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    let imageUrl: string | undefined;
    if (image) {
      // Upload image to Vercel Blob
      const blob = await put(`products/${title}-${image.name}`, image, {
        access: "public",
      });
      imageUrl = blob.url;
    } else {
        imageUrl = ""; 
    }

    // Create product in database
    const product = await prisma.products.create({
      data: {
        title,
        content,
        description,
        imageUrl,
        listedDate: new Date(),
        soldDate: null,
        price,
        quantity,
        category,
        sold,
        active,
        deletedAt: null,
      },
    });

    return NextResponse.json(
      { data: product, message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      {
        message: "Failed to create product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const headersList = await headers();
    const authorization = headersList.get("Authorization");
    const userData = await getUserDataFromAuthHeader(authorization);
    if (typeof userData === "string") {
      return NextResponse.json({ message: userData }, { status: 401 });
    }
    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    // Extract product fields
    const id = parseInt(formData.get("id") as string);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);
    const category = formData.get("category") as string;
    const sold = formData.get("sold") === "true";
    const active = formData.get("active") === "true";
    const image = formData.get("image") as File | null;

    if (!id || !title || !content || !description || !category || isNaN(price) || isNaN(quantity)) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingProduct = await prisma.products.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    let imageUrl = existingProduct.imageUrl;
    if (image) {
      // Upload new image to Vercel Blob
      const blob = await put(`products/${title}-${image.name}`, image, {
        access: "public",
      });
      imageUrl = blob.url;
    }

    const product = await prisma.products.update({
      where: { id },
      data: {
        title,
        content,
        description,
        imageUrl,
        price,
        quantity,
        category,
        sold,
        active,
      },
    });

    return NextResponse.json(
      { data: product, message: "Product updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      {
        message: "Failed to update product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// delete product
export async function DELETE(request: NextRequest) {
    try {
        const prisma = createClient();
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Missing product ID" },
                { status: 400 }
            );
        }

        const product = await prisma.products.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json(
            { data: product, message: "Product deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to delete product",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
