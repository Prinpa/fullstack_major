"use client"
import { logoutUser } from "components/authFunctions"

const LogoutButton = () => { 
  return <button onClick={logoutUser}>Logout</button>
}

export default LogoutButton;