from io import BytesIO

from PIL import Image


def photo() -> bytes:
    image = Image.new("RGB", (800, 600), color=(80, 80, 80))
    stream = BytesIO()
    image.save(stream, "JPEG")
    return stream.getvalue()


def test_report_track_metrics_and_officer_authorization(client):
    response = client.post(
        "/api/v1/reports",
        data={
            "category": "pothole", "description": "Large deep pothole near a school entrance",
            "latitude": "17.385", "longitude": "78.486", "language": "en",
        },
        files={"photo": ("road.jpg", photo(), "image/jpeg")},
    )
    assert response.status_code == 201, response.text
    created = response.json()
    assert created["priority"]["score"] >= 35
    assert created["vision"]["requires_human_review"] is True

    tracked = client.get(f"/api/v1/reports/{created['tracking_id']}")
    assert tracked.status_code == 200
    assert tracked.json()["status"] == "submitted"

    forbidden = client.get("/api/v1/officer/incidents", headers={"X-Demo-Role": "citizen"})
    assert forbidden.status_code == 403
    allowed = client.get("/api/v1/officer/incidents", headers={"X-Demo-Role": "municipal_officer"})
    assert allowed.status_code == 200

    metrics = client.get("/api/v1/public/metrics")
    assert metrics.status_code == 200
    assert metrics.json()["total_reports"] >= 1


def test_priority_override_requires_reason(client):
    response = client.post(
        "/api/v1/reports",
        data={"category": "garbage", "description": "Garbage beside the road for two days", "latitude": "17.39", "longitude": "78.48"},
    )
    public_id = response.json()["incident_public_id"]
    update = client.patch(
        f"/api/v1/officer/incidents/{public_id}/status",
        headers={"X-Demo-Role": "municipal_officer"},
        json={"status": "under_review", "reason": "Evidence review started", "override_priority": 90},
    )
    assert update.status_code == 422

