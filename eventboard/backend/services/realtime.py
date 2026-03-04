"""
Supabase Realtime Broadcast service.

Vercel Serverless can't hold persistent WebSocket connections, so we use
Supabase Realtime Broadcast via a single HTTP POST. Supabase handles
delivering the event to all subscribed clients over WebSocket.
"""

import httpx
from backend.config import get_settings


async def broadcast(event_id: str, event_type: str, payload: dict) -> None:
    """Broadcast an event to all attendees of an event via Supabase Realtime."""
    settings = get_settings()

    if not settings.supabase_url or not settings.supabase_service_role_key:
        # Skip broadcast in dev if not configured
        return

    async with httpx.AsyncClient(timeout=5.0) as client:
        await client.post(
            f"{settings.supabase_url}/realtime/v1/api/broadcast",
            headers={
                "Authorization": f"Bearer {settings.supabase_service_role_key}",
                "Content-Type": "application/json",
                "apikey": settings.supabase_service_role_key,
            },
            json={
                "messages": [
                    {
                        "topic": f"event:{event_id}",
                        "event": event_type,
                        "payload": payload,
                    }
                ]
            },
        )
