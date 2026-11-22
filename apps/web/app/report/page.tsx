"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Camera, Check, ChevronRight, Crosshair, LoaderCircle, MapPin, UploadCloud } from "lucide-react";
import { API_URL } from "@/lib/api";

type Result = {
  tracking_id: string;
  incident_public_id: string;
  duplicate_of: string | null;
  summary: string;
  priority: { score: number; category: string; explanation: string; contributing_factors: string[] };
  routing: { department_name: string | null; explanation: string };
  vision: { status: string; limitation?: string } | null;
};

export default function ReportPage() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function locate() {
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocating(false);
      },
      () => { setError("Location permission was not granted. Enter coordinates manually below."); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    if (location) {
      form.set("latitude", String(location.latitude));
      form.set("longitude", String(location.longitude));
    }
    try {
      const response = await fetch(`${API_URL}/reports`, { method: "POST", body: form, headers: { "X-Demo-Role": "citizen" } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail ?? "The report could not be submitted.");
      setResult(payload);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The report could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <section className="page container narrow">
        <div className="success-mark"><Check size={34} /></div>
        <div className="centered"><div className="eyebrow">Report received</div><h1>Thank you for speaking up.</h1><p>Your evidence is saved. Keep this tracking ID to follow every update.</p></div>
        <div className="tracking-card"><span>Tracking ID</span><strong>{result.tracking_id}</strong><button onClick={() => navigator.clipboard.writeText(result.tracking_id)}>Copy</button></div>
        <div className="analysis-card">
          <div className="score-ring"><strong>{result.priority.score}</strong><span>/ 100</span></div>
          <div><span className={`badge badge-${result.priority.category}`}>{result.priority.category} priority</span><h2>{result.summary}</h2><p>{result.priority.explanation}</p></div>
        </div>
        {result.duplicate_of && <div className="notice"><AlertCircle size={18} /><span>This report appears related to incident <strong>{result.duplicate_of}</strong>. Your evidence remains preserved as an individual report.</span></div>}
        {result.vision?.limitation && <div className="notice neutral"><AlertCircle size={18} /><span>{result.vision.limitation}</span></div>}
        <div className="hero-actions centered-actions"><Link className="button primary" href={`/track?id=${result.tracking_id}`}>Track this report <ChevronRight size={18} /></Link><button className="button secondary" onClick={() => { setResult(null); formRef.current?.reset(); }}>Report another</button></div>
      </section>
    );
  }

  return (
    <section className="page container report-layout">
      <div className="page-heading"><div className="eyebrow">Citizen reporting</div><h1>Show us what needs attention.</h1><p>Photo, location, and a short description are enough. Personal details are optional.</p></div>
      <form className="form-card" onSubmit={submit} ref={formRef}>
        <div className="form-section"><span className="form-step">1</span><div><h2>Add evidence</h2><p>A clear, nearby photo helps officers assess the issue.</p></div></div>
        <label className="upload-zone"><UploadCloud size={28} /><strong>Choose a photo</strong><span>JPEG, PNG, or WebP · up to 15 MB</span><input name="photo" type="file" accept="image/jpeg,image/png,image/webp" /></label>

        <div className="form-section"><span className="form-step">2</span><div><h2>Describe the problem</h2><p>Write in English, తెలుగు, or हिन्दी.</p></div></div>
        <div className="field-row">
          <label>Category<select name="category" required defaultValue=""><option value="" disabled>Select an issue</option><option value="pothole">Pothole</option><option value="road_damage">Road damage</option><option value="garbage">Garbage accumulation</option><option value="water_leakage">Water leakage</option><option value="drainage">Drainage obstruction</option><option value="streetlight">Broken streetlight</option><option value="other">Other</option></select></label>
          <label>Language<select name="language" defaultValue="en"><option value="en">English</option><option value="te">తెలుగు</option><option value="hi">हिन्दी</option></select></label>
        </div>
        <label>Description<textarea name="description" required minLength={8} maxLength={4000} rows={5} placeholder="What happened? Mention nearby landmarks and anything that makes this urgent." /></label>

        <div className="form-section"><span className="form-step">3</span><div><h2>Confirm the location</h2><p>Precise coordinates are kept private; the public map uses a rounded location.</p></div></div>
        <button type="button" className="location-button" onClick={locate}><Crosshair size={19} />{locating ? "Locating…" : location ? "Location captured" : "Use my current location"}{location && <Check size={18} />}</button>
        <div className="coordinate-row">
          <label>Latitude<input name="latitude" type="number" step="any" required value={location?.latitude ?? undefined} onChange={(e) => setLocation({ latitude: Number(e.target.value), longitude: location?.longitude ?? 0 })} placeholder="17.3850" /></label>
          <label>Longitude<input name="longitude" type="number" step="any" required value={location?.longitude ?? undefined} onChange={(e) => setLocation({ latitude: location?.latitude ?? 0, longitude: Number(e.target.value) })} placeholder="78.4867" /></label>
        </div>
        <label className="check-row"><input name="anonymous_public" type="checkbox" defaultChecked value="true" /> Show this report anonymously on the public portal</label>
        {error && <div className="error"><AlertCircle size={18} />{error}</div>}
        <button className="button primary submit" disabled={submitting}>{submitting ? <><LoaderCircle className="spin" size={18} /> Analyzing evidence…</> : <><MapPin size={18} /> Submit report</>}</button>
        <p className="form-note">AI recommendations are advisory and reviewed by authorized officers. Submission here is to CivicOS AI, not an official government integration.</p>
      </form>
    </section>
  );
}

