# CivicOS AI architecture and implementation plan

## Architecture

```text
Citizen / Public / Officer clients
            │
      Next.js web app
            │ HTTPS + typed JSON/multipart
      FastAPI application
       ├── authentication + RBAC (Firebase ID tokens in production)
       ├── report orchestration
       ├── explainable priority engine
       ├── duplicate matcher
       ├── department routing
       ├── vision adapter
       └── audit + notification events
          │        │          │
   PostgreSQL   Object       Background workers
   + PostGIS    storage      (Celery/Redis extension)
```

The API is the authorization boundary. The web interface never decides access rights. Production mode requires a verified Firebase ID token and maps its custom `role` claim to citizen, municipal officer, department administrator, system administrator, or public viewer.

## Core user journeys

1. A citizen captures a compressed photo, grants GPS or enters a location, selects a category, and describes the problem in English, Telugu, or Hindi.
2. The API preserves the original text, validates and stores evidence, checks image quality, looks for likely nearby duplicates, creates or joins an incident, computes an explainable priority, and recommends a department.
3. The citizen receives a unique tracking ID and can follow status history without exposing identity.
4. An officer opens the priority queue, reviews evidence and uncertainty, assigns work, documents transitions, and may override priority only with a reason.
5. Public viewers see aggregated stored metrics and rounded locations. They never receive reporter identity, precise coordinates, or private evidence.

## Data model

The schema is normalized around reports (individual citizen submissions) and incidents (shared operational problems). `incident_reports` preserves explicit merge provenance. Evidence and AI analyses are append-oriented records. Assignment, status history, verification review, notifications, and audit logs preserve accountability.

PostgreSQL deployments add a PostGIS `geography(Point, 4326)` column and GiST index through migration `0001_initial`. Latitude and longitude remain explicit for portable local tests. Jurisdiction boundaries are represented as GeoJSON in the MVP and should move to PostGIS multipolygons when official ward boundary data is licensed.

## Priority engine

The initial score is deterministic, explainable, and bounded from 0–100. It combines a category hazard baseline, explicit risk phrases in the citizen description, duplicate volume, and evidence confidence. The response separates estimated factors from verified facts and always recommends human triage. Future calibrated models can be introduced behind the same contract and evaluated against officer outcomes.

## Duplicate detection

The executable MVP uses category, Haversine proximity, submission recency, and token overlap. Production evolution adds PostGIS `ST_DWithin`, multilingual embeddings, perceptual image hashes, and a review threshold band. Reports are never deleted during merge; officers can later merge or unmerge the association.

## Vision

Image quality analysis is always available. Object detection runs only when `CIVICOS_YOLO_WEIGHTS` points to specialized, validated infrastructure weights and the optional `ultralytics` package is installed. Generic COCO weights are not presented as a pothole detector. Missing or failed inference returns a structured human-review result.

## Phased execution

- Phase 1 — complete here: architecture, core journeys, normalized schema, migrations, premium UI system.
- Phase 2 — complete for the MVP slice: photo reporting, storage abstraction, APIs, demo auth plus production Firebase verifier.
- Phase 3 — functional: language preservation/detection, deterministic summary, priority scoring, vision adapter. OpenAI structured multilingual generation and validated model weights require credentials/assets.
- Phase 4 — functional foundation: officer queue, public map, tracking. Detail editing, merge/unmerge UI, and before/after review are next.
- Phase 5 — started: automated API tests, containers, synthetic seed, deployment and demo documents. Load, accessibility, and end-to-end browser suites remain before production.

## UI design system

The interface uses deep navy for institutional trust, teal for civic action and confirmation, restrained amber for attention, and neutral off-white surfaces. Manrope carries high-information headings and Inter carries body text. Components meet visible focus requirements, support reduced motion, and use responsive layouts at 900 px and 600 px breakpoints. A production accessibility pass should validate WCAG 2.2 AA with axe and manual keyboard/screen-reader testing.

