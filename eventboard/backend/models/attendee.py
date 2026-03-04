from __future__ import annotations

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


class SessionCreate(BaseModel):
    token: Optional[str] = None       # Existing token to restore
    device_fp: Optional[str] = None   # Device fingerprint


class SessionRecover(BaseModel):
    phone: str


class SessionOut(BaseModel):
    id: str
    event_id: str
    session_token: str
    name: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    form_filled: bool
    spin_used: bool
    post_count: int
    points: int
    created_at: datetime
    last_active_at: datetime


class LeadFormSubmit(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=255)
    custom_ans: Optional[str] = None


class PostCreate(BaseModel):
    content: str = Field(default="", max_length=500)
    vibe_emoji: str = Field(default="🔥", max_length=10)
    activity_id: Optional[str] = None


class PostOut(BaseModel):
    id: str
    event_id: str
    session_id: str
    author_name: str
    content: str
    vibe_emoji: str
    status: str
    created_at: datetime


class SpinRequest(BaseModel):
    activity_id: str


class VoteRequest(BaseModel):
    activity_id: str
    option_index: int = Field(..., ge=0)


class QACreate(BaseModel):
    activity_id: str
    question_text: str = Field(..., max_length=1000)
    is_anonymous: bool = False


class QAUpvote(BaseModel):
    activity_id: str
