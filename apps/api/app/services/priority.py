from app.schemas import PriorityResult


BASE_HAZARD = {
    "pothole": 42,
    "road_damage": 38,
    "garbage": 26,
    "water_leakage": 35,
    "drainage": 40,
    "streetlight": 25,
    "other": 20,
}


def calculate_priority(category: str, description: str, duplicate_count: int, evidence_confidence: float) -> PriorityResult:
    text = description.casefold()
    score = BASE_HAZARD.get(category, 20)
    factors = [f"Category baseline: {category.replace('_', ' ')}"]
    estimated = ["physical hazard severity", "exposure"]

    danger_terms = {"accident", "injury", "school", "hospital", "highway", "flood", "blocked", "deep", "large"}
    matches = sorted(term for term in danger_terms if term in text)
    if matches:
        increase = min(25, 5 * len(matches))
        score += increase
        factors.append(f"Potential hazard indicators in citizen description: {', '.join(matches)}")

    if duplicate_count:
        increase = min(18, duplicate_count * 6)
        score += increase
        factors.append(f"{duplicate_count} nearby related report(s)")

    if evidence_confidence >= 0.75:
        score += 6
        factors.append("Evidence quality supports assessment")
    elif evidence_confidence < 0.4:
        score -= 5
        factors.append("Limited evidence confidence; officer review required")

    score = max(0, min(100, round(score)))
    label = "critical" if score >= 80 else "high" if score >= 60 else "medium" if score >= 35 else "low"
    confidence = min(0.9, 0.45 + evidence_confidence * 0.35 + (0.08 if duplicate_count else 0))
    action = "Escalate for immediate officer triage" if score >= 80 else "Place in priority review queue" if score >= 60 else "Review and assign within standard SLA"
    return PriorityResult(
        score=score,
        category=label,
        confidence=round(confidence, 2),
        contributing_factors=factors,
        explanation="This score is an explainable triage estimate, not a verified engineering assessment. " + " ".join(factors),
        recommended_next_action=action,
        estimated_fields=estimated,
    )

