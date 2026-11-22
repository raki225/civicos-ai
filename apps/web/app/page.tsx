import Link from "next/link";
import { ArrowRight, Camera, CheckCircle2, MapPinned, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { getPublicMetrics } from "@/lib/api";

export default async function Home() {
  const metrics = await getPublicMetrics();
  return (
    <>
      <section className="hero container">
        <div className="eyebrow"><Radio size={14} /> Public infrastructure, made visible</div>
        <h1>Better streets begin with<br /><span>evidence people can trust.</span></h1>
        <p className="hero-copy">Report civic issues in minutes. CivicOS AI organizes the evidence, explains urgency, and keeps every step of the resolution visible.</p>
        <div className="hero-actions">
          <Link className="button primary" href="/report"><Camera size={18} /> Report an issue</Link>
          <Link className="button secondary" href="/public-dashboard">Explore public data <ArrowRight size={18} /></Link>
        </div>
        <div className="trust-row"><span><ShieldCheck /> Privacy-first</span><span><CheckCircle2 /> Human-reviewed</span><span><Sparkles /> Explainable AI</span></div>
      </section>

      <section className="metric-strip container" aria-label="Public metrics">
        <div><strong>{metrics?.total_reports ?? "—"}</strong><span>Reports received</span></div>
        <div><strong>{metrics?.open_incidents ?? "—"}</strong><span>Open incidents</span></div>
        <div><strong>{metrics?.resolved_incidents ?? "—"}</strong><span>Resolved</span></div>
        <div><strong>{metrics?.median_resolution_hours ? `${metrics.median_resolution_hours}h` : "—"}</strong><span>Median resolution</span></div>
      </section>

      <section className="section container two-column">
        <div>
          <div className="eyebrow">One shared civic record</div>
          <h2>From a citizen’s camera to an accountable repair.</h2>
          <p>Each report becomes structured evidence. Nearby reports can join one incident without losing individual voices, while officers retain the final decision.</p>
        </div>
        <div className="steps">
          <article><span>01</span><Camera /><div><h3>Capture</h3><p>Add a photo, description, and location—even on a slow connection.</p></div></article>
          <article><span>02</span><Sparkles /><div><h3>Understand</h3><p>AI estimates urgency and shows exactly which factors influenced it.</p></div></article>
          <article><span>03</span><MapPinned /><div><h3>Resolve</h3><p>Departments triage, document repairs, and publish privacy-safe progress.</p></div></article>
        </div>
      </section>
    </>
  );
}

