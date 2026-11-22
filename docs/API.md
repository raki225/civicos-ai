# API, authorization, and operations

Interactive OpenAPI documentation is available at `/docs`.

## Primary endpoints

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/health` | Public | Service health |
| POST | `/api/v1/reports` | Citizen+ | Multipart report submission |
| GET | `/api/v1/reports/{tracking_id}` | Tracking ID holder | Privacy-safe timeline |
| GET | `/api/v1/officer/incidents` | Officer/admin | Priority queue |
| PATCH | `/api/v1/officer/incidents/{public_id}/status` | Officer/admin | Audited workflow transition and optional override |
| GET | `/api/v1/public/metrics` | Public | Aggregated stored metrics and rounded map points |

## Credentials and dependencies

- Production authentication: Firebase project plus Application Default Credentials.
- Production data: PostgreSQL 16 with PostGIS 3.4.
- Evidence: local disk in the demo; replace the storage adapter with S3/Firebase Storage and signed URLs for deployment.
- Vision: specialized, validated YOLO weights supplied through `CIVICOS_YOLO_WEIGHTS`; install `ultralytics` in the inference image.
- Multilingual generation: `OPENAI_API_KEY` is reserved for a structured-output adapter; the executable MVP never invents missing details and uses deterministic preservation-first summaries.

## Security controls

Uploads use an allowlist, byte cap, content decoding, non-user filenames, and SHA-256 hashes. Production should add malware scanning, image metadata stripping, storage quarantine, and signed access. Role checks execute in API dependencies. All sensitive mutations create audit rows. CORS is explicit. Add a Redis-backed rate limiter at the ingress before a public launch.

Demo authentication is enabled only outside production and uses `X-Demo-Role`. Setting `CIVICOS_ENV=production` disables it regardless of the header and requires a Firebase bearer token.

## Status workflow

Normal progression is Submitted → Under Review → Assigned → In Progress → Verification Pending → Resolved. Rejected, Duplicate, and Reopened are recorded with reasons. The MVP currently requires a reason for every transition; production should add a transition policy matrix and department-specific SLA timers.

## Deployment

Build the web image for Vercel or a Node container. Run the API container on Cloud Run, Fly.io, Render, or Kubernetes with a managed PostGIS database. Store evidence in regional object storage, place Redis/Celery beside the API for inference and notification jobs, use HTTPS throughout, and configure secrets only through the hosting provider. Run `alembic upgrade head` as a release job before API rollout.

