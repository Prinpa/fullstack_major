"use client"
import { logoutUser } from "components/authFunctions"

const test = async () => {
  console.log("test");
  const reponse = await logoutUser();
  console.log(reponse);
  window.location.reload();
}


const LogoutButton = () => { 
  return <button onClick={test}>Logout</button>
}

export default LogoutButton;