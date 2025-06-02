"use server"
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin"
import { cookies } from "next/headers";

export async function isLoggedIn() {
  
  const userCookies = await cookies();

  const token = userCookies.get("auth_token")?.value;

  return token && jwt.verify(token, env.JWT_SECRET);
}

export async function getUserRole() {
  const userCookies = await cookies();

  const token = userCookies.get("auth_token")?.value;

  if (token) {
    const {role} = jwt.verify(token, env.JWT_SECRET) as {role: string};
    return role;
  }
  return null;
}

export async function getUserId() {
  const userCookies = await cookies();

  const token = userCookies.get("auth_token")?.value;
 
  if (token) {
    const {userId} = jwt.verify(token, env.JWT_SECRET) as {userId: string};
    console.log("token", userId);
    return userId;
  }
  return null;
}