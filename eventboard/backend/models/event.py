from __future__ import annotations

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    color: str = Field(default="#6C63FF", pattern=r"^#[0-9A-Fa-f]{6}$")
    logo_url: Optional[str] = None
    settings: dict[str, Any] = Field(default_factory=dict)


class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")
    logo_url: Optional[str] = None
    status: Optional[str] = Field(None, pattern=r"^(draft|active|ended)$")
    settings: Optional[dict[str, Any]] = None


class EventOut(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str]
    event_date: Optional[datetime]
    location: Optional[str]
    color: str
    logo_url: Optional[str]
    status: str
    settings: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class ActivityCreate(BaseModel):
    type: str = Field(..., pattern=r"^(MOMENT_WALL|ENERGY_BAR|LUCKY_SPIN|LIVE_POLL|QA_SESSION)$")
    title: Optional[str] = None
    position: int = Field(default=0, ge=0)
    config: dict[str, Any] = Field(default_factory=dict)
    trigger_type: str = Field(default="manual", pattern=r"^(manual|auto_after_prev|condition_met)$")
    trigger_config: dict[str, Any] = Field(default_factory=dict)
    gate_config: dict[str, Any] = Field(default_factory=dict)


class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    position: Optional[int] = Field(None, ge=0)
    config: Optional[dict[str, Any]] = None
    trigger_type: Optional[str] = Field(None, pattern=r"^(manual|auto_after_prev|condition_met)$")
    trigger_config: Optional[dict[str, Any]] = None
    gate_config: Optional[dict[str, Any]] = None
    status: Optional[str] = Field(None, pattern=r"^(waiting|active|completed|skipped)$")


class ActivityOut(BaseModel):
    id: str
    event_id: str
    type: str
    title: Optional[str]
    position: int
    status: str
    config: dict[str, Any]
    trigger_type: str
    trigger_config: dict[str, Any]
    gate_config: dict[str, Any]
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    created_at: datetime


class ActivityReorderItem(BaseModel):
    id: str
    position: int


class ActivityReorder(BaseModel):
    items: list[ActivityReorderItem]
