# Demo script, pitch, limitations, and roadmap

## Synthetic data

On an empty database the API creates three records whose summaries begin with `[Synthetic demo data]`. These exist only to make charts and the map useful before a live report. All displayed metrics are computed from stored rows; none are hardcoded in the frontend.

## Hackathon demo script

1. Open the public homepage and frame the problem: fragmented reports hide systemic infrastructure failures.
2. Choose “Report an issue,” upload a road photo, capture GPS, and describe a large pothole near a school.
3. Submit and show the tracking ID, transparent score, routing explanation, and explicit model limitation/human-review message.
4. Submit a second nearby pothole report and show that it joins the same incident while preserving its own report and evidence.
5. Open the officer command center and show the priority-ranked queue, shared report count, and role-protected API.
6. Update status through the API docs, including the required reason, then refresh tracking to show the immutable timeline.
7. Open the public dashboard and show computed totals, category distribution, and deliberately rounded map locations.

## Five-minute pitch

- 0:00–0:40 — Infrastructure failures are reported as isolated complaints; cities need evidence organized into incidents.
- 0:40–1:20 — A multilingual, low-friction citizen report preserves the original voice and location.
- 1:20–2:10 — CivicOS explains urgency, detects likely duplicates, and routes work without claiming AI certainty.
- 2:10–3:10 — Officers retain control, every transition and override is auditable, and repair evidence can be reviewed.
- 3:10–4:10 — The public portal makes service delivery measurable without exposing people or home coordinates.
- 4:10–5:00 — The architecture is deployable now and grows into municipal integrations, calibrated vision, predictive maintenance, and cross-city infrastructure intelligence.

## Current limitations

- No specialized weights ship in the repository, so object detection correctly falls back to image-quality checks and human review.
- Voice transcription, text-to-speech, notification providers, Celery workers, before/after alignment, and municipal ticket integrations are extension points rather than completed primary-path features.
- The MVP duplicate matcher is lexical and distance-based; it needs multilingual embeddings and image similarity for production recall.
- Jurisdiction routing uses category capabilities and explains that boundary confirmation is pending.
- Local file storage is for demonstration only. Production requires private object storage, retention rules, and evidence access logs.
- Predictive intelligence is not displayed because the seed dataset is insufficient. Any future synthetic forecast must be visibly labeled experimental.

## Roadmap

1. Add official ward polygons, PostGIS `ST_DWithin`, boundary-aware routing, and department directories.
2. Train/evaluate category-specific vision models with diverse Indian road and monsoon conditions; publish per-class validation metrics.
3. Add OpenAI structured extraction with prompt-injection isolation, source text grounding, and officer correction capture.
4. Implement voice input, offline queueing, client image compression, SMS tracking, and full Telugu/Hindi interface localization.
5. Add merge/unmerge tooling, before/after review, citizen feedback, reopen workflow, SLA escalation, and event-driven notifications.
6. Add calibrated hotspot forecasting only after sufficient historical data, provenance, drift monitoring, and fairness review.
7. Complete security threat modeling, DPIA, retention enforcement, penetration testing, and WCAG 2.2 AA audit.

