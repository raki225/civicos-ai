import io
from pathlib import Path

from PIL import Image, ImageStat

from app.core.config import get_settings
from app.schemas import VisionResult


def inspect_image(content: bytes, category: str) -> VisionResult:
    try:
        image = Image.open(io.BytesIO(content)).convert("RGB")
        width, height = image.size
        gray = image.convert("L")
        variance = ImageStat.Stat(gray).var[0]
        quality = {
            "width": width,
            "height": height,
            "sharpness_proxy": round(variance, 2),
            "sufficient_resolution": width >= 640 and height >= 480,
            "likely_blurry": variance < 45,
        }
    except Exception:
        return VisionResult(status="invalid_image", model_name="image-validator", confidence=0, detections=[], image_quality={}, requires_human_review=True, limitation="The uploaded file could not be decoded as an image.")

    settings = get_settings()
    if not settings.civicos_yolo_weights:
        return VisionResult(
            status="human_review_required",
            model_name="image-quality-check-only",
            confidence=0.35 if quality["sufficient_resolution"] else 0.2,
            detections=[],
            image_quality=quality,
            requires_human_review=True,
            limitation="Specialized validated infrastructure-detection weights are not configured. No object-detection claim has been made.",
        )

    try:
        from ultralytics import YOLO

        model = YOLO(Path(settings.civicos_yolo_weights))
        result = model.predict(image, verbose=False)[0]
        detections = []
        for box in result.boxes:
            class_id = int(box.cls[0])
            detections.append({
                "label": result.names[class_id],
                "confidence": round(float(box.conf[0]), 4),
                "bbox_xyxy": [round(float(value), 1) for value in box.xyxy[0]],
            })
        confidence = max((item["confidence"] for item in detections), default=0.0)
        return VisionResult(status="analyzed", model_name=Path(settings.civicos_yolo_weights).name, confidence=confidence, detections=detections, image_quality=quality, requires_human_review=confidence < 0.6)
    except Exception as exc:
        return VisionResult(status="inference_unavailable", model_name="configured-yolo", confidence=0, detections=[], image_quality=quality, requires_human_review=True, limitation=f"Inference failed safely: {type(exc).__name__}")

