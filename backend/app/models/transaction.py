from __future__ import annotations

import enum
from datetime import datetime
from decimal import Decimal

from sqlalchemy import ARRAY, Boolean, DateTime, ForeignKey, Index, Integer, Numeric, String, Text, text
from sqlalchemy import Enum as SAEnum
from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    period_id: Mapped[int] = mapped_column(
        ForeignKey("crisis_periods.id", ondelete="RESTRICT"), nullable=False
    )
    transaction_name: Mapped[str] = mapped_column(String(512), nullable=False)
    delegates: Mapped[list[int]] = mapped_column(
        ARRAY(Integer), nullable=False
    )
    delta: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
