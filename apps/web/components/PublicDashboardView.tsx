"use client";

import { AlertTriangle, Clock3, FileCheck2, FileText, Info } from "lucide-react";
import { CivicMap } from "@/components/CivicMap";
import { usePreferences } from "@/components/PreferencesProvider";
import type { PublicMetrics } from "@/lib/api";

export function PublicDashboardView({ metrics }: { metrics: PublicMetrics | null }) {
  const { t, labelFor } = usePreferences();
  if (!metrics) return <section className="page container narrow"><div className="empty-state"><AlertTriangle /><h1>{t("dashboard.unavailableTitle")}</h1><p>{t("dashboard.unavailableCopy")}</p></div></section>;
  const maxCategory = Math.max(1, ...Object.values(metrics.category_distribution));
  return <section className="page container dashboard-page">
    <div className="dashboard-heading"><div><div className="eyebrow">{t("dashboard.eyebrow")}</div><h1>{t("dashboard.title")}</h1><p>{t("dashboard.intro")}</p></div><div className="live-pill"><span /> {t("dashboard.live")}</div></div>
    <div className="dashboard-metrics">
      <article><FileText /><span>{t("dashboard.total")}</span><strong>{metrics.total_reports}</strong><small>{t("dashboard.totalNote")}</small></article>
      <article><AlertTriangle /><span>{t("dashboard.open")}</span><strong>{metrics.open_incidents}</strong><small>{t("dashboard.openNote")}</small></article>
      <article><FileCheck2 /><span>{t("dashboard.resolved")}</span><strong>{metrics.resolved_incidents}</strong><small>{t("dashboard.resolvedNote")}</small></article>
      <article><Clock3 /><span>{t("dashboard.median")}</span><strong>{metrics.median_resolution_hours ? `${metrics.median_resolution_hours}h` : "—"}</strong><small>{t("dashboard.medianNote")}</small></article>
    </div>
    <div className="dashboard-grid">
      <article className="panel map-panel"><div className="panel-heading"><div><h2>{t("dashboard.mapTitle")}</h2><p>{t("dashboard.mapCopy")}</p></div><span>{metrics.map_incidents.length} {t("dashboard.incidents")}</span></div><CivicMap points={metrics.map_incidents} /><div className="map-legend"><span><i className="dot critical" />{labelFor("critical")}</span><span><i className="dot high" />{labelFor("high")}</span><span><i className="dot medium" />{labelFor("medium")}</span><span><i className="dot low" />{labelFor("low")}</span></div></article>
      <article className="panel"><div className="panel-heading"><div><h2>{t("dashboard.categoryTitle")}</h2><p>{t("dashboard.categoryCopy")}</p></div></div><div className="bar-chart">{Object.entries(metrics.category_distribution).sort((a,b) => b[1]-a[1]).map(([category,count]) => <div className="bar-row" key={category}><div><span>{labelFor(category)}</span><strong>{count}</strong></div><div className="bar-track"><span style={{ width: `${(count/maxCategory)*100}%` }} /></div></div>)}</div></article>
    </div>
    <div className="notice neutral"><Info size={18} /><span>{metrics.data_note}</span></div>
  </section>;
}
