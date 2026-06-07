import { ComingSoon } from "@/components/app/coming-soon";

export default function NewJobPage() {
  return (
    <ComingSoon
      title="Post a job"
      description="The job posting flow with photos and a map-pinned location (exact address stays hidden until you hire) is up next."
      cta={{ href: "/dashboard", label: "Back to home" }}
    />
  );
}
