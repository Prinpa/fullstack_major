import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { env } from "@repo/env/web"
import { cookies } from "next/headers";

const protectedPaths = [
  '/api/crt',
]

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname
    
    const isProtectedPath = protectedPaths.some(protectedPath => 
      path.startsWith(protectedPath)
    )

    if (isProtectedPath) {
      const authToken = request.cookies.get('auth_token')
      console.log("authToken OVER HERE", authToken);
      if (!authToken?.value) {
        return NextResponse.json(
          { message: 'Unauthorized: Please login to access this resource' }, 
          { status: 401 }
        )
      }

      try {
        // Only verify the token in middleware
        jwt.verify(authToken.value, env.JWT_SECRET)
        return NextResponse.next()
      } catch (error) {
        return NextResponse.json(
          { message: 'Invalid token' },
          { status: 401 }
        )
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.json(
      { message: 'Internal server error during authentication' },
      { status: 500 }
    )
  }
}

export const config = {
  matcher: [
    '/api/cart/:path*',
  ]
}