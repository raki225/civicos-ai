import { AlertTriangle, Clock3, FileCheck2, FileText, Info } from "lucide-react";
import { CivicMap } from "@/components/CivicMap";
import { getPublicMetrics } from "@/lib/api";

export default async function PublicDashboard() {
  const metrics = await getPublicMetrics();
  if (!metrics) return <section className="page container narrow"><div className="empty-state"><AlertTriangle /><h1>Public data is temporarily unavailable</h1><p>The API may still be starting. Please try again shortly.</p></div></section>;
  const maxCategory = Math.max(1, ...Object.values(metrics.category_distribution));
  return <section className="page container dashboard-page">
    <div className="dashboard-heading"><div><div className="eyebrow">Public transparency portal</div><h1>Infrastructure, in the open.</h1><p>Privacy-safe, database-backed performance indicators. No personal details or precise home coordinates are published.</p></div><div className="live-pill"><span /> Live stored data</div></div>
    <div className="dashboard-metrics">
      <article><FileText /><span>Total reports</span><strong>{metrics.total_reports}</strong><small>All citizen submissions</small></article>
      <article><AlertTriangle /><span>Open incidents</span><strong>{metrics.open_incidents}</strong><small>Grouped civic issues</small></article>
      <article><FileCheck2 /><span>Resolved</span><strong>{metrics.resolved_incidents}</strong><small>With documented closure</small></article>
      <article><Clock3 /><span>Median resolution</span><strong>{metrics.median_resolution_hours ? `${metrics.median_resolution_hours}h` : "—"}</strong><small>Resolved records only</small></article>
    </div>
    <div className="dashboard-grid">
      <article className="panel map-panel"><div className="panel-heading"><div><h2>Incident landscape</h2><p>Approximate locations protect reporter privacy.</p></div><span>{metrics.map_incidents.length} incidents</span></div><CivicMap points={metrics.map_incidents} /><div className="map-legend"><span><i className="dot critical" />Critical</span><span><i className="dot high" />High</span><span><i className="dot medium" />Medium</span><span><i className="dot low" />Low</span></div></article>
      <article className="panel"><div className="panel-heading"><div><h2>Issues by category</h2><p>Grouped incidents, not raw reports.</p></div></div><div className="bar-chart">{Object.entries(metrics.category_distribution).sort((a,b) => b[1]-a[1]).map(([category,count]) => <div className="bar-row" key={category}><div><span>{category.replaceAll("_", " ")}</span><strong>{count}</strong></div><div className="bar-track"><span style={{ width: `${(count/maxCategory)*100}%` }} /></div></div>)}</div></article>
    </div>
    <div className="notice neutral"><Info size={18} /><span>{metrics.data_note}</span></div>
  </section>;
}

