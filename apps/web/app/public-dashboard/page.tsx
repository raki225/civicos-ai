import { PublicDashboardView } from "@/components/PublicDashboardView";
import { getPublicMetrics } from "@/lib/api";

export default async function PublicDashboard() {
  const metrics = await getPublicMetrics();
  return <PublicDashboardView metrics={metrics} />;
}
