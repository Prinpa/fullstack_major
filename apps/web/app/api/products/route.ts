import { createClient } from "../../../../../packages/db/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const prisma = createClient();
  const products = await prisma.products.findMany()
  return NextResponse.json(products);
}