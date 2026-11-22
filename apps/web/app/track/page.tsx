"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, LoaderCircle, Search } from "lucide-react";
import { API_URL } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { usePreferences } from "@/components/PreferencesProvider";

type Tracking = { tracking_id: string; incident_public_id: string; category: string; summary: string; status: string; priority_label: string; created_at: string; timeline: Array<{ status: string; reason: string; at: string }> };

function TrackContent() {
  const params = useSearchParams();
  const { t, labelFor, locale } = usePreferences();
  const [id, setId] = useState(params.get("id") ?? "");
  const [data, setData] = useState<Tracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup(trackingId: string) {
    setError("");
    setData(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reports/${trackingId.trim()}`);
      if (!response.ok) throw new Error(t("track.notFound"));
      setData(await response.json());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t("track.unable"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const trackingId = params.get("id");
    if (trackingId) void lookup(trackingId);
    // The initial query is intentionally loaded once when the URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function submit(event: FormEvent) {
    event.preventDefault();
    void lookup(id);
  }

  return <section className="page container narrow">
    <div className="page-heading centered"><div className="eyebrow">{t("track.eyebrow")}</div><h1>{t("track.title")}</h1><p>{t("track.intro")}</p></div>
    <form className="search-card" onSubmit={submit}><Search size={21} /><input value={id} onChange={event => setId(event.target.value.toUpperCase())} placeholder={t("track.placeholder")} aria-label={t("report.trackingId")} required /><button className="button primary" disabled={loading}>{loading ? <LoaderCircle className="spin" size={18} /> : null}{t("track.button")}</button></form>
    {error && <div className="error" role="alert"><AlertCircle size={18} />{error}</div>}
    {data && <div className="tracking-result"><div className="result-header"><div><span>{data.incident_public_id}</span><h2>{data.summary}</h2></div><StatusBadge value={data.status} /></div><div className="result-meta"><span>{t("track.category")} <strong>{labelFor(data.category)}</strong></span><span>{t("track.priority")} <strong>{labelFor(data.priority_label)}</strong></span><span>{t("track.reported")} <strong>{new Date(data.created_at).toLocaleDateString(locale)}</strong></span></div><ol className="timeline">{data.timeline.map((item, index) => <li key={`${item.at}-${index}`}><CheckCircle2 size={20} /><div><strong>{labelFor(item.status)}</strong><p>{item.reason}</p><time>{new Date(item.at).toLocaleString(locale)}</time></div></li>)}</ol></div>}
  </section>;
}

export default function TrackPage() {
  const { t } = usePreferences();
  return <Suspense fallback={<section className="page container narrow"><div className="loading-state"><LoaderCircle className="spin" />{t("track.loading")}</div></section>}><TrackContent /></Suspense>;
}
