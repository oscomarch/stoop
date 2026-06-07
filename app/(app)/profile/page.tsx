import { requireUser } from "@/lib/auth";
import { ComingSoon } from "@/components/app/coming-soon";

export default async function ProfilePage() {
  const user = await requireUser();
  const isContractor = user.role === "contractor";

  return (
    <ComingSoon
      title={isContractor ? "Your pro profile" : "Your profile"}
      description={
        isContractor
          ? "Trades, service radius, license upload, reviews, and your completion rate will live here."
          : "Your account details and posted jobs will live here."
      }
      cta={{ href: "/dashboard", label: "Back to home" }}
    />
  );
}
