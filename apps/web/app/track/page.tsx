"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Search } from "lucide-react";
import { API_URL } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

type Tracking = { tracking_id: string; incident_public_id: string; category: string; summary: string; status: string; priority_label: string; created_at: string; timeline: Array<{ status: string; reason: string; at: string }> };

function TrackContent() {
  const params = useSearchParams();
  const [id, setId] = useState(params.get("id") ?? "");
  const [data, setData] = useState<Tracking | null>(null);
  const [error, setError] = useState("");

  async function lookup(trackingId: string) {
    setError(""); setData(null);
    try {
      const response = await fetch(`${API_URL}/reports/${trackingId.trim()}`);
      if (!response.ok) throw new Error("We could not find that tracking ID.");
      setData(await response.json());
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load report."); }
  }
  useEffect(() => { if (params.get("id")) void lookup(params.get("id")!); }, [params]);
  function submit(event: FormEvent) { event.preventDefault(); void lookup(id); }

  return <section className="page container narrow"><div className="page-heading centered"><div className="eyebrow">Complaint tracking</div><h1>Follow the work, step by step.</h1><p>Enter the private tracking ID from your submission confirmation.</p></div>
    <form className="search-card" onSubmit={submit}><Search size={21} /><input value={id} onChange={e => setId(e.target.value.toUpperCase())} placeholder="CVR-YYMMDD-XXXXXX" aria-label="Tracking ID" required /><button className="button primary">Track</button></form>
    {error && <div className="error"><AlertCircle size={18} />{error}</div>}
    {data && <div className="tracking-result"><div className="result-header"><div><span>{data.incident_public_id}</span><h2>{data.summary}</h2></div><StatusBadge value={data.status} /></div><div className="result-meta"><span>Category <strong>{data.category.replaceAll("_", " ")}</strong></span><span>Priority <strong>{data.priority_label}</strong></span><span>Reported <strong>{new Date(data.created_at).toLocaleDateString()}</strong></span></div><ol className="timeline">{data.timeline.map((item, i) => <li key={`${item.at}-${i}`}><CheckCircle2 size={20} /><div><strong>{item.status.replaceAll("_", " ")}</strong><p>{item.reason}</p><time>{new Date(item.at).toLocaleString()}</time></div></li>)}</ol></div>}
  </section>;
}

export default function TrackPage() {
  return <Suspense fallback={<section className="page container narrow"><div className="loading-state">Loading tracking…</div></section>}><TrackContent /></Suspense>;
}

