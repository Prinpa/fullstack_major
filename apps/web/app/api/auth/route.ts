import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "../../../../../packages/db/client";
import { compare } from "bcrypt";
import { env } from "@repo/env/web";
import { headers } from "next/headers";

const prisma = createClient();
// get
export async function GET(request: NextRequest) {
    const headersList = await headers();
    const authorization = headersList.get("Authorization");
    
    if (!authorization) {
        console.log("No authorization header found");
        return NextResponse.json({ message: "No authorization header" }, { status: 401 });
    }

    // Check if it's a Bearer token
    if (!authorization.startsWith('Bearer ')) {
        console.log("Not a bearer token");
        return NextResponse.json({ message: "Invalid token format" }, { status: 401 });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
        console.log("No token found in authorization header");
        return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        return NextResponse.json({ 
            message: "Token is valid",
            user: decoded
        }, { status: 200 });
    } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
}

// either log in ot create user
export async function POST(request: NextRequest) {
    try {
        const { firstName, lastName, email, password } = await request.json();

        // if no firstrname, create account
        if (firstName) {
            const test = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (test) {
                return NextResponse.json(
                    { error: "User already exists" },
                    { status: 401 }
                );
            }
            // create user in db
            const user = await prisma.user.create({
                data: {
                    email,
                    password,
                    firstName,
                    lastName,
                    role: "user",
                },
            });
            return NextResponse.json(
                { message: "User created" },
                { status: 201 }
            );
        }
        // User is trying to log in

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: "Email or Password incorrect" },
                { status: 401 }
            );
        }

        // Create JWT token with user data
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
            },
            env.JWT_SECRET,
            { expiresIn: "59m" }
        );
        try {
            const refreshToken = `rf_${Math.random().toString(36).slice(2)}`;

            // Create new refresh token
            await prisma.refreshTokens.create({
                data: {
                    userId: user.id,
                    refreshToken: refreshToken,
                },
            });            
            
            // Create response with JWT token
            const response = NextResponse.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            });

            // Set JWT token cookie
            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 59 * 60, // 59 minutes to match JWT expiration
                sameSite: "lax",
                path: "/",
            });

            // Set refresh token cookie
            response.cookies.set("refresh", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60, // 7 days
                sameSite: "lax",
                path: "/",
            });

            return response;
        } catch (error) {
            console.error("Refresh token error:", error);
            return NextResponse.json(
                { error: "Error creating refresh token" },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Logout function
// todo update this
export async function DELETE() {
    const response = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
    );

    // Clear both token and refresh token cookies
    response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });
    
    response.cookies.set("refresh", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return response;
}
