import Link from "next/link";
import { getUserData } from "components/authFunctions";
import  LogoutButton from "components/Auth/LogoutButton";


export async function TopNav() {
  const userData = await getUserData();
  
  return (
    <>
      <h1><Link href={"/"}>Big home button</Link></h1>
      {userData.role === "guest" ? (
        <>
          <h2><Link href={"/login"}>Log in</Link></h2>
          <h2><Link href={"/signUp"}>Sign up</Link></h2>
        </>
      ) : (
        <> 
          <LogoutButton/>
          <h2>Hello user: {userData.firstName}</h2>
          <h2>Your role is: {userData.role}</h2>
          <h2><Link href={"/cart"}>Cart</Link></h2>
          <h2><Link href={"/orders"}>Orders</Link></h2>
        </>
      )}
      {userData.role === "admin" && <><h2><Link href={"/add-product"}>Add product</Link></h2></>}
      <hr />
    </>
  );
}
