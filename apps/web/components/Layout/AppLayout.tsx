import type { PropsWithChildren } from "react";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <>
    <div> Top nav</div>
    <div>filter</div>
      {children}
    </>
  );
}
