from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Incident, Report, ReportStatus, StatusHistory


SYNTHETIC = [
    ("CVI-DEMO-001", "pothole", "Large pothole near the bus corridor", 17.385, 78.486, 76, "high", ReportStatus.IN_PROGRESS),
    ("CVI-DEMO-002", "water_leakage", "Visible water leakage near the market", 17.393, 78.473, 58, "medium", ReportStatus.ASSIGNED),
    ("CVI-DEMO-003", "garbage", "Garbage accumulation beside a public road", 17.402, 78.491, 44, "medium", ReportStatus.RESOLVED),
]


def seed_demo(db: Session) -> None:
    if (db.scalar(select(func.count()).select_from(Incident)) or 0) > 0:
        return
    now = datetime.now(timezone.utc)
    for index, (public_id, category, summary, lat, lng, score, label, status) in enumerate(SYNTHETIC):
        created = now - timedelta(days=4 - index)
        incident = Incident(
            public_id=public_id, category=category, title=f"{category.replace('_', ' ').title()} incident",
            summary=f"[Synthetic demo data] {summary}", latitude=lat, longitude=lng,
            public_latitude=round(lat, 3), public_longitude=round(lng, 3), priority_score=score,
            priority_label=label, status=status, created_at=created,
            resolved_at=created + timedelta(hours=31) if status == ReportStatus.RESOLVED else None,
        )
        db.add(incident)
        db.flush()
        report = Report(
            tracking_id=f"CVR-DEMO-00{index + 1}", reporter_id="synthetic-seed", incident_id=incident.id,
            category=category, description_original=summary, language="en", latitude=lat, longitude=lng,
            anonymous_public=True, created_at=created,
        )
        db.add(report)
        db.add(StatusHistory(incident_id=incident.id, from_status=None, to_status=ReportStatus.SUBMITTED.value, reason="Synthetic demo report created", changed_by="system"))
        if status != ReportStatus.SUBMITTED:
            db.add(StatusHistory(incident_id=incident.id, from_status=ReportStatus.SUBMITTED.value, to_status=status.value, reason="Synthetic workflow progression", changed_by="system"))
    db.commit()

