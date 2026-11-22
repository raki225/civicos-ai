"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, ChevronRight, Crosshair, FileImage, LoaderCircle, MapPin, UploadCloud, Volume2 } from "lucide-react";
import { API_URL } from "@/lib/api";
import { Language, languageOptions, usePreferences } from "@/components/PreferencesProvider";
import { VoiceInputButton } from "@/components/VoiceInputButton";

type Result = {
  tracking_id: string;
  incident_public_id: string;
  duplicate_of: string | null;
  summary: string;
  priority: { score: number; category: string; explanation: string; contributing_factors: string[] };
  routing: { department_name: string | null; explanation: string };
  vision: { status: string; limitation?: string } | null;
};

const categories = ["pothole", "road_damage", "garbage", "water_leakage", "drainage", "streetlight", "other"];

export default function ReportPage() {
  const { language, t, labelFor, speak } = usePreferences();
  const [coordinates, setCoordinates] = useState({ latitude: "", longitude: "" });
  const [reportLanguage, setReportLanguage] = useState<Language>(language);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [anonymousPublic, setAnonymousPublic] = useState(true);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => setReportLanguage(language), [language]);

  function locate() {
    setLocating(true);
    setError("");
    if (!("geolocation" in navigator)) {
      setError(t("report.locationError"));
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({ latitude: position.coords.latitude.toFixed(6), longitude: position.coords.longitude.toFixed(6) });
        setLocating(false);
      },
      () => { setError(t("report.locationError")); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    form.set("anonymous_public", String(anonymousPublic));
    try {
      const response = await fetch(`${API_URL}/reports`, { method: "POST", body: form, headers: { "X-Demo-Role": "citizen" } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail ?? t("report.submitError"));
      setResult(payload);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t("report.submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetReport() {
    setResult(null);
    setCoordinates({ latitude: "", longitude: "" });
    setDescription("");
    setSelectedFile("");
    setCopied(false);
    setError("");
  }

  async function copyTrackingId() {
    if (!result) return;
    await navigator.clipboard.writeText(result.tracking_id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (result) {
    return (
      <section className="page container narrow success-page">
        <div className="success-mark"><Check size={34} /></div>
        <div className="centered"><div className="eyebrow">{t("report.successEyebrow")}</div><h1>{t("report.successTitle")}</h1><p>{t("report.successCopy")}</p></div>
        <div className="tracking-card"><div><span>{t("report.trackingId")}</span><strong>{result.tracking_id}</strong></div><button onClick={copyTrackingId}>{copied ? t("common.copied") : t("common.copy")}</button></div>
        <div className="analysis-card">
          <div className="score-ring"><strong>{result.priority.score}</strong><span>/ 100</span></div>
          <div><span className={`badge badge-${result.priority.category}`}>{labelFor(result.priority.category)} {t("report.priority")}</span><h2>{result.summary}</h2><p>{result.priority.explanation}</p></div>
        </div>
        {result.duplicate_of && <div className="notice"><AlertCircle size={18} /><span>{t("report.duplicate", { id: result.duplicate_of })}</span></div>}
        {result.vision?.limitation && <div className="notice neutral"><AlertCircle size={18} /><span>{result.vision.limitation}</span></div>}
        <div className="hero-actions centered-actions">
          <Link className="button primary" href={`/track?id=${result.tracking_id}`}>{t("report.track")} <ChevronRight size={18} /></Link>
          <button className="button secondary" onClick={() => speak(`${result.summary}. ${result.priority.explanation}`)}><Volume2 size={18} /> {t("report.listenSummary")}</button>
          <button className="button quiet" onClick={resetReport}>{t("report.another")}</button>
        </div>
      </section>
    );
  }

  return (
    <section className="page container report-layout">
      <aside className="page-heading report-intro"><div className="eyebrow">{t("report.eyebrow")}</div><h1>{t("report.title")}</h1><p>{t("report.intro")}</p><div className="report-assurance"><span><Check size={15} /> {t("home.privacy")}</span><span><Check size={15} /> {t("home.human")}</span></div></aside>
      <form className="form-card" onSubmit={submit}>
        <div className="form-section"><span className="form-step">1</span><div><h2>{t("report.step1Title")}</h2><p>{t("report.step1Copy")}</p></div></div>
        <label className={`upload-zone${selectedFile ? " has-file" : ""}`}>
          {selectedFile ? <FileImage size={28} /> : <UploadCloud size={28} />}
          <strong>{selectedFile || t("report.upload")}</strong>
          <span>{selectedFile ? t("report.selected") : t("report.uploadHint")}</span>
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setSelectedFile(event.target.files?.[0]?.name ?? "")} />
        </label>

        <div className="form-section"><span className="form-step">2</span><div><h2>{t("report.step2Title")}</h2><p>{t("report.step2Copy")}</p></div></div>
        <div className="field-row">
          <label>{t("report.category")}<select name="category" required defaultValue=""><option value="" disabled>{t("report.selectIssue")}</option>{categories.map((category) => <option value={category} key={category}>{labelFor(category)}</option>)}</select></label>
          <label>{t("report.language")}<select name="language" value={reportLanguage} onChange={(event) => setReportLanguage(event.target.value as Language)}>{languageOptions.map((option) => <option value={option.code} key={option.code}>{option.label}</option>)}</select></label>
        </div>
        <div className="field-group">
          <div className="field-label-row"><label htmlFor="report-description">{t("report.description")}</label><VoiceInputButton onTranscript={(transcript) => setDescription((current) => `${current}${current ? " " : ""}${transcript}`)} /></div>
          <textarea id="report-description" name="description" required minLength={8} maxLength={4000} rows={6} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={t("report.placeholder")} />
          <div className="field-help"><span>{t("report.voiceHint")}</span><span>{description.length}/4000</span></div>
        </div>

        <div className="form-section"><span className="form-step">3</span><div><h2>{t("report.step3Title")}</h2><p>{t("report.step3Copy")}</p></div></div>
        <button type="button" className="location-button" onClick={locate} disabled={locating}><Crosshair size={19} />{locating ? t("report.locating") : coordinates.latitude ? t("report.locationCaptured") : t("report.useLocation")}{coordinates.latitude && <Check size={18} />}</button>
        <div className="coordinate-row">
          <label>{t("report.latitude")}<input name="latitude" type="number" step="any" min="-90" max="90" required value={coordinates.latitude} onChange={(event) => setCoordinates((current) => ({ ...current, latitude: event.target.value }))} placeholder="17.3850" /></label>
          <label>{t("report.longitude")}<input name="longitude" type="number" step="any" min="-180" max="180" required value={coordinates.longitude} onChange={(event) => setCoordinates((current) => ({ ...current, longitude: event.target.value }))} placeholder="78.4867" /></label>
        </div>
        <label className="check-row"><input type="checkbox" checked={anonymousPublic} onChange={(event) => setAnonymousPublic(event.target.checked)} /> {t("report.anonymous")}</label>
        {error && <div className="error" role="alert"><AlertCircle size={18} />{error}</div>}
        <button className="button primary submit" disabled={submitting}>{submitting ? <><LoaderCircle className="spin" size={18} /> {t("report.analyzing")}</> : <><MapPin size={18} /> {t("report.submit")}</>}</button>
        <p className="form-note">{t("report.note")}</p>
      </form>
    </section>
  );
}
