"""
Analytics router — Q&A moderation + additional analytics for Organizers.
"""

from fastapi import APIRouter, HTTPException, Header
from supabase import create_client

from backend.config import get_settings
from backend.routers.events import _async_get_user_id

router = APIRouter(tags=["analytics"])


def _db(settings):
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def _verify_event_ownership(db, event_id: str, user_id: str):
    result = db.table("events").select("id").eq("id", event_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found")


@router.get("/events/{event_id}/qa")
async def list_questions(event_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    # Get all active activities for this event
    activities_result = db.table("event_activities").select("id").eq("event_id", event_id).eq("type", "QA_SESSION").execute()
    activity_ids = [a["id"] for a in (activities_result.data or [])]

    if not activity_ids:
        return []

    result = (
        db.table("qa_questions")
        .select("*")
        .in_("activity_id", activity_ids)
        .order("upvote_count", desc=True)
        .execute()
    )
    return result.data or []


@router.patch("/events/{event_id}/qa/{question_id}")
async def moderate_question(
    event_id: str,
    question_id: str,
    body: dict,
    authorization: str = Header(...),
):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    new_status = body.get("status")
    if new_status not in ("visible", "hidden", "featured"):
        raise HTTPException(status_code=400, detail="Invalid status")

    result = db.table("qa_questions").update({"status": new_status}).eq("id", question_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Question not found")

    return result.data[0]


@router.get("/events/{event_id}/posts")
async def list_posts(event_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _db(settings)
    _verify_event_ownership(db, event_id, user_id)

    result = (
        db.table("posts")
        .select("*")
        .eq("event_id", event_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data or []
