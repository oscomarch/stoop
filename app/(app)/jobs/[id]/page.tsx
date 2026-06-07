import { ComingSoon } from "@/components/app/coming-soon";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return (
    <ComingSoon
      title="Job details"
      description="The full job view with the blind-bid panel and side-by-side reveal is being rebuilt on the new model."
      cta={{ href: "/dashboard", label: "Back to home" }}
    />
  );
}
