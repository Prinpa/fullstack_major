import Link from "next/link";
import { getUserRole } from "utils/auth";

export async function TopNav() {
  const userRole = await getUserRole();
  return (
    <>
      <h1><Link href={"/"}>Big home button</Link></h1>
      <h2><Link href={"/add-product"}>Add product</Link></h2>
      <h2><Link href={"/login"}>Log in</Link></h2>
      <h2><Link href={"/signUp"}>Sign up</Link></h2>
      <h2><Link href={"/logout"}>Log out</Link></h2>
      <h2>{userRole}a </h2>
      <hr />
    </>
  );
}
