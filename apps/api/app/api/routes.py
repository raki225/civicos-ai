import secrets
from datetime import datetime, timezone
from statistics import median

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import Principal, Role, current_principal, require_roles
from app.core.database import get_db
from app.models import AIAnalysis, Assignment, AuditLog, Evidence, Incident, IncidentReport, Report, ReportStatus, StatusHistory
from app.schemas import IncidentListItem, PublicMetrics, ReportCreated, StatusUpdate, TimelineEntry, TrackingView
from app.services.duplicate import find_duplicate
from app.services.language import detect_language, safe_summary
from app.services.priority import calculate_priority
from app.services.routing import route_report
from app.services.storage import persist_upload
from app.services.vision import inspect_image


router = APIRouter()
OFFICER_ROLES = (Role.OFFICER, Role.DEPARTMENT_ADMIN, Role.SYSTEM_ADMIN)


def code(prefix: str) -> str:
    return f"{prefix}-{datetime.now(timezone.utc):%y%m%d}-{secrets.token_hex(3).upper()}"


@router.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "civicos-api"}


@router.post("/reports", response_model=ReportCreated, status_code=201)
async def create_report(
    category: str = Form(...),
    description: str = Form(..., min_length=8, max_length=4000),
    latitude: float = Form(..., ge=-90, le=90),
    longitude: float = Form(..., ge=-180, le=180),
    language: str | None = Form(default=None),
    anonymous_public: bool = Form(default=True),
    photo: UploadFile | None = File(default=None),
    principal: Principal = Depends(current_principal),
    db: Session = Depends(get_db),
) -> ReportCreated:
    allowed_categories = {"pothole", "road_damage", "garbage", "water_leakage", "drainage", "streetlight", "other"}
    if category not in allowed_categories:
        raise HTTPException(status_code=422, detail="Unsupported category")

    detected_language = detect_language(description, language)
    summary = safe_summary(category, description, detected_language)
    duplicate, duplicate_score = find_duplicate(db, category, description, latitude, longitude)
    tracking_id = code("CVR")
    vision = None
    evidence_confidence = 0.35
    upload_record = None
    content = None
    if photo:
        content, upload_record = await persist_upload(photo, tracking_id)
        vision = inspect_image(content, category)
        evidence_confidence = vision.confidence if vision.status == "analyzed" else (0.55 if vision.image_quality.get("sufficient_resolution") else 0.3)

    if duplicate:
        incident = duplicate
        existing_count = db.scalar(select(func.count()).select_from(Report).where(Report.incident_id == incident.id)) or 0
    else:
        existing_count = 0

    priority = calculate_priority(category, description, existing_count, evidence_confidence)
    department, routing = route_report(db, category)

    if not duplicate:
        incident = Incident(
            public_id=code("CVI"), category=category, title=f"{category.replace('_', ' ').title()} incident",
            summary=summary, latitude=latitude, longitude=longitude,
            public_latitude=round(latitude, 3), public_longitude=round(longitude, 3),
            priority_score=priority.score, priority_label=priority.category,
            department_id=department.id if department else None,
        )
        db.add(incident)
        db.flush()
        db.add(StatusHistory(incident_id=incident.id, from_status=None, to_status=ReportStatus.SUBMITTED.value, reason="Citizen report received", changed_by=principal.user_id))
        if department:
            db.add(Assignment(incident_id=incident.id, department_id=department.id, reason=routing.explanation))
    else:
        incident.priority_score = max(incident.priority_score, priority.score)
        incident.priority_label = "critical" if incident.priority_score >= 80 else "high" if incident.priority_score >= 60 else "medium" if incident.priority_score >= 35 else "low"

    report = Report(
        tracking_id=tracking_id, reporter_id=principal.user_id, incident_id=incident.id, category=category,
        description_original=description, language=detected_language, latitude=latitude, longitude=longitude,
        anonymous_public=anonymous_public,
    )
    db.add(report)
    db.flush()
    db.add(IncidentReport(incident_id=incident.id, report_id=report.id, match_score=round(duplicate_score, 3) if duplicate else 1.0))

    if upload_record:
        db.add(Evidence(report_id=report.id, kind="photo", **upload_record))
        db.add(AIAnalysis(
            report_id=report.id, analysis_type="visual_inspection", model_name=vision.model_name,
            confidence=vision.confidence, result=vision.model_dump(), requires_human_review=vision.requires_human_review,
        ))
    db.add(AIAnalysis(
        report_id=report.id, analysis_type="priority", model_name="civicos-explainable-priority-v1",
        confidence=priority.confidence, result=priority.model_dump(), requires_human_review=True,
    ))
    db.add(AuditLog(actor_id=principal.user_id, action="report.created", entity_type="report", entity_id=report.id, metadata_json={"tracking_id": tracking_id, "duplicate": bool(duplicate)}))
    db.commit()
    return ReportCreated(
        tracking_id=tracking_id, incident_id=incident.id, incident_public_id=incident.public_id,
        duplicate_of=incident.public_id if duplicate else None, summary=summary, priority=priority,
        routing=routing, vision=vision, status=incident.status,
    )


@router.get("/reports/{tracking_id}", response_model=TrackingView)
def track_report(tracking_id: str, db: Session = Depends(get_db)) -> TrackingView:
    report = db.scalar(select(Report).where(Report.tracking_id == tracking_id.upper()))
    if not report:
        raise HTTPException(status_code=404, detail="Tracking ID not found")
    incident = report.incident
    history = db.scalars(select(StatusHistory).where(StatusHistory.incident_id == incident.id).order_by(StatusHistory.created_at)).all()
    return TrackingView(
        tracking_id=report.tracking_id, incident_public_id=incident.public_id, category=incident.category,
        summary=incident.summary, status=incident.status, priority_label=incident.priority_label,
        created_at=report.created_at,
        timeline=[TimelineEntry(status=item.to_status, reason=item.reason, at=item.created_at) for item in history],
    )


@router.get("/officer/incidents", response_model=list[IncidentListItem])
def officer_incidents(
    _: Principal = Depends(require_roles(*OFFICER_ROLES)),
    db: Session = Depends(get_db),
) -> list[IncidentListItem]:
    incidents = db.scalars(select(Incident).order_by(Incident.priority_score.desc(), Incident.created_at.asc())).all()
    return [IncidentListItem(
        public_id=item.public_id, category=item.category, title=item.title, summary=item.summary,
        status=item.status, priority_score=item.priority_score, priority_label=item.priority_label,
        report_count=len(item.reports), latitude=item.latitude, longitude=item.longitude, created_at=item.created_at,
    ) for item in incidents]


@router.patch("/officer/incidents/{public_id}/status")
def update_status(
    public_id: str,
    payload: StatusUpdate,
    principal: Principal = Depends(require_roles(*OFFICER_ROLES)),
    db: Session = Depends(get_db),
) -> dict:
    incident = db.scalar(select(Incident).where(Incident.public_id == public_id))
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    old = incident.status
    incident.status = payload.status
    incident.updated_at = datetime.now(timezone.utc)
    if payload.status == ReportStatus.RESOLVED:
        incident.resolved_at = datetime.now(timezone.utc)
    if payload.override_priority is not None:
        if not payload.override_reason:
            raise HTTPException(status_code=422, detail="A documented reason is required for priority overrides")
        incident.priority_score = payload.override_priority
        incident.priority_label = "critical" if payload.override_priority >= 80 else "high" if payload.override_priority >= 60 else "medium" if payload.override_priority >= 35 else "low"
    db.add(StatusHistory(incident_id=incident.id, from_status=old.value, to_status=payload.status.value, reason=payload.reason, changed_by=principal.user_id))
    db.add(AuditLog(actor_id=principal.user_id, action="incident.status_changed", entity_type="incident", entity_id=incident.id, metadata_json=payload.model_dump(mode="json")))
    db.commit()
    return {"public_id": public_id, "status": incident.status, "priority_score": incident.priority_score}


@router.get("/public/metrics", response_model=PublicMetrics)
def public_metrics(db: Session = Depends(get_db)) -> PublicMetrics:
    incidents = db.scalars(select(Incident)).all()
    total_reports = db.scalar(select(func.count()).select_from(Report)) or 0
    resolved = [item for item in incidents if item.status == ReportStatus.RESOLVED]
    resolution_hours = [
        (item.resolved_at - item.created_at).total_seconds() / 3600
        for item in resolved if item.resolved_at and item.created_at
    ]
    categories: dict[str, int] = {}
    statuses: dict[str, int] = {}
    for item in incidents:
        categories[item.category] = categories.get(item.category, 0) + 1
        statuses[item.status.value] = statuses.get(item.status.value, 0) + 1
    return PublicMetrics(
        total_reports=total_reports,
        open_incidents=len(incidents) - len(resolved),
        resolved_incidents=len(resolved),
        median_resolution_hours=round(median(resolution_hours), 1) if resolution_hours else None,
        reopened_cases=statuses.get(ReportStatus.REOPENED.value, 0),
        category_distribution=categories,
        status_distribution=statuses,
        map_incidents=[{
            "public_id": item.public_id, "category": item.category, "status": item.status.value,
            "priority": item.priority_label, "latitude": item.public_latitude,
            "longitude": item.public_longitude, "created_at": item.created_at.isoformat(),
        } for item in incidents],
        data_note="Coordinates are deliberately rounded and citizen identity and media are excluded. Demo seed records are synthetic.",
    )

