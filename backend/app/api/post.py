from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.crisis_note import CrisisPeriod
from app.models.post import Post
from app.schemas import PostCreate, PostResponse, PostUpdate

router = APIRouter(prefix="/posts", tags=["posts"])


def _check_reply_target(db: Session, reply_to_id: int | None, period_id: int, post_id: int | None = None) -> None:
    """A reply must point at an existing post in the same period, and not at itself."""
    if reply_to_id is None:
        return
    if post_id is not None and reply_to_id == post_id:
        raise HTTPException(status_code=422, detail="A post cannot reply to itself.")
    target = db.get(Post, reply_to_id)
    if not target or target.period_id != period_id:
        raise HTTPException(status_code=422, detail="reply_to_id must reference a post in the same period.")


@router.get("", response_model=list[PostResponse])
def list_posts(
    period_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Post]:
    # Omitting period_id returns rows from every period.
    query = db.query(Post)
    if period_id is not None:
        query = query.filter(Post.period_id == period_id)
    return query.order_by(Post.id.asc()).all()


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(body: PostCreate, db: Session = Depends(get_db)) -> Post:
    active_period = db.query(CrisisPeriod).filter(CrisisPeriod.is_active.is_(True)).first()
    if not active_period:
        raise HTTPException(status_code=422, detail="No active period. Create a period first.")
    _check_reply_target(db, body.reply_to_id, active_period.id)
    post = Post(period_id=active_period.id, **body.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.patch("/{post_id}", response_model=PostResponse)
def update_post(post_id: int, body: PostUpdate, db: Session = Depends(get_db)) -> Post:
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    changes = body.model_dump(exclude_unset=True)
    if "reply_to_id" in changes:
        _check_reply_target(db, changes["reply_to_id"], post.period_id, post_id=post.id)
    for field, value in changes.items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=None)
def delete_post(post_id: int, db: Session = Depends(get_db)) -> None:
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    db.delete(post)
    db.commit()
