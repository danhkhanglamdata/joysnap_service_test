"""
Attendee router — all endpoints for attendees (no auth required).
Attendees are identified by their session token (stored in localStorage/cookie).
"""

from fastapi import APIRouter, HTTPException, Header, Request
from supabase import create_client

from backend.config import get_settings
from backend.models.attendee import (
    SessionCreate, SessionRecover, LeadFormSubmit,
    PostCreate, SpinRequest, VoteRequest, QACreate,
)
from backend.services.gate import check_gate
from backend.services.spin import select_prize
from backend.services.realtime import broadcast

router = APIRouter(prefix="/e/{event_id}", tags=["attendee"])


def _db(settings):
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def _get_event(db, event_id: str) -> dict:
    result = db.table("events").select("*").eq("id", event_id).in_("status", ["active", "ended"]).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found or not active")
    return result.data[0]


def _get_session(db, event_id: str, token: str) -> dict:
    result = db.table("event_sessions").select("*").eq("event_id", event_id).eq("session_token", token).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid session token")
    return result.data[0]


def _extract_token(request: Request, x_session_token: str | None) -> str | None:
    """Extract session token from header or cookie."""
    if x_session_token:
        return x_session_token
    return request.cookies.get("session_token")


@router.get("")
async def get_event_info(event_id: str):
    settings = get_settings()
    db = _db(settings)
    event = _get_event(db, event_id)
    # Strip sensitive internal fields
    return {
        "id": event["id"],
        "title": event["title"],
        "description": event.get("description"),
        "event_date": event.get("event_date"),
        "location": event.get("location"),
        "color": event["color"],
        "logo_url": event.get("logo_url"),
        "status": event["status"],
        "settings": event.get("settings", {}),
    }


@router.post("/session")
async def create_or_restore_session(event_id: str, body: SessionCreate, request: Request):
    settings = get_settings()
    db = _db(settings)
    _get_event(db, event_id)  # Ensure event is active

    # Try to restore from provided token
    if body.token:
        result = db.table("event_sessions").select("*").eq("event_id", event_id).eq("session_token", body.token).execute()
        if result.data:
            session = result.data[0]
            # Update last_active_at
            db.table("event_sessions").update({"last_active_at": "now()"}).eq("id", session["id"]).execute()
            return session

    # Try device fingerprint lookup
    if body.device_fp:
        result = db.table("event_sessions").select("*").eq("event_id", event_id).eq("device_fp", body.device_fp).execute()
        if result.data:
            return result.data[0]

    # Create new session
    result = db.table("event_sessions").insert({
        "event_id": event_id,
        "device_fp": body.device_fp,
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create session")

    return result.data[0]


@router.post("/session/recover")
async def recover_session(event_id: str, body: SessionRecover):
    settings = get_settings()
    db = _db(settings)
    _get_event(db, event_id)

    # Find lead by phone in this event
    lead_result = db.table("leads").select("session_id").eq("event_id", event_id).eq("phone", body.phone).execute()

    if lead_result.data:
        session_id = lead_result.data[0]["session_id"]
        session_result = db.table("event_sessions").select("*").eq("id", session_id).execute()
        if session_result.data:
            return session_result.data[0]

    # No session found → create new
    result = db.table("event_sessions").insert({"event_id": event_id}).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create session")

    return result.data[0]


@router.get("/state")
async def get_event_state(
    event_id: str,
    request: Request,
    x_session_token: str | None = Header(default=None),
):
    settings = get_settings()
    db = _db(settings)
    _get_event(db, event_id)

    token = _extract_token(request, x_session_token)
    session = _get_session(db, event_id, token) if token else None

    # Active activities
    activities_result = db.table("event_activities").select("*").eq("event_id", event_id).order("position").execute()
    activities = activities_result.data or []

    # Recent posts (wall)
    posts_result = (
        db.table("posts")
        .select("*")
        .eq("event_id", event_id)
        .eq("status", "approved")
        .order("created_at", desc=True)
        .limit(50)
        .execute()
    )

    # Energy counter for active ENERGY_BAR
    energy = None
    energy_act = next((a for a in activities if a["type"] == "ENERGY_BAR" and a["status"] == "active"), None)
    if energy_act:
        counter_result = db.table("energy_counters").select("*").eq("activity_id", energy_act["id"]).execute()
        if counter_result.data:
            target = energy_act.get("config", {}).get("target", 100)
            current = counter_result.data[0]["current"]
            energy = {
                "current": current,
                "target": target,
                "pct": round(min(current / target * 100, 100), 1) if target else 0,
            }

    return {
        "session": session,
        "activities": activities,
        "posts": posts_result.data or [],
        "energy": energy,
    }


@router.post("/form")
async def submit_form(
    event_id: str,
    body: LeadFormSubmit,
    request: Request,
    x_session_token: str | None = Header(default=None),
):
    settings = get_settings()
    db = _db(settings)
    _get_event(db, event_id)

    token = _extract_token(request, x_session_token)
    if not token:
        raise HTTPException(status_code=401, detail="Session token required")

    session = _get_session(db, event_id, token)

    if session.get("form_filled"):
        return {"ok": True, "message": "Form already submitted"}

    # Save lead
    db.table("leads").insert({
        "event_id": event_id,
        "session_id": session["id"],
        "name": body.name,
        "phone": body.phone,
        "email": body.email,
        "custom_ans": body.custom_ans,
    }).execute()

    # Update session: mark form filled + populate name/phone/email
    updates = {"form_filled": True}
    if body.name:
        updates["name"] = body.name
    if body.phone:
        updates["phone"] = body.phone
    if body.email:
        updates["email"] = body.email

    db.table("event_sessions").update(updates).eq("id", session["id"]).execute()

    return {"ok": True}


@router.post("/posts")
async def create_post(
    event_id: str,
    body: PostCreate,
    request: Request,
    x_session_token: str | None = Header(default=None),
):
    settings = get_settings()
    db = _db(settings)
    event = _get_event(db, event_id)

    token = _extract_token(request, x_session_token)
    if not token:
        raise HTTPException(status_code=401, detail="Session token required")

    session = _get_session(db, event_id, token)
    author_name = session.get("name") or "Khách mời"

    post_data = {
        "event_id": event_id,
        "session_id": session["id"],
        "author_name": author_name,
        "content": body.content,
        "vibe_emoji": body.vibe_emoji,
    }
    if body.activity_id:
        post_data["activity_id"] = body.activity_id

    result = db.table("posts").insert(post_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create post")

    post = result.data[0]

    # Increment session post_count
    db.table("event_sessions").update({"post_count": session["post_count"] + 1}).eq("id", session["id"]).execute()

    # Update energy counter if ENERGY_BAR is active
    energy_act = _get_active_energy_bar(db, event_id)
    energy_payload = None
    if energy_act:
        target = energy_act.get("config", {}).get("target", 100)
        counter_result = db.table("energy_counters").select("current").eq("activity_id", energy_act["id"]).execute()
        current = (counter_result.data[0]["current"] if counter_result.data else 0) + 1
        db.table("energy_counters").update({"current": current}).eq("activity_id", energy_act["id"]).execute()

        pct = round(min(current / target * 100, 100), 1) if target else 0
        energy_payload = {"current": current, "target": target, "pct": pct}

        await _handle_energy_milestones(event_id, pct, energy_act)

    # Broadcast new post + energy update
    payload = {"post": post}
    if energy_payload:
        payload["energy"] = energy_payload

    await broadcast(event_id, "NEW_POST", payload)
    if energy_payload:
        await broadcast(event_id, "ENERGY_UPDATE", energy_payload)

    return post


@router.post("/check-gate")
async def check_gate_endpoint(
    event_id: str,
    body: dict,
    request: Request,
    x_session_token: str | None = Header(default=None),
):
    settings = get_settings()
    db = _db(settings)
    _get_event(db, event_id)

    token = _extract_token(request, x_session_token)
    if not token:
        raise HTTPException(status_code=401, detail="Session token required")

    session = _get_session(db, event_id, token)
    activity_id = body.get("activity_id")

    activity_result = db.table("event_activities").select("*").eq("id", activity_id).eq("event_id", event_id).execute()
    if not activity_result.data:
        raise HTTPException(status_code=404, detail="Activity not found")

    activity = activity_result.data[0]

    def db_get_activity(aid):
        r = db.table("event_activities").select("*").eq("id", aid).execute()
        return r.data[0] if r.data else None

    return check_gate(session, activity, db_get_activity)


@router.post("/spin")
async def spin_wheel(
    event_id: str,
    body: SpinRequest,
    request: Request,
    x_session_token: str | None = Header(default=None),
):
    settings = get_settings()
    db = _db(settings)
    _get_event(db, event_id)

    token = _extract_token(request, x_session_token)
    if not token:
        raise HTTPException(status_code=401, detail="Session token required")

    session = _get_session(db, event_id, token)

    # Get activity
    activity_result = db.table("event_activities").select("*").eq("id", body.activity_id).eq("event_id", event_id).execute()
    if not activity_result.data:
        raise HTTPException(status_code=404, detail="Activity not found")

    activity = activity_result.data[0]

    # Check gate
    def db_get_activity(aid):
        r = db.table("event_activities").select("*").eq("id", aid).execute()
        return r.data[0] if r.data else None

    gate_result = check_gate(session, activity, db_get_activity)
    if not gate_result["allowed"]:
        raise HTTPException(status_code=403, detail={"message": "Gate not passed", "missing": gate_result["missing"]})

    # Anti-fraud: check for existing spin
    existing = db.table("spin_results").select("id").eq("activity_id", body.activity_id).eq("session_id", session["id"]).execute()
    if existing.data:
        raise HTTPException(status_code=409, detail="Already spun")

    # Server-side prize selection
    prizes = activity.get("config", {}).get("prizes", [])
    prize = select_prize(prizes)

    # Record result (UNIQUE constraint prevents double spin at DB level)
    try:
        db.table("spin_results").insert({
            "activity_id": body.activity_id,
            "session_id": session["id"],
            "prize_id": prize["id"],
            "prize_label": prize["label"],
        }).execute()
    except Exception:
        raise HTTPException(status_code=409, detail="Already spun")

    db.table("event_sessions").update({"spin_used": True}).eq("id", session["id"]).execute()

    return {"prize": prize}


@router.post("/vote")
async def vote_poll(
    event_id: str,
    body: VoteRequest,
    request: Request,
    x_session_token: str | None = Header(default=None),
):
    settings = get_settings()
    db = _db(settings)
    _get_event(db, event_id)

    token = _extract_token(request, x_session_token)
    if not token:
        raise HTTPException(status_code=401, detail="Session token required")

    session = _get_session(db, event_id, token)

    # Check for existing vote
    existing = db.table("poll_votes").select("id").eq("activity_id", body.activity_id).eq("session_id", session["id"]).execute()
    if existing.data:
        raise HTTPException(status_code=409, detail="Already voted")

    try:
        db.table("poll_votes").insert({
            "activity_id": body.activity_id,
            "session_id": session["id"],
            "option_index": body.option_index,
        }).execute()
    except Exception:
        raise HTTPException(status_code=409, detail="Already voted")

    # Compute updated results
    votes_result = db.table("poll_votes").select("option_index").eq("activity_id", body.activity_id).execute()
    votes = votes_result.data or []

    counts: dict[int, int] = {}
    for v in votes:
        idx = v["option_index"]
        counts[idx] = counts.get(idx, 0) + 1

    total = len(votes)
    results = {idx: {"count": c, "pct": round(c / total * 100, 1)} for idx, c in counts.items()}

    await broadcast(event_id, "POLL_UPDATE", {"poll_id": body.activity_id, "results": results, "total": total})

    return {"ok": True, "results": results}


@router.post("/qa")
async def submit_question(
    event_id: str,
    body: QACreate,
    request: Request,
    x_session_token: str | None = Header(default=None),
):
    settings = get_settings()
    db = _db(settings)
    _get_event(db, event_id)

    token = _extract_token(request, x_session_token)
    if not token:
        raise HTTPException(status_code=401, detail="Session token required")

    session = _get_session(db, event_id, token)

    result = db.table("qa_questions").insert({
        "activity_id": body.activity_id,
        "session_id": session["id"],
        "question_text": body.question_text,
        "is_anonymous": body.is_anonymous,
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to submit question")

    question = result.data[0]
    await broadcast(event_id, "NEW_QUESTION", {"question": question})

    return question


@router.post("/qa/{question_id}/upvote")
async def upvote_question(
    event_id: str,
    question_id: str,
    request: Request,
    x_session_token: str | None = Header(default=None),
):
    settings = get_settings()
    db = _db(settings)
    _get_event(db, event_id)

    token = _extract_token(request, x_session_token)
    if not token:
        raise HTTPException(status_code=401, detail="Session token required")

    # Increment upvote count (using RPC or raw update)
    result = db.table("qa_questions").select("upvote_count", "activity_id").eq("id", question_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Question not found")

    current_count = result.data[0]["upvote_count"]
    activity_id = result.data[0]["activity_id"]
    db.table("qa_questions").update({"upvote_count": current_count + 1}).eq("id", question_id).execute()

    # Broadcast upvote update
    await broadcast(event_id, "QUESTION_UPVOTE", {"question_id": question_id, "upvote_count": current_count + 1})

    return {"ok": True, "upvote_count": current_count + 1}


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _get_active_energy_bar(db, event_id: str) -> dict | None:
    result = db.table("event_activities").select("*").eq("event_id", event_id).eq("type", "ENERGY_BAR").eq("status", "active").execute()
    return result.data[0] if result.data else None


async def _handle_energy_milestones(event_id: str, pct: float, activity: dict):
    milestones = activity.get("config", {}).get("milestones", [])
    for milestone in milestones:
        if abs(pct - milestone.get("at", 0)) < 0.5:
            if pct >= 100:
                await broadcast(event_id, "ENERGY_FULL", {"message": milestone.get("msg", "🎉 Đạt mục tiêu!")})
            else:
                await broadcast(event_id, "ENERGY_MILESTONE", {"pct": pct, "message": milestone.get("msg", "")})
