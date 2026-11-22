# CivicOS AI

CivicOS AI is a production-minded civic infrastructure reporting and incident-triage platform. This repository contains an executable hackathon MVP: citizen reporting, explainable priority scoring, duplicate detection, department routing, role-protected officer workflows, status tracking, and privacy-safe public analytics.

The system is deliberately honest about external dependencies. Local demo authentication is clearly marked, government submission is never simulated as official, and computer-vision results require explicitly configured specialized model weights. Without those weights, evidence is accepted and flagged for human review.

## Quick start with Docker

1. Copy `.env.example` to `.env`.
2. Run `docker compose up --build`.
3. Open `http://localhost:3000` and the API docs at `http://localhost:8000/docs`.

The database is seeded with synthetic incidents for the public dashboard. Submitted reports are stored normally and all metrics are computed from database records.

## Local development

### API

```powershell
cd apps/api
python -m venv .venv
.venv/Scripts/Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

For a no-PostgreSQL smoke test, set `CIVICOS_DATABASE_URL=sqlite:///./civicos.db`. PostgreSQL/PostGIS remains the production target.

### Web

```powershell
cd apps/web
pnpm install
pnpm run dev
```

## Verification

```powershell
cd apps/api
pytest

cd ../web
pnpm run build
```

See [architecture](docs/ARCHITECTURE.md), [API and security](docs/API.md), and the [demo and roadmap](docs/DEMO.md).

# civicos-ai
