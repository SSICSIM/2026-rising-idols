from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.crisis_note import CrisisPeriod
from app.models.notice import Notice
from app.schemas import NoticeCreate, NoticeResponse, NoticeUpdate

router = APIRouter(prefix="/notices", tags=["notices"])


@router.get("", response_model=list[NoticeResponse])
def list_notices(
    period_id: int = Query(...),
    db: Session = Depends(get_db),
) -> list[Notice]:
    return (
        db.query(Notice)
        .filter(Notice.period_id == period_id)
        .order_by(Notice.id.asc())
        .all()
    )


@router.post("", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED)
def create_notice(body: NoticeCreate, db: Session = Depends(get_db)) -> Notice:
    active_period = db.query(CrisisPeriod).filter(CrisisPeriod.is_active.is_(True)).first()
    if not active_period:
        raise HTTPException(status_code=422, detail="No active period. Create a period first.")
    notice = Notice(period_id=active_period.id, **body.model_dump())
    db.add(notice)
    db.commit()
    db.refresh(notice)
    return notice


@router.patch("/{notice_id}", response_model=NoticeResponse)
def update_notice(notice_id: int, body: NoticeUpdate, db: Session = Depends(get_db)) -> Notice:
    notice = db.get(Notice, notice_id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found.")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(notice, field, value)
    db.commit()
    db.refresh(notice)
    return notice


@router.delete("/{notice_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def delete_notice(notice_id: int, db: Session = Depends(get_db)) -> None:
    notice = db.get(Notice, notice_id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found.")
    db.delete(notice)
    db.commit()
