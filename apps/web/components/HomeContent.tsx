"use client";

import Link from "next/link";
import { ArrowRight, Camera, CheckCircle2, CircleCheck, Languages, MapPinned, Mic2, Radio, ShieldCheck, Sparkles, SunMoon } from "lucide-react";
import type { PublicMetrics } from "@/lib/api";
import { usePreferences } from "@/components/PreferencesProvider";

export function HomeContent({ metrics }: { metrics: PublicMetrics | null }) {
  const { t, labelFor } = usePreferences();
  return (
    <>
      <section className="hero container">
        <div className="hero-copy-block">
          <div className="eyebrow"><Radio size={14} /> {t("home.eyebrow")}</div>
          <h1>{t("home.title")} <span>{t("home.titleAccent")}</span></h1>
          <p className="hero-copy">{t("home.description")}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/report"><Camera size={18} /> {t("home.report")}</Link>
            <Link className="button secondary" href="/public-dashboard">{t("home.explore")} <ArrowRight size={18} /></Link>
          </div>
          <div className="trust-row">
            <span><ShieldCheck /> {t("home.privacy")}</span>
            <span><CheckCircle2 /> {t("home.human")}</span>
            <span><Sparkles /> {t("home.explainable")}</span>
          </div>
        </div>

        <div className="hero-visual" aria-label={t("home.previewTitle")}>
          <div className="preview-glow" />
          <article className="intelligence-card">
            <header>
              <div><span className="mini-eyebrow">{t("home.previewEyebrow")}</span><h2>{t("home.previewTitle")}</h2></div>
              <span className="live-indicator"><i /> {t("common.live")}</span>
            </header>
            <div className="attention-card">
              <div className="attention-score"><strong>76</strong><span>/100</span></div>
              <div><span className="badge badge-high">{t("home.previewPriority")}</span><h3>{t("home.previewIssue")}</h3><p><MapPinned size={14} /> {t("home.previewLocation")}</p></div>
            </div>
            <div className="preview-timeline">
              <div className="done"><span><CircleCheck size={17} /></span><div><strong>{t("home.previewReceived")}</strong><small>09:42</small></div></div>
              <div className="active"><span><Sparkles size={17} /></span><div><strong>{t("home.previewStatus")}</strong><small>{labelFor("in_progress")}</small></div></div>
            </div>
          </article>
          <div className="voice-float"><span><Mic2 size={18} /></span><div><strong>{t("home.previewVoice")}</strong><small>English · हिन्दी · తెలుగు</small></div></div>
        </div>
      </section>

      <section className="metric-strip container" aria-label="Public metrics">
        <div><strong>{metrics?.total_reports ?? "—"}</strong><span>{t("home.metricReports")}</span></div>
        <div><strong>{metrics?.open_incidents ?? "—"}</strong><span>{t("home.metricOpen")}</span></div>
        <div><strong>{metrics?.resolved_incidents ?? "—"}</strong><span>{t("home.metricResolved")}</span></div>
        <div><strong>{metrics?.median_resolution_hours ? `${metrics.median_resolution_hours}h` : "—"}</strong><span>{t("home.metricMedian")}</span></div>
      </section>

      <section className="section container two-column">
        <div>
          <div className="eyebrow">{t("home.recordEyebrow")}</div>
          <h2>{t("home.recordTitle")}</h2>
          <p>{t("home.recordCopy")}</p>
        </div>
        <div className="steps">
          <article><span>01</span><Camera /><div><h3>{t("home.captureTitle")}</h3><p>{t("home.captureCopy")}</p></div></article>
          <article><span>02</span><Sparkles /><div><h3>{t("home.understandTitle")}</h3><p>{t("home.understandCopy")}</p></div></article>
          <article><span>03</span><MapPinned /><div><h3>{t("home.resolveTitle")}</h3><p>{t("home.resolveCopy")}</p></div></article>
        </div>
      </section>

      <section className="experience-section">
        <div className="container">
          <div className="section-heading centered">
            <div className="eyebrow">{t("home.accessEyebrow")}</div>
            <h2>{t("home.accessTitle")}</h2>
            <p>{t("home.accessCopy")}</p>
          </div>
          <div className="experience-grid">
            <article><span className="feature-icon"><Languages /></span><h3>{t("home.languageTitle")}</h3><p>{t("home.languageCopy")}</p></article>
            <article className="feature-accent"><span className="feature-icon"><Mic2 /></span><h3>{t("home.voiceTitle")}</h3><p>{t("home.voiceCopy")}</p></article>
            <article><span className="feature-icon"><SunMoon /></span><h3>{t("home.themeTitle")}</h3><p>{t("home.themeCopy")}</p></article>
          </div>
        </div>
      </section>
    </>
  );
}
