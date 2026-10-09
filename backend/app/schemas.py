from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.crisis_note import NoteType, Priority


class HealthResponse(BaseModel):
    status: str = "ok"


# ── Characters ──────────────────────────────────────────────────────────────

class CharacterCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class CharacterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    created_at: datetime


# ── Crisis Periods ───────────────────────────────────────────────────────────

class CrisisPeriodCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class CrisisPeriodResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    is_active: bool
    created_at: datetime
    archived_at: datetime | None


# ── Crisis Notes ─────────────────────────────────────────────────────────────

class CrisisNoteCreate(BaseModel):
    character_id: int
    # Optional: lets the client assert which period it expects the note to
    # land in, so create_note can reject a stale submission (see there) if
    # the active period has since changed. Omit to just use whatever period
    # is currently active.
    period_id: int | None = None
    title: str = Field(min_length=1, max_length=512)
    description: str = Field(min_length=1)
    crisis_staff_notes: str | None = None
    priority: Priority
    note_type: NoteType


class CrisisNoteUpdate(BaseModel):
    character_id: int | None = None
    title: str | None = Field(default=None, min_length=1, max_length=512)
    description: str | None = Field(default=None, min_length=1)
    crisis_staff_notes: str | None = None
    priority: Priority | None = None
    note_type: NoteType | None = None


class CrisisNoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    period_id: int
    character: CharacterResponse
    title: str
    description: str
    crisis_staff_notes: str | None
    priority: Priority
    note_type: NoteType
    created_at: datetime


# ── Staff Notes ───────────────────────────────────────────────────────────────

class StaffNoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=512)
    content: str = Field(min_length=1)


class StaffNoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=512)
    content: str | None = Field(default=None, min_length=1)


class StaffNoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    period_id: int
    title: str
    content: str
    created_at: datetime


# ── Bulk upload ──────────────────────────────────────────────────────────────

class BulkUploadResult(BaseModel):
    created: int
    skipped: int


# ── Analytics ────────────────────────────────────────────────────────────────

class NotesByCharacter(BaseModel):
    character_name: str
    count: int


class PriorityCount(BaseModel):
    priority: Priority
    count: int


class AnalyticsSummary(BaseModel):
    total_notes: int
    notes_by_character: list[NotesByCharacter]
    priority_distribution: list[PriorityCount]
    private_directive_count: int
    public_directive_count: int

# ── Misc ──────────────────────────────────────────────────────────────────────

class MiscUpdate(BaseModel):
    group_name: str | None = Field(default=None, max_length=255)
    header_image: str | None = Field(default=None, max_length=1024)
    total: int | None = None
    total_at_end_of_prev_period: int | None = None


class MiscResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    group_name: str
    header_image: str | None
    total: int
    total_at_end_of_prev_period: int


# ── Transactions ────────────────────────────────────────────────────────────

class TransactionCreate(BaseModel):
    transaction_name: str = Field(min_length=1, max_length=512)
    delegates: list[int]
    delta: int


class TransactionUpdate(BaseModel):
    transaction_name: str | None = Field(default=None, min_length=1, max_length=512)
    delegates: list[int] | None = None
    delta: int | None = None


class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    period_id: int
    transaction_name: str
    delegates: list[int]
    delta: int
    created_at: datetime


# ── Posts ─────────────────────────────────────────────────────────────────────

class PostCreate(BaseModel):
    user_name: str = Field(min_length=1, max_length=255)
    min_ago: int = Field(ge=0)
    message: str = Field(min_length=1)
    likes: int = Field(default=0, ge=0)
    reply_to_id: int | None = None
    is_artist: bool = False


class PostUpdate(BaseModel):
    user_name: str | None = Field(default=None, min_length=1, max_length=255)
    min_ago: int | None = Field(default=None, ge=0)
    message: str | None = Field(default=None, min_length=1)
    likes: int | None = Field(default=None, ge=0)
    reply_to_id: int | None = None
    is_artist: bool | None = None


class PostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    period_id: int
    user_name: str
    min_ago: int
    message: str
    likes: int
    reply_to_id: int | None
    is_artist: bool


# ── Notices ───────────────────────────────────────────────────────────────────

class NoticeCreate(BaseModel):
    min_ago: int = Field(ge=0)
    message: str = Field(min_length=1)
    likes: int = Field(default=0, ge=0)


class NoticeUpdate(BaseModel):
    min_ago: int | None = Field(default=None, ge=0)
    message: str | None = Field(default=None, min_length=1)
    likes: int | None = Field(default=None, ge=0)


class NoticeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    period_id: int
    min_ago: int
    message: str
    likes: int


# ── Items ─────────────────────────────────────────────────────────────────────

class ItemCreate(BaseModel):
    title: str = Field(min_length=1, max_length=512)
    cost: int = Field(ge=0)
    photo: str | None = Field(default=None, max_length=1024)


class ItemUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=512)
    cost: int | None = Field(default=None, ge=0)
    photo: str | None = Field(default=None, max_length=1024)


class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    period_id: int
    title: str
    cost: int
    photo: str | None
