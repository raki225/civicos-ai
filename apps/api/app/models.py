import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, Enum, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def uid() -> str:
    return str(uuid.uuid4())


class ReportStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    VERIFICATION_PENDING = "verification_pending"
    RESOLVED = "resolved"
    REJECTED = "rejected"
    DUPLICATE = "duplicate"
    REOPENED = "reopened"


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    display_name: Mapped[str | None] = mapped_column(String(120))
    preferred_language: Mapped[str] = mapped_column(String(8), default="en")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class RoleModel(Base):
    __tablename__ = "roles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(40), unique=True)


class UserRole(Base):
    __tablename__ = "user_roles"
    __table_args__ = (UniqueConstraint("user_id", "role_id"),)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), primary_key=True)


class Jurisdiction(Base):
    __tablename__ = "jurisdictions"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    name: Mapped[str] = mapped_column(String(160))
    code: Mapped[str] = mapped_column(String(40), unique=True)
    boundary_geojson: Mapped[dict | None] = mapped_column(JSON)


class Department(Base):
    __tablename__ = "departments"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    name: Mapped[str] = mapped_column(String(160), index=True)
    code: Mapped[str] = mapped_column(String(40), unique=True)
    categories: Mapped[list] = mapped_column(JSON, default=list)
    jurisdiction_id: Mapped[str | None] = mapped_column(ForeignKey("jurisdictions.id"))
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class Incident(Base):
    __tablename__ = "incidents"
    __table_args__ = (
        Index("ix_incidents_status_priority", "status", "priority_score"),
        Index("ix_incidents_lat_lng", "latitude", "longitude"),
    )
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    public_id: Mapped[str] = mapped_column(String(24), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(50), index=True)
    title: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str] = mapped_column(Text)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    public_latitude: Mapped[float] = mapped_column(Float)
    public_longitude: Mapped[float] = mapped_column(Float)
    status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus), default=ReportStatus.SUBMITTED)
    priority_score: Mapped[int] = mapped_column(Integer)
    priority_label: Mapped[str] = mapped_column(String(20))
    department_id: Mapped[str | None] = mapped_column(ForeignKey("departments.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    reports: Mapped[list["Report"]] = relationship(back_populates="incident")


class Report(Base):
    __tablename__ = "reports"
    __table_args__ = (Index("ix_reports_created_category", "created_at", "category"),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    tracking_id: Mapped[str] = mapped_column(String(24), unique=True, index=True)
    reporter_id: Mapped[str | None] = mapped_column(String(64), index=True)
    incident_id: Mapped[str] = mapped_column(ForeignKey("incidents.id"), index=True)
    category: Mapped[str] = mapped_column(String(50))
    description_original: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(8), default="en")
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    anonymous_public: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    incident: Mapped[Incident] = relationship(back_populates="reports")
    evidence: Mapped[list["Evidence"]] = relationship(back_populates="report")


class IncidentReport(Base):
    __tablename__ = "incident_reports"
    incident_id: Mapped[str] = mapped_column(ForeignKey("incidents.id"), primary_key=True)
    report_id: Mapped[str] = mapped_column(ForeignKey("reports.id"), primary_key=True)
    match_score: Mapped[float] = mapped_column(Float, default=1.0)
    merged_by: Mapped[str | None] = mapped_column(String(64))


class Evidence(Base):
    __tablename__ = "evidence"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    report_id: Mapped[str] = mapped_column(ForeignKey("reports.id"), index=True)
    kind: Mapped[str] = mapped_column(String(20))
    storage_key: Mapped[str] = mapped_column(String(500))
    mime_type: Mapped[str] = mapped_column(String(100))
    sha256: Mapped[str] = mapped_column(String(64), index=True)
    byte_size: Mapped[int] = mapped_column(Integer)
    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    captured_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    report: Mapped[Report] = relationship(back_populates="evidence")


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    report_id: Mapped[str] = mapped_column(ForeignKey("reports.id"), index=True)
    analysis_type: Mapped[str] = mapped_column(String(40))
    model_name: Mapped[str] = mapped_column(String(120))
    model_version: Mapped[str | None] = mapped_column(String(60))
    confidence: Mapped[float] = mapped_column(Float)
    result: Mapped[dict] = mapped_column(JSON)
    requires_human_review: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Assignment(Base):
    __tablename__ = "assignments"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    incident_id: Mapped[str] = mapped_column(ForeignKey("incidents.id"), index=True)
    department_id: Mapped[str] = mapped_column(ForeignKey("departments.id"))
    officer_id: Mapped[str | None] = mapped_column(String(64))
    reason: Mapped[str] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class StatusHistory(Base):
    __tablename__ = "status_history"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    incident_id: Mapped[str] = mapped_column(ForeignKey("incidents.id"), index=True)
    from_status: Mapped[str | None] = mapped_column(String(40))
    to_status: Mapped[str] = mapped_column(String(40))
    reason: Mapped[str] = mapped_column(Text)
    changed_by: Mapped[str] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class VerificationReview(Base):
    __tablename__ = "verification_reviews"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    incident_id: Mapped[str] = mapped_column(ForeignKey("incidents.id"), index=True)
    before_evidence_id: Mapped[str | None] = mapped_column(ForeignKey("evidence.id"))
    after_evidence_id: Mapped[str | None] = mapped_column(ForeignKey("evidence.id"))
    ai_assessment: Mapped[dict | None] = mapped_column(JSON)
    decision: Mapped[str] = mapped_column(String(30), default="pending")
    reviewed_by: Mapped[str | None] = mapped_column(String(64))
    review_note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    event_type: Mapped[str] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(String(180))
    body: Mapped[str] = mapped_column(Text)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    actor_id: Mapped[str] = mapped_column(String(64), index=True)
    action: Mapped[str] = mapped_column(String(100), index=True)
    entity_type: Mapped[str] = mapped_column(String(50))
    entity_id: Mapped[str] = mapped_column(String(64))
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)

