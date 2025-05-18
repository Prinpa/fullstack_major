import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createClient } from "../../../../../packages/db/client";
import { compare } from "bcrypt";
import { env } from "@repo/env/web";

const prisma = createClient();  

// either log in ot create user
export async function POST(request: Request) {
    try {
        const {firstName, lastName, email, password}  = await request.json();

		// if no firstrname, create account 
		if (firstName) {
			const test = await prisma.user.findUnique({
				where: {  
                    email: email
                }
			});
			if (test) {
				return NextResponse.json(
					{ error: "User already exists" },
					{ status: 401 }
				)
			}
			// create user in db
			const user = await prisma.user.create({
				data: {
					email,
					password,
					firstName,
					lastName,
					role: "user"
				}
			});
			return NextResponse.json(
                { message: "User created" },
                { status: 201 }
            );
		}
        // User is trying to log in

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 401 }
            );
        }

        // Verify password
        //const validPassword = await compare(password, user.password);
        const validPassword = password === user.password;
		if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid password", correct: false},
                { status: 401 }
            );
        }

        // Create JWT token with user data
        const token = jwt.sign({
                userId: user.id,
                email: user.email,
                role: user.role
            },
            env.JWT_SECRET || 'your-secret-key',
            { expiresIn: "15m" }
        );

        // Set HTTP-only cookie
        const response = NextResponse.json(
            { 
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            },
            { status: 200 }
        );

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            path: "/",
        });
        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Logout function
export async function DELETE() {
    const response = NextResponse.json(
        { message: 'Logged out successfully' },
        { status: 200 }
    );

    response.cookies.set('auth_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });

    return response;
}