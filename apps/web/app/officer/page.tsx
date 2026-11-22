"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, Filter, LoaderCircle, Search, SlidersHorizontal } from "lucide-react";
import { API_URL, Incident } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default function OfficerPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  useEffect(() => {
    fetch(`${API_URL}/officer/incidents`, { headers: { "X-Demo-Role": "municipal_officer" } })
      .then(async r => { if (!r.ok) throw new Error("Officer queue is unavailable."); return r.json(); })
      .then(setIncidents).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);
  const filtered = useMemo(() => incidents.filter(item => `${item.public_id} ${item.category} ${item.summary}`.toLowerCase().includes(query.toLowerCase())), [incidents, query]);
  return <section className="page container dashboard-page">
    <div className="dashboard-heading"><div><div className="eyebrow">Municipal command center · Demo role</div><h1>Priority queue</h1><p>AI-ranked for attention; final triage and every override remain accountable to an officer.</p></div><button className="button secondary"><SlidersHorizontal size={17} /> Queue settings</button></div>
    <div className="queue-toolbar"><label><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search incidents" /></label><button><Filter size={17} /> Filter</button><span>{filtered.length} incidents</span></div>
    {loading && <div className="loading-state"><LoaderCircle className="spin" />Loading priority queue…</div>}
    {error && <div className="error"><AlertCircle size={18} />{error}</div>}
    {!loading && !error && <div className="incident-table" role="table"><div className="table-head" role="row"><span>Priority</span><span>Incident</span><span>Status</span><span>Reports</span><span>Received</span><span /></div>{filtered.map(item => <div className="table-row" role="row" key={item.public_id}><div className={`priority-number priority-${item.priority_label}`}><strong>{item.priority_score}</strong><span>{item.priority_label}</span></div><div className="incident-summary"><strong>{item.title}</strong><span>{item.public_id} · {item.summary}</span></div><div><StatusBadge value={item.status} /></div><div><strong>{item.report_count}</strong></div><div>{new Date(item.created_at).toLocaleDateString()}</div><button aria-label={`Open ${item.public_id}`}><ArrowUpRight size={18} /></button></div>)}</div>}
    <p className="form-note">Demo authentication uses an explicit development-only role header. Production mode rejects it and verifies Firebase ID tokens with server-side role claims.</p>
  </section>;
}

