import Link from "next/link";

export async function TopNav() {
  return (
    <>
      <h1><Link href={"/"}>Big home button</Link></h1>
      <h2><Link href={"/add-product"}>Add product</Link></h2>
    </>
  );
}
