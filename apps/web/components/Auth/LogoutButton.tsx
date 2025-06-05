"use client"
import { logoutUser } from "components/authFunctions"

const test = async () => {
  const reponse = await logoutUser();
  window.location.reload();
}


const LogoutButton = () => { 
  return <button onClick={test}>Logout</button>
}

export default LogoutButton;