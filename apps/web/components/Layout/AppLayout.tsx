import type { PropsWithChildren } from "react";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <>
    <div> herer</div>
      {children}
    <div> herer</div>

    </>
  );
}
