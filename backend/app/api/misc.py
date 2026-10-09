from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.misc import Misc
from app.schemas import MiscResponse, MiscUpdate

router = APIRouter(prefix="/misc", tags=["misc"])


@router.get("", response_model=MiscResponse)
def get_misc(db: Session = Depends(get_db)) -> Misc:
    misc = db.get(Misc, 1)
    if not misc:
        raise HTTPException(status_code=404, detail="Misc info not found.")
    return misc


@router.patch("", response_model=MiscResponse)
def update_misc(body: MiscUpdate, db: Session = Depends(get_db)) -> Misc:
    # Single-row table: create the row on first write, otherwise update it.
    misc = db.get(Misc, 1) or Misc(id=1)
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(misc, field, value)
    db.add(misc)
    db.commit()
    db.refresh(misc)
    return misc
