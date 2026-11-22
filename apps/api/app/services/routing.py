from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Department
from app.schemas import RoutingResult


DEFAULT_ROUTES = {
    "pothole": ("Roads & Public Works", "PWD"),
    "road_damage": ("Roads & Public Works", "PWD"),
    "garbage": ("Solid Waste Management", "SWM"),
    "water_leakage": ("Water Supply & Sewerage", "WSS"),
    "drainage": ("Storm Water Drainage", "SWD"),
    "streetlight": ("Electrical & Street Lighting", "ESL"),
}


def route_report(db: Session, category: str) -> tuple[Department | None, RoutingResult]:
    expected = DEFAULT_ROUTES.get(category)
    if not expected:
        return None, RoutingResult(department_name=None, confidence=0.0, explanation="No configured category route; manual jurisdiction review is required.", requires_manual_routing=True)

    name, code = expected
    department = db.scalar(select(Department).where(Department.code == code))
    if department is None:
        department = Department(name=name, code=code, categories=[category])
        db.add(department)
        db.flush()
    return department, RoutingResult(
        department_name=department.name,
        confidence=0.72,
        explanation=f"Recommended from the configured category-to-capability directory for {category.replace('_', ' ')}. Geographic boundary confirmation is still required.",
        requires_manual_routing=False,
    )

