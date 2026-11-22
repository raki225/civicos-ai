"""Initial normalized CivicOS schema and spatial indexes."""
from alembic import op

from app.core.database import Base
from app import models  # noqa: F401

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)
    if bind.dialect.name == "postgresql":
        op.execute("CREATE EXTENSION IF NOT EXISTS postgis")
        op.execute("ALTER TABLE incidents ADD COLUMN IF NOT EXISTS location geography(Point, 4326)")
        op.execute("UPDATE incidents SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography WHERE location IS NULL")
        op.execute("CREATE INDEX IF NOT EXISTS ix_incidents_location_gist ON incidents USING GIST(location)")


def downgrade() -> None:
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)

