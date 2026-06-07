import { ComingSoon } from "@/components/app/coming-soon";

export default function JobsFeedPage() {
  return (
    <ComingSoon
      title="Your local job feed"
      description="Open jobs inside your service radius, filtered to your trades, are landing here next. Bids you place stay blind until the window closes."
      cta={{ href: "/dashboard", label: "Back to home" }}
    />
  );
}
