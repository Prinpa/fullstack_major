import { CreateUserData, LoginUserData } from "types";
// add user
export async function addUser(formData: CreateUserData) {
  const response = await fetch('http://localhost:3000/api/auth', {
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
export async function loginUser(formData: LoginUserData) {
  const response = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({...formData}),
  });
  const data = await response.json();
  return data;
}

// logout user
export async function logoutUser() {
  const response = await fetch('http://localhost:3000/api/auth', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}