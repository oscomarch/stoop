import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { PostJobForm } from "./post-job-form";

export const metadata: Metadata = { title: "Post a job" };

export default async function NewJobPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink-900">
          Post a job.
        </h1>
        <p className="mt-2 text-ink-600">
          Up to 5 local pros bid over the next 48 hours. You won&apos;t see a single bid until
          the window closes, so the prices stay honest.
        </p>
      </div>

      <PostJobForm userId={user.id} />
    </div>
  );
}
