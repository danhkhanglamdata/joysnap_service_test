"""
Events router — Organizer CRUD for events.
All endpoints require a valid Supabase JWT (Bearer token).
"""

from fastapi import APIRouter, HTTPException, Header, Response
from supabase import create_client

from backend.config import get_settings
from backend.models.event import EventCreate, EventUpdate, EventOut
from backend.services.qr import generate_qr_base64, get_event_url
from backend.services.realtime import broadcast

router = APIRouter(prefix="/events", tags=["events"])


def _get_client(settings):
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def _get_user_id(authorization: str, settings) -> str:
    """Verify JWT and return user_id."""
    import httpx, asyncio

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization")

    token = authorization.removeprefix("Bearer ")

    async def _verify():
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{settings.supabase_url}/auth/v1/user",
                headers={
                    "apikey": settings.supabase_anon_key,
                    "Authorization": f"Bearer {token}",
                },
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid token")
            return resp.json()["id"]

    try:
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(_verify())
    except RuntimeError:
        import asyncio as _asyncio
        return _asyncio.run(_verify())


@router.post("", status_code=201)
async def create_event(body: EventCreate, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _get_client(settings)

    result = db.table("events").insert({
        "user_id": user_id,
        "title": body.title,
        "description": body.description,
        "event_date": body.event_date.isoformat() if body.event_date else None,
        "location": body.location,
        "color": body.color,
        "logo_url": body.logo_url,
        "settings": body.settings,
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create event")

    return result.data[0]


@router.get("")
async def list_events(authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _get_client(settings)

    result = db.table("events").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data or []


@router.get("/{event_id}")
async def get_event(event_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _get_client(settings)

    result = db.table("events").select("*").eq("id", event_id).eq("user_id", user_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found")

    return result.data[0]


@router.patch("/{event_id}")
async def update_event(event_id: str, body: EventUpdate, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _get_client(settings)

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        db.table("events")
        .update(updates)
        .eq("id", event_id)
        .eq("user_id", user_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found")

    return result.data[0]


@router.get("/{event_id}/qr")
async def get_qr(event_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _get_client(settings)

    # Verify ownership
    result = db.table("events").select("id").eq("id", event_id).eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found")

    qr_data = generate_qr_base64(event_id)
    event_url = get_event_url(event_id)

    return {"qr_base64": qr_data, "url": event_url, "event_id": event_id}


@router.get("/{event_id}/analytics")
async def get_analytics(event_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _get_client(settings)

    # Verify ownership
    event_result = db.table("events").select("id").eq("id", event_id).eq("user_id", user_id).execute()
    if not event_result.data:
        raise HTTPException(status_code=404, detail="Event not found")

    sessions_result = db.table("event_sessions").select("*").eq("event_id", event_id).execute()
    sessions = sessions_result.data or []

    posts_result = db.table("posts").select("id").eq("event_id", event_id).eq("status", "approved").execute()
    leads_result = db.table("leads").select("id").eq("event_id", event_id).execute()

    total_sessions = len(sessions)
    form_filled = sum(1 for s in sessions if s.get("form_filled"))

    return {
        "total_sessions": total_sessions,
        "form_filled": form_filled,
        "form_rate": round(form_filled / total_sessions * 100, 1) if total_sessions else 0,
        "total_posts": len(posts_result.data or []),
        "total_leads": len(leads_result.data or []),
    }


@router.get("/{event_id}/leads/export")
async def export_leads(event_id: str, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _get_client(settings)

    event_result = db.table("events").select("id").eq("id", event_id).eq("user_id", user_id).execute()
    if not event_result.data:
        raise HTTPException(status_code=404, detail="Event not found")

    leads_result = db.table("leads").select("*").eq("event_id", event_id).order("submitted_at").execute()
    leads = leads_result.data or []

    lines = ["name,phone,email,custom_ans,submitted_at"]
    for lead in leads:
        row = ",".join([
            _csv_escape(lead.get("name", "")),
            _csv_escape(lead.get("phone", "")),
            _csv_escape(lead.get("email", "")),
            _csv_escape(lead.get("custom_ans", "")),
            str(lead.get("submitted_at", "")),
        ])
        lines.append(row)

    csv_content = "\n".join(lines)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=leads_{event_id}.csv"},
    )


@router.post("/{event_id}/announce")
async def send_announcement(event_id: str, body: dict, authorization: str = Header(...)):
    settings = get_settings()
    user_id = await _async_get_user_id(authorization, settings)
    db = _get_client(settings)

    event_result = db.table("events").select("id").eq("id", event_id).eq("user_id", user_id).execute()
    if not event_result.data:
        raise HTTPException(status_code=404, detail="Event not found")

    message = body.get("message", "")
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    await broadcast(event_id, "ANNOUNCEMENT", {"msg": message})
    return {"ok": True}


def _csv_escape(value: str) -> str:
    """Escape a CSV cell value."""
    value = str(value).replace('"', '""')
    if "," in value or "\n" in value or '"' in value:
        return f'"{value}"'
    return value


async def _async_get_user_id(authorization: str, settings) -> str:
    """Verify Supabase JWT and return user_id (async)."""
    import httpx

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization")

    token = authorization.removeprefix("Bearer ")

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.supabase_url}/auth/v1/user",
            headers={
                "apikey": settings.supabase_anon_key,
                "Authorization": f"Bearer {token}",
            },
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return resp.json()["id"]
