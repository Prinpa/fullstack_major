import Link from "next/link";
import { getUserRole, getUserId } from "utils/auth";
import  LogoutButton from "components/Auth/LogoutButton";

export async function TopNav() {
  const userId = await getUserId();
  
  return (
    <>
      <h1><Link href={"/"}>Big home button</Link></h1>
      {!userId ? (
        <>
          <h2><Link href={"/login"}>Log in</Link></h2>
          <h2><Link href={"/signUp"}>Sign up</Link></h2>
        </>
      ) : (
        <LogoutButton/>
      )}
      <h2><Link href={"/cart"}>Cart</Link></h2>
      <h2>Hello user: {userId}  </h2>
      <hr />
    </>
  );
}
