import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // Check if user has admin privileges (not 'public' role)
  if (session.user.role === "public") {
    redirect("/");
  }

  return <>{children}</>;
}
