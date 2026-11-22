import hashlib
import re
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image

from app.core.config import get_settings


ALLOWED = {"image/jpeg", "image/png", "image/webp"}


async def persist_upload(file: UploadFile, tracking_id: str) -> tuple[bytes, dict]:
    settings = get_settings()
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=415, detail="Only JPEG, PNG, and WebP images are supported in the MVP")
    content = await file.read(settings.civicos_max_upload_mb * 1024 * 1024 + 1)
    if len(content) > settings.civicos_max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Upload exceeds configured size limit")

    extension = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}[file.content_type]
    safe_tracking = re.sub(r"[^A-Z0-9-]", "", tracking_id.upper())
    directory = settings.civicos_upload_dir / safe_tracking
    directory.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha256(content).hexdigest()
    path = directory / f"{digest[:20]}{extension}"
    path.write_bytes(content)
    try:
        with Image.open(path) as image:
            width, height = image.size
    except Exception:
        path.unlink(missing_ok=True)
        raise HTTPException(status_code=422, detail="Uploaded content is not a valid image")
    return content, {"storage_key": str(path), "sha256": digest, "byte_size": len(content), "width": width, "height": height, "mime_type": file.content_type}

