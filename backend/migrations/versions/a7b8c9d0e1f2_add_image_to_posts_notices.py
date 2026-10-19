"""add optional image to posts and notices

Revision ID: a7b8c9d0e1f2
Revises: f6a7b8c9d0e1
Create Date: 2026-10-18 13:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a7b8c9d0e1f2"
down_revision: Union[str, None] = "f6a7b8c9d0e1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("posts", sa.Column("image", sa.String(length=1024), nullable=True))
    op.add_column("notices", sa.Column("image", sa.String(length=1024), nullable=True))


def downgrade() -> None:
    op.drop_column("notices", "image")
    op.drop_column("posts", "image")
