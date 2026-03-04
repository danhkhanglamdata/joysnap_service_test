"""
Auth router — delegates to Supabase Auth.
Organizers authenticate via Supabase JWT (email + password).
Attendees do NOT authenticate — they use session tokens.
"""

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
import httpx

from backend.config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def _supabase_headers(settings) -> dict:
    return {
        "apikey": settings.supabase_anon_key,
        "Content-Type": "application/json",
    }


@router.post("/register")
async def register(body: RegisterRequest):
    settings = get_settings()
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.supabase_url}/auth/v1/signup",
            headers=_supabase_headers(settings),
            json={
                "email": body.email,
                "password": body.password,
                "data": {"full_name": body.full_name},
            },
        )

    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=400, detail=resp.json().get("error_description", "Registration failed"))

    return resp.json()


@router.post("/login")
async def login(body: LoginRequest):
    settings = get_settings()
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.supabase_url}/auth/v1/token?grant_type=password",
            headers=_supabase_headers(settings),
            json={"email": body.email, "password": body.password},
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    data = resp.json()
    return {
        "access_token": data.get("access_token"),
        "refresh_token": data.get("refresh_token"),
        "expires_in": data.get("expires_in"),
        "user": data.get("user"),
    }


@router.get("/me")
async def me(authorization: str = Header(...)):
    settings = get_settings()
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

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

    return resp.json()
