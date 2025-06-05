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

export async function getUserDataFromAuthHeader(header: string | null) {
    if (!header) {
        return "No authorization header found";
    }
    if (!header.startsWith("Bearer ")) {
        return "Not a bearer token";
    }
    const token = header.split(" ")[1];
    if (!token) {
        return "No token found in authorization header";
    }
    const userData = jwt.verify(token, env.JWT_SECRET);
    if (typeof userData === "string") {
        return "Invalid token format";
    }
    if (!userData) {
        return "unknown error";
    }
    return userData;
}
