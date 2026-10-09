"""add misc, posts, notices, items

Revision ID: c3d4e5f6a7b8
Revises: 39df54340432
Create Date: 2026-10-09 12:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "c3d4e5f6a7b8"
down_revision: Union[str, None] = "39df54340432"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "misc",
        sa.Column("id", sa.Integer(), autoincrement=False, nullable=False),
        sa.Column("group_name", sa.String(length=255), nullable=False),
        sa.Column("header_image", sa.String(length=1024), nullable=True),
        sa.Column("total", sa.Integer(), nullable=False),
        sa.Column("total_at_end_of_prev_period", sa.Integer(), nullable=False),
        sa.CheckConstraint("id = 1", name="ck_misc_single_row"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "posts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("period_id", sa.Integer(), nullable=False),
        sa.Column("user_name", sa.String(length=255), nullable=False),
        sa.Column("min_ago", sa.Integer(), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("likes", sa.Integer(), nullable=False),
        sa.Column("reply_to_id", sa.Integer(), nullable=True),
        sa.Column("is_artist", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["period_id"], ["crisis_periods.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["reply_to_id"], ["posts.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "notices",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("period_id", sa.Integer(), nullable=False),
        sa.Column("min_ago", sa.Integer(), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("likes", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["period_id"], ["crisis_periods.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "items",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("period_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=512), nullable=False),
        sa.Column("cost", sa.Integer(), nullable=False),
        sa.Column("photo", sa.String(length=1024), nullable=True),
        sa.ForeignKeyConstraint(["period_id"], ["crisis_periods.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("items")
    op.drop_table("notices")
    op.drop_table("posts")
    op.drop_table("misc")
