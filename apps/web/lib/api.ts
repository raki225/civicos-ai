export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export type Incident = {
  public_id: string;
  category: string;
  title: string;
  summary: string;
  status: string;
  priority_score: number;
  priority_label: string;
  report_count: number;
  latitude: number;
  longitude: number;
  created_at: string;
};

export type PublicMetrics = {
  total_reports: number;
  open_incidents: number;
  resolved_incidents: number;
  median_resolution_hours: number | null;
  reopened_cases: number;
  category_distribution: Record<string, number>;
  status_distribution: Record<string, number>;
  map_incidents: Array<{ public_id: string; category: string; status: string; priority: string; latitude: number; longitude: number }>;
  data_note: string;
};

export async function getPublicMetrics(): Promise<PublicMetrics | null> {
  try {
    const response = await fetch(`${API_URL}/public/metrics`, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

