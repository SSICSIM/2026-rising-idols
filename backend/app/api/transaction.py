from __future__ import annotations

from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.crisis_note import CrisisPeriod
from app.models.misc import Misc
from app.models.transaction import Transaction
from app.schemas import TransactionCreate, TransactionResponse, TransactionUpdate

router = APIRouter(prefix="/transaction", tags=["transaction"])


@router.get("", response_model=list[TransactionResponse])
def list_transactions(
    db: Session = Depends(get_db),
) -> list[Transaction]:
    return (
        db.query(Transaction)
        .order_by(Transaction.created_at.desc())
        .all()
    )


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(body: TransactionCreate, db: Session = Depends(get_db)) -> Transaction:
    active_period = db.query(CrisisPeriod).filter(CrisisPeriod.is_active.is_(True)).first()
    if not active_period:
        raise HTTPException(status_code=422, detail="No active period. Create a period first.")
    transaction = Transaction(
        period_id=active_period.id,
        transaction_name=body.transaction_name,
        delegates=body.delegates,
        delta=Decimal(str(body.delta)),
    )
    # The net worth total moves by the transaction's delta, in the same commit.
    misc = db.get(Misc, 1) or Misc(id=1)
    misc.total = (misc.total or 0) + Decimal(str(body.delta))
    db.add(misc)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.patch("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int, body: TransactionUpdate, db: Session = Depends(get_db)
) -> Transaction:
    transaction = db.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(transaction, field, value)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)) -> None:
    transaction = db.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found.")
    # Only transactions in the active period moved the running total, so only
    # those are reversed here. Older periods' deltas are already in the snapshot.
    active_period = db.query(CrisisPeriod).filter(CrisisPeriod.is_active.is_(True)).first()
    if active_period and transaction.period_id == active_period.id:
        misc = db.get(Misc, 1) or Misc(id=1)
        misc.total = (misc.total or 0) - transaction.delta
        db.add(misc)
    db.delete(transaction)
    db.commit()
