"""
Activities router — Organizer manages the event playlist (gamification activities).
"""

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Header
from supabase import create_client

from backend.config import get_settings
from backend.models.event import ActivityCreate, ActivityUpdate, ActivityReorder
from backend.services.realtime import broadcast
from backend.routers.events import _async_get_user_id

router = APIRouter(prefix="/events/{event_id}/activities", tags=["activities"])


def _db(settings):
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def _verify_event_ownership(db, event_id: str, user_id: str):
    result = db.table("events").select("id").eq("id", event_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found")


@router.post("", status_code=201)
async def add_activity(event_id: str, body: ActivityCreate, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    result = db.table("event_activities").insert({
        "event_id": event_id,
        "type": body.type,
        "title": body.title,
        "position": body.position,
        "config": body.config,
        "trigger_type": body.trigger_type,
        "trigger_config": body.trigger_config,
        "gate_config": body.gate_config,
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create activity")

    activity = result.data[0]

    # If it's an energy bar, create the counter row
    if body.type == "ENERGY_BAR":
        db.table("energy_counters").insert({"activity_id": activity["id"], "current": 0}).execute()

    return activity


@router.get("")
async def list_activities(event_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    result = db.table("event_activities").select("*").eq("event_id", event_id).order("position").execute()
    return result.data or []


@router.patch("/reorder")
async def reorder_activities(event_id: str, body: ActivityReorder, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    for item in body.items:
        db.table("event_activities").update({"position": item.position}).eq("id", item.id).eq("event_id", event_id).execute()

    return {"ok": True}


@router.patch("/{activity_id}")
async def update_activity(event_id: str, activity_id: str, body: ActivityUpdate, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        db.table("event_activities")
        .update(updates)
        .eq("id", activity_id)
        .eq("event_id", event_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Activity not found")

    return result.data[0]


@router.delete("/{activity_id}", status_code=204)
async def delete_activity(event_id: str, activity_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    db.table("event_activities").delete().eq("id", activity_id).eq("event_id", event_id).execute()
    return None


@router.post("/{activity_id}/start")
async def start_activity(event_id: str, activity_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    now = datetime.now(timezone.utc).isoformat()
    result = (
        db.table("event_activities")
        .update({"status": "active", "started_at": now})
        .eq("id", activity_id)
        .eq("event_id", event_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Activity not found")

    activity = result.data[0]
    await broadcast(event_id, "ACTIVITY_STARTED", {"activity": activity})

    # Special handling for polls
    if activity["type"] == "LIVE_POLL":
        await broadcast(event_id, "POLL_STARTED", {"poll": activity})

    return activity


@router.post("/{activity_id}/end")
async def end_activity(event_id: str, activity_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    now = datetime.now(timezone.utc).isoformat()
    result = (
        db.table("event_activities")
        .update({"status": "completed", "ended_at": now})
        .eq("id", activity_id)
        .eq("event_id", event_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Activity not found")

    return result.data[0]
