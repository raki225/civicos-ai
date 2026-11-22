"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, Filter, LoaderCircle, Search, ShieldCheck } from "lucide-react";
import { API_URL, Incident } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { usePreferences } from "@/components/PreferencesProvider";

export default function OfficerPage() {
  const { t, labelFor, locale } = usePreferences();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/officer/incidents`, { headers: { "X-Demo-Role": "municipal_officer" } })
      .then(async response => { if (!response.ok) throw new Error(t("officer.unavailable")); return response.json(); })
      .then(setIncidents)
      .catch(reason => setError(reason.message))
      .finally(() => setLoading(false));
  }, [t]);

  const filtered = useMemo(() => incidents.filter((item) => {
    const matchesQuery = `${item.public_id} ${item.category} ${item.summary} ${item.title}`.toLowerCase().includes(query.toLowerCase());
    const matchesPriority = priority === "all" || item.priority_label === priority;
    return matchesQuery && matchesPriority;
  }), [incidents, priority, query]);

  return <section className="page container dashboard-page">
    <div className="dashboard-heading"><div><div className="eyebrow">{t("officer.eyebrow")}</div><h1>{t("officer.title")}</h1><p>{t("officer.intro")}</p></div><div className="live-pill"><ShieldCheck size={15} /> {t("officer.role")}</div></div>
    <div className="queue-toolbar">
      <label className="queue-search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t("officer.search")} aria-label={t("officer.search")} /></label>
      <label className="queue-filter"><Filter size={16} /><span className="sr-only">{t("officer.filter")}</span><select value={priority} onChange={event => setPriority(event.target.value)} aria-label={t("officer.filter")}><option value="all">{t("common.all")}</option>{["critical", "high", "medium", "low"].map((value) => <option value={value} key={value}>{labelFor(value)}</option>)}</select></label>
      <span>{filtered.length} {t("officer.count")}</span>
    </div>
    {loading && <div className="loading-state"><LoaderCircle className="spin" />{t("officer.loading")}</div>}
    {error && <div className="error" role="alert"><AlertCircle size={18} />{error}</div>}
    {!loading && !error && <div className="incident-table" role="table"><div className="table-head" role="row"><span>{t("officer.priority")}</span><span>{t("officer.incident")}</span><span>{t("officer.status")}</span><span>{t("officer.reports")}</span><span>{t("officer.received")}</span><span /></div>{filtered.map(item => <div className="table-row" role="row" key={item.public_id}><div className={`priority-number priority-${item.priority_label}`}><strong>{item.priority_score}</strong><span>{labelFor(item.priority_label)}</span></div><div className="incident-summary"><strong>{labelFor(item.category)}</strong><span>{item.public_id} · {item.summary}</span></div><div><StatusBadge value={item.status} /></div><div><strong>{item.report_count}</strong></div><div>{new Date(item.created_at).toLocaleDateString(locale)}</div><button aria-label={`Open ${item.public_id}`}><ArrowUpRight size={18} /></button></div>)}</div>}
    <p className="form-note">{t("officer.note")}</p>
  </section>;
}
