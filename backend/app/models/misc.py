from __future__ import annotations

from sqlalchemy import CheckConstraint, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Misc(Base):
    """Single-row table. The CHECK constraint keeps it to exactly one row (id = 1)."""

    __tablename__ = "misc"
    __table_args__ = (CheckConstraint("id = 1", name="ck_misc_single_row"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=False, default=1)
    group_name: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    header_image: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    total: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_at_end_of_prev_period: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
