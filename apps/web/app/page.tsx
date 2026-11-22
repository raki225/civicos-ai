import { HomeContent } from "@/components/HomeContent";
import { getPublicMetrics } from "@/lib/api";

export default async function Home() {
  const metrics = await getPublicMetrics();
  return <HomeContent metrics={metrics} />;
}
