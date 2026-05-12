import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-100">
      <header className="px-6 py-6">
        <Link href="/" aria-label="Stoop home">
          <Logo />
        </Link>
      </header>
      <main className="mx-auto flex max-w-md flex-col gap-6 px-6 pb-16 pt-6">
        {children}
      </main>
    </div>
  );
}
