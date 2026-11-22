from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from app.models import ReportStatus


Category = Literal["pothole", "road_damage", "garbage", "water_leakage", "drainage", "streetlight", "other"]


class PriorityResult(BaseModel):
    score: int = Field(ge=0, le=100)
    category: str
    confidence: float = Field(ge=0, le=1)
    contributing_factors: list[str]
    explanation: str
    recommended_next_action: str
    estimated_fields: list[str]


class RoutingResult(BaseModel):
    department_name: str | None
    confidence: float
    explanation: str
    requires_manual_routing: bool


class VisionResult(BaseModel):
    status: str
    model_name: str
    confidence: float
    detections: list[dict]
    image_quality: dict
    requires_human_review: bool
    limitation: str | None = None


class ReportCreated(BaseModel):
    tracking_id: str
    incident_id: str
    incident_public_id: str
    duplicate_of: str | None
    summary: str
    priority: PriorityResult
    routing: RoutingResult
    vision: VisionResult | None
    status: ReportStatus


class TimelineEntry(BaseModel):
    status: str
    reason: str
    at: datetime


class TrackingView(BaseModel):
    tracking_id: str
    incident_public_id: str
    category: str
    summary: str
    status: ReportStatus
    priority_label: str
    created_at: datetime
    timeline: list[TimelineEntry]


class StatusUpdate(BaseModel):
    status: ReportStatus
    reason: str = Field(min_length=3, max_length=1000)
    override_priority: int | None = Field(default=None, ge=0, le=100)
    override_reason: str | None = Field(default=None, min_length=5, max_length=1000)


class IncidentListItem(BaseModel):
    public_id: str
    category: str
    title: str
    summary: str
    status: ReportStatus
    priority_score: int
    priority_label: str
    report_count: int
    latitude: float
    longitude: float
    created_at: datetime


class PublicMetrics(BaseModel):
    total_reports: int
    open_incidents: int
    resolved_incidents: int
    median_resolution_hours: float | None
    reopened_cases: int
    category_distribution: dict[str, int]
    status_distribution: dict[str, int]
    map_incidents: list[dict]
    data_note: str

