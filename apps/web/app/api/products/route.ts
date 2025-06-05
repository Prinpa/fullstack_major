import { createClient } from "../../../../../packages/db/client";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "types";

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json(
            { data: [], message: "Products retrieved successfully" },
            { status: 200 }
        );
        const prisma = createClient();
        const searchParams = request.nextUrl.searchParams;
        const title = searchParams.get("title");
        const category = searchParams.get("category");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sortBy = searchParams.get("sortBy");
        
        console.log("searchParams:", searchParams);
        
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

        const where: any = {
            deletedAt: null,
        };

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

        const products = await prisma.products.findMany({
            where: where,
            orderBy: orderBy,
        });
        //console.log(products)
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

export async function POST(request: NextRequest) {
    try {
        const prisma = createClient();
        const body = await request.json();
        const productHolder = body;
        console.log("here");
        if (!productHolder) {
            return NextResponse.json(
                { message: "Missing product data" },
                { status: 400 }
            );
        }
        console.log("product holder:", productHolder);

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
                deletedAt: null,
            },
        });
        console.log("here");

        return NextResponse.json(
            { data: product, message: "Product created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
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
            where: { id: productHolder.id },
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
