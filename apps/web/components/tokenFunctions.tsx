"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/web";

export async function getToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
        return null;
    }
    return token;
}

export async function checkToken(header: string | null) {
    if (!header) {
        console.log("No authorization header found");
        return null;
    }
    if (!header.startsWith("Bearer ")) {
        console.log("Not a bearer token");
        return null;
    }
    const token = header.split(" ")[1];
    if (!token) {
        console.log("No token found in authorization header");
        return null;
    }
    const userData = jwt.verify(token, env.JWT_SECRET);
    if (typeof userData === "string") {
        return null;
    }
    if (!userData) {
        console.log("Invalid token");
        return null;
    }
    return userData;
}
