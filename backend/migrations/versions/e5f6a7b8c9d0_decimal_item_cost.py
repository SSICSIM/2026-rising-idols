"""allow decimal item costs

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-10-11 12:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "e5f6a7b8c9d0"
down_revision: Union[str, None] = "d4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "items", "cost", type_=sa.Numeric(14, 2), existing_type=sa.Integer(),
        existing_nullable=False, postgresql_using="cost::numeric(14,2)",
    )


def downgrade() -> None:
    op.alter_column(
        "items", "cost", type_=sa.Integer(), existing_type=sa.Numeric(14, 2),
        existing_nullable=False, postgresql_using="round(cost)::integer",
    )
