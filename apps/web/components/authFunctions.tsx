import { CreateUserData, LoginUserData } from "types";
import { getToken } from "./tokenFunctions";

const guestUser = {
    id: 0,
    name: "SHOUDLNT SHOW UP ANYWHERE",
    email: "SHOUDLNT SHOW UP ANYWHERE",
    role: "guest"}
// get user data
export async function getUserData() {
    const token = await getToken();
    if (!token) {
        return guestUser;
    }    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const url = new URL('/api/auth', baseUrl);
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
}
// add user
export async function addUser(formData: CreateUserData) {
  console.log("Add user response:");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = new URL('/api/auth', baseUrl);
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({...formData}),
  });
  const data = await response.json();
  return data;
}

// login user
export async function loginUser(formData: LoginUserData) {  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = new URL('/api/auth', baseUrl);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...formData}),
      credentials: 'include', // This is important to include cookies
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// logout user
export async function logoutUser() {  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = new URL('/api/auth', baseUrl);
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Logout failed');
    }
    return data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}