import type { ReactNode } from "react";
import { PublicNav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
