import { requireUser } from "@/lib/auth";
import { AppNav } from "@/components/app/app-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-cream-100">
      <AppNav user={user} />
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
