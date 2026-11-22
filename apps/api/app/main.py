from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import get_settings
from app.core.database import Base, SessionLocal, engine
from app.seed import seed_demo


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    settings.civicos_upload_dir.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_demo(db)
    yield


app = FastAPI(
    title="CivicOS AI API",
    version="0.1.0",
    description="Civic infrastructure reporting and incident intelligence. AI estimates require human verification.",
    lifespan=lifespan,
)
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router, prefix="/api/v1")

