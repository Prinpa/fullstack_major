import type { PropsWithChildren } from "react";
import { TopNav } from "./TopNav";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <>
      <TopNav />
      <main className="main-layout">
        {children}
      </main>
    </>
  );
}
