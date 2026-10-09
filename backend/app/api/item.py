from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.crisis_note import CrisisPeriod
from app.models.item import Item
from app.schemas import ItemCreate, ItemResponse, ItemUpdate

router = APIRouter(prefix="/items", tags=["items"])


@router.get("", response_model=list[ItemResponse])
def list_items(
    period_id: int = Query(...),
    db: Session = Depends(get_db),
) -> list[Item]:
    return (
        db.query(Item)
        .filter(Item.period_id == period_id)
        .order_by(Item.id.asc())
        .all()
    )


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(body: ItemCreate, db: Session = Depends(get_db)) -> Item:
    active_period = db.query(CrisisPeriod).filter(CrisisPeriod.is_active.is_(True)).first()
    if not active_period:
        raise HTTPException(status_code=422, detail="No active period. Create a period first.")
    item = Item(period_id=active_period.id, **body.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, body: ItemUpdate, db: Session = Depends(get_db)) -> Item:
    item = db.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def delete_item(item_id: int, db: Session = Depends(get_db)) -> None:
    item = db.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    db.delete(item)
    db.commit()
