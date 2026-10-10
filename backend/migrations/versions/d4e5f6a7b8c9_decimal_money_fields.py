"""allow decimal money values on misc totals and transaction deltas

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-10-10 12:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "d4e5f6a7b8c9"
down_revision: Union[str, None] = "c3d4e5f6a7b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "misc", "total", type_=sa.Numeric(14, 2), existing_type=sa.Integer(),
        existing_nullable=False, postgresql_using="total::numeric(14,2)",
    )
    op.alter_column(
        "misc", "total_at_end_of_prev_period", type_=sa.Numeric(14, 2),
        existing_type=sa.Integer(), existing_nullable=False,
        postgresql_using="total_at_end_of_prev_period::numeric(14,2)",
    )
    op.alter_column(
        "transactions", "delta", type_=sa.Numeric(14, 2), existing_type=sa.Integer(),
        existing_nullable=False, postgresql_using="delta::numeric(14,2)",
    )


def downgrade() -> None:
    op.alter_column(
        "transactions", "delta", type_=sa.Integer(), existing_type=sa.Numeric(14, 2),
        existing_nullable=False, postgresql_using="round(delta)::integer",
    )
    op.alter_column(
        "misc", "total_at_end_of_prev_period", type_=sa.Integer(),
        existing_type=sa.Numeric(14, 2), existing_nullable=False,
        postgresql_using="round(total_at_end_of_prev_period)::integer",
    )
    op.alter_column(
        "misc", "total", type_=sa.Integer(), existing_type=sa.Numeric(14, 2),
        existing_nullable=False, postgresql_using="round(total)::integer",
    )
