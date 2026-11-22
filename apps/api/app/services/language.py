LANGUAGE_LABELS = {"en": "English", "te": "Telugu", "hi": "Hindi"}


def detect_language(text: str, requested: str | None) -> str:
    if requested in LANGUAGE_LABELS:
        return requested
    if any("\u0c00" <= char <= "\u0c7f" for char in text):
        return "te"
    if any("\u0900" <= char <= "\u097f" for char in text):
        return "hi"
    return "en"


def safe_summary(category: str, description: str, language: str) -> str:
    clean = " ".join(description.strip().split())
    if len(clean) > 260:
        clean = clean[:257].rstrip() + "..."
    return f"{category.replace('_', ' ').title()} reported: {clean}"

