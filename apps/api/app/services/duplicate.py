import math
import re
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Incident


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6_371_000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def tokens(value: str) -> set[str]:
    return {word for word in re.findall(r"[a-z0-9]+", value.casefold()) if len(word) > 2}


def semantic_overlap(a: str, b: str) -> float:
    left, right = tokens(a), tokens(b)
    return len(left & right) / max(1, len(left | right))


def find_duplicate(db: Session, category: str, description: str, lat: float, lng: float) -> tuple[Incident | None, float]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    candidates = db.scalars(select(Incident).where(Incident.category == category, Incident.created_at >= cutoff)).all()
    best: tuple[Incident | None, float] = (None, 0.0)
    for candidate in candidates:
        distance = haversine_m(lat, lng, candidate.latitude, candidate.longitude)
        if distance > 250:
            continue
        geo_score = max(0.0, 1 - distance / 250)
        text_score = semantic_overlap(description, candidate.summary)
        score = geo_score * 0.72 + text_score * 0.28
        if score > best[1]:
            best = (candidate, score)
    return best if best[1] >= 0.62 else (None, best[1])

