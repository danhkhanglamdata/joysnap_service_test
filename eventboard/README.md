# EventBoard MVP

B2B SaaS platform for live event interaction — QR scan → browser → no app install.

## Stack

| Layer | Technology |
|---|---|
| Backend | Python FastAPI (Vercel Serverless) |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (Organizer JWT) |
| Realtime | Supabase Realtime Broadcast |
| Frontend | React + Vite (PWA) |
| Hosting | Vercel (free tier) |

## Quick Start

### 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in the SQL Editor:
   ```
   supabase/migrations/001_init.sql
   ```
3. Copy your project URL and keys

### 2. Backend (local dev)

```bash
cd eventboard
pip install -r backend/requirements.txt
cp .env.example .env   # fill in Supabase keys

# Run locally
uvicorn backend.api.index:app --reload --port 8000
```

### 3. Frontend (local dev)

```bash
cd frontend
npm install
cp ../.env.example .env.local   # fill in VITE_SUPABASE_*
npm run dev   # runs at http://localhost:3000
```

### 4. Deploy to Vercel

```bash
# From eventboard/ root
vercel --prod
```

Set environment variables in Vercel Dashboard (Settings → Environment Variables):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `APP_URL` (your Vercel domain)

## Routes

| Path | Description |
|---|---|
| `/organizer/login` | Organizer login/register |
| `/organizer/dashboard` | Event list |
| `/organizer/events/new` | Event Setup Wizard |
| `/organizer/events/:id` | Edit event |
| `/organizer/events/:id/analytics` | Dashboard + Q&A moderation |
| `/e/:eventId` | Attendee entry (QR landing) |

## API Endpoints

See `EVENTBOARD_TECHNICAL_SPEC.md` for full API documentation.

## Project Structure

```
eventboard/
├── backend/          # FastAPI (Vercel Serverless)
│   ├── api/          # Entry point (index.py)
│   ├── routers/      # auth, events, activities, attendee, analytics
│   ├── services/     # gate, realtime, qr, spin, playlist
│   ├── models/       # Pydantic schemas
│   └── requirements.txt
├── frontend/         # React + Vite PWA
│   └── src/
│       ├── pages/Organizer/  # Login, Dashboard, EventSetup, Analytics
│       ├── pages/Attendee/   # EventEntry, Wall, EnergyBar, LuckySpin, Poll, QA
│       ├── hooks/            # useSession, useSupabaseRealtime
│       └── lib/              # supabase.ts, api.ts
├── supabase/
│   └── migrations/001_init.sql
└── vercel.json
```
