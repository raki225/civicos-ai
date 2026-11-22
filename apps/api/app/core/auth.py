from dataclasses import dataclass
from enum import StrEnum

from fastapi import Depends, Header, HTTPException, status

from app.core.config import Settings, get_settings


class Role(StrEnum):
    CITIZEN = "citizen"
    OFFICER = "municipal_officer"
    DEPARTMENT_ADMIN = "department_admin"
    SYSTEM_ADMIN = "system_admin"
    PUBLIC = "public_viewer"


@dataclass(frozen=True)
class Principal:
    user_id: str
    role: Role
    display_name: str


def current_principal(
    authorization: str | None = Header(default=None),
    x_demo_role: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> Principal:
    if settings.civicos_allow_demo_auth and not settings.is_production:
        try:
            role = Role(x_demo_role or Role.CITIZEN)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Unknown demo role") from exc
        return Principal(user_id=f"demo:{role}", role=role, display_name="Demo user")

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token required")

    try:
        import firebase_admin
        from firebase_admin import auth, credentials

        if not firebase_admin._apps:
            firebase_admin.initialize_app(credentials.ApplicationDefault(), {"projectId": settings.firebase_project_id})
        token = auth.verify_id_token(authorization.removeprefix("Bearer ").strip())
        role = Role(token.get("role", Role.CITIZEN))
        return Principal(user_id=token["uid"], role=role, display_name=token.get("name", "User"))
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token") from exc


def require_roles(*roles: Role):
    def dependency(principal: Principal = Depends(current_principal)) -> Principal:
        if principal.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return principal

    return dependency

