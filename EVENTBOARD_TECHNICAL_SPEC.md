# 🎯 EVENTBOARD — TECHNICAL SPEC MVP v1.0
> **Mục đích:** Tài liệu kỹ thuật để xây dựng MVP  
> **Version:** 1.0 — 04/03/2026  
> **Scope:** 2 tác nhân — Nhà Tổ Chức + Người Tham Dự (chưa có MC)  
> **Stack:** Python FastAPI + Supabase + Vercel + React PWA

---

## 👥 Hai Tác Nhân

### 1. Nhà Tổ Chức (Organizer)
- Tạo sự kiện, cấu hình tính năng, theo dõi số liệu
- Truy cập qua browser (desktop/laptop)
- Xác thực bằng Supabase Auth

### 2. Người Tham Dự (Attendee)
- Quét QR → vào ngay trên browser, không cài app, không tạo tài khoản
- Tương tác: điền form, đăng khoảnh khắc, tham gia gamification
- Session lưu qua localStorage + Cookie (không đăng nhập)

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌──────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                 │
│                                                                  │
│  PostgreSQL ──── Toàn bộ dữ liệu (events, sessions, posts...)   │
│  Auth       ──── JWT cho Organizer (email/password)             │
│  Realtime   ──── Broadcast WebSocket thay custom WS server      │
│  Storage    ──── Upload ảnh (Phase 2)                           │
└───────────────────────┬──────────────────────────────────────────┘
                        │ Supabase JS SDK + REST API
          ┌─────────────┴──────────────┐
          ▼                            ▼
┌──────────────────┐       ┌──────────────────────────┐
│  FastAPI Backend │       │  React Frontend (PWA)    │
│  (Vercel        │       │  (Vercel)                │
│   Serverless)   │       │                          │
│                  │       │  /organizer/**           │
│  REST API only   │       │  /e/{eventId}  (PWA)    │
│  Không cần WS    │       │                          │
└──────────────────┘       └──────────────────────────┘
```

### Tại Sao Không Dùng Custom WebSocket?

Vercel chạy theo mô hình **Serverless Functions** — function tắt ngay sau khi xử lý
xong request. WebSocket cần kết nối persistent nên **không hoạt động trên Vercel**.

→ Giải pháp: dùng **Supabase Realtime Broadcast** thay thế hoàn toàn.

Backend chỉ cần gọi 1 HTTP request đến Supabase để broadcast — Supabase tự
phân phối WebSocket đến tất cả clients đang lắng nghe.

---

## 🛠️ Tech Stack

```
Backend:    Python FastAPI (Serverless, deploy Vercel)
Database:   Supabase PostgreSQL
Auth:       Supabase Auth (Organizer)
Realtime:   Supabase Realtime Broadcast (thay WebSocket tự build)
Storage:    Supabase Storage (Phase 2, MVP chưa cần)
Frontend:   React + Vite (PWA, deploy Vercel)
QR Code:    qrcode[pil] (Python)
Session:    sessionToken tự sinh (Attendee, không cần login)
Hosting:    Vercel (cả frontend lẫn backend API)
```

### Chi Phí Free Tier

| Service | Free Tier | Đủ MVP? |
|---|---|---|
| Supabase | 500MB DB, 200K Realtime msg/tháng | ✅ |
| Vercel | Unlimited deploy, 100GB bandwidth | ✅ |
| **Tổng** | **$0/tháng** | ✅ |

---

## ⚡ Supabase Realtime — Thay Thế WebSocket

### Backend gửi broadcast (Python)

```python
import httpx, os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

async def broadcast(event_id: str, event_type: str, payload: dict):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{SUPABASE_URL}/realtime/v1/api/broadcast",
            headers={
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "messages": [{
                    "topic":   f"event:{event_id}",
                    "event":   event_type,
                    "payload": payload,
                }]
            }
        )
```

### Frontend lắng nghe (React + Supabase JS SDK)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const channel = supabase.channel(`event:${eventId}`)

channel
  .on('broadcast', { event: 'NEW_POST' },      ({ payload }) => addPostToWall(payload))
  .on('broadcast', { event: 'ENERGY_UPDATE' }, ({ payload }) => updateEnergyBar(payload))
  .on('broadcast', { event: 'ENERGY_FULL' },   ({ payload }) => showConfetti())
  .on('broadcast', { event: 'SPIN_OPENED' },   ({ payload }) => showSpinModal(payload.msg))
  .on('broadcast', { event: 'POLL_STARTED' },  ({ payload }) => renderPoll(payload.poll))
  .on('broadcast', { event: 'POLL_UPDATE' },   ({ payload }) => updatePollResults(payload))
  .on('broadcast', { event: 'ANNOUNCEMENT' },  ({ payload }) => showToast(payload.msg))
  .subscribe()
```

### Broadcast Events Toàn Bộ

| Event | Trigger | Payload |
|---|---|---|
| `NEW_POST` | Attendee đăng khoảnh khắc | `{post, energy}` |
| `ENERGY_UPDATE` | Energy bar thay đổi | `{current, target, pct}` |
| `ENERGY_MILESTONE` | Đạt 50% / 80% | `{pct, message}` |
| `ENERGY_FULL` | Đạt 100% | `{message}` |
| `SPIN_OPENED` | Energy 100% hoặc Organizer kích hoạt | `{msg}` |
| `ACTIVITY_STARTED` | Organizer bật activity | `{activity}` |
| `POLL_STARTED` | Poll mới được tạo | `{poll}` |
| `POLL_UPDATE` | Ai đó vote | `{poll_id, results}` |
| `ANNOUNCEMENT` | Organizer gửi thông báo | `{msg}` |

---

## 🧩 Tính Năng MVP

### Phía Nhà Tổ Chức

#### 1. Auth — Supabase Auth
- Đăng ký / đăng nhập bằng email + password
- Supabase Auth tự quản lý JWT — không cần tự build auth logic
- Row Level Security (RLS) để bảo vệ data của từng organizer

#### 2. Event Setup Wizard — 4 bước
```
Bước 1  Thông tin cơ bản
        Tên sự kiện / Ngày giờ / Địa điểm

Bước 2  Brand Kit
        Upload logo / Chọn màu chủ đạo (hex color)

Bước 3  Cấu hình tính năng
        Bật/tắt: Moment Wall / Energy Bar / Lucky Spin / Live Poll / Q&A
        Cấu hình từng tính năng (target, giải thưởng, câu hỏi poll...)

Bước 4  Gate Config + Xuất bản
        Điều kiện mở khóa từng tính năng
        → Tạo QR Code + link chia sẻ
```

#### 3. Playlist Gamification — Event Workflow Engine
- Kéo thả sắp xếp thứ tự các hoạt động
- **Trigger types:**
  - `manual` — Organizer bấm kích hoạt từ dashboard
  - `auto_after_prev` — Tự động sau activity trước kết thúc
  - `condition_met` — Khi điều kiện đạt (VD: Energy Bar 100%)
- Moment Wall luôn chạy nền, không nằm trong sequence

#### 4. Organizer Dashboard — Real-time
- Số người tham dự đang online
- Số posts đã đăng, số leads thu thập
- Tỷ lệ điền form (%)
- Energy Bar % (cập nhật real-time qua Supabase Realtime)
- Danh sách posts mới nhất
- Nút kích hoạt thủ công từng activity
- Gửi Announcement đến toàn bộ attendees

#### 5. Export
- Danh sách leads: CSV (tên, SĐT, email, thời gian)
- Danh sách posts: CSV

---

### Phía Người Tham Dự

#### 1. QR Join — Vào sự kiện
- Quét QR → URL: `/e/{eventId}`
- Không cần tài khoản, không cài app (PWA)
- Server tạo `sessionToken` → lưu vào `localStorage` + `httpOnly Cookie`
- Mất session → nhập SĐT để khôi phục

#### 2. Lead Form — Điền thông tin
- Tối đa 4 trường: Họ tên / SĐT / Email / Câu hỏi tùy chỉnh
- Thời điểm hiển thị do organizer cấu hình qua Gate Config
- Sau khi điền, không hỏi lại (`form_filled = true` trong session)

#### 3. Moment Wall — Chia sẻ khoảnh khắc
- Feed text + emoji real-time từ tất cả người tham dự
- Chọn **Vibe Emoji**: 🔥😂😭✨👏🎉 (không cần gõ chữ)
- *(MVP: chưa upload ảnh thật)*
- Supabase Realtime broadcast `NEW_POST` → cập nhật ngay trên tất cả thiết bị

#### 4. Energy Bar — Thử thách tập thể
- Thanh tiến trình % toàn hội trường
- Mỗi post → +1 vào counter (lưu Redis hoặc Supabase counter)
- Organizer đặt mục tiêu (VD: 100 posts)
- Milestones toast: 50% / 80% / 100%
- Khi 100%: confetti animation + broadcast `ENERGY_FULL` + tự mở Lucky Spin

#### 5. Lucky Spin — Vòng quay may mắn
- Mở khi điều kiện gate đạt
- Animation vòng quay CSS/JS phía client
- Server random kết quả, **không tin client**
- `spinToken` chống gian lận: `UNIQUE(activity_id, session_id)`

#### 6. Live Poll — Bình chọn
- Organizer kích hoạt từ dashboard → broadcast `POLL_STARTED` tới tất cả điện thoại
- Vote 1 tap
- 1 người 1 vote (`UNIQUE constraint` trong DB)
- Kết quả real-time qua broadcast `POLL_UPDATE`

#### 7. Q&A Ẩn Danh
- Gửi câu hỏi, tùy chọn ẩn danh hoàn toàn
- Người khác upvote
- Organizer xem từ dashboard, sắp xếp theo upvote

---

## 🗄️ Database Schema (Supabase PostgreSQL)

### Table: `users` — Supabase Auth tự quản lý
```sql
-- Bảng auth.users do Supabase tạo tự động
-- Thêm bảng public.profiles để lưu thông tin bổ sung

CREATE TABLE public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `events`
```sql
CREATE TABLE events (
  id          TEXT PRIMARY KEY DEFAULT substr(md5(random()::text), 1, 8),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  color       VARCHAR(7) DEFAULT '#6C63FF',
  logo_url    TEXT,
  status      TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','ended')),
  settings    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS: chỉ owner thấy event của mình
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner_only" ON events
  USING (auth.uid() = user_id);
```

### Table: `event_activities` — Playlist gamification
```sql
CREATE TABLE event_activities (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  type           TEXT NOT NULL,
  -- MOMENT_WALL | ENERGY_BAR | LUCKY_SPIN | LIVE_POLL | QA_SESSION
  title          TEXT,
  position       INTEGER NOT NULL DEFAULT 0,
  status         TEXT DEFAULT 'waiting'
                 CHECK (status IN ('waiting','active','completed','skipped')),
  config         JSONB NOT NULL DEFAULT '{}',
  trigger_type   TEXT DEFAULT 'manual'
                 CHECK (trigger_type IN ('manual','auto_after_prev','condition_met')),
  trigger_config JSONB DEFAULT '{}',
  gate_config    JSONB DEFAULT '{}',
  started_at     TIMESTAMPTZ,
  ended_at       TIMESTAMPTZ
);
```

```jsonc
// config examples:

// ENERGY_BAR:
{
  "target": 100,
  "unit": "posts",
  "milestones": [
    {"at": 50, "msg": "Hơn nửa rồi! 🔥"},
    {"at": 80, "msg": "Gần tới đích rồi! 💪"},
    {"at": 100, "msg": "🎉 Đạt mục tiêu!"}
  ]
}

// LUCKY_SPIN:
{
  "prizes": [
    {"id": "p1", "label": "Voucher 500k", "prob": 0.05, "qty": 5},
    {"id": "p2", "label": "Voucher 200k", "prob": 0.15, "qty": 20},
    {"id": "p3", "label": "Thử lại",      "prob": 0.50, "qty": 999}
  ],
  "spin_limit": 1
}

// LIVE_POLL:
{
  "question": "Sản phẩm nào bạn thích nhất?",
  "options": ["Sản phẩm A", "Sản phẩm B", "Sản phẩm C"],
  "duration_seconds": 60
}

// QA_SESSION:
{
  "allow_anonymous": true,
  "allow_upvote": true,
  "mc_approve": false
}

// trigger_config (condition_met):
{
  "activity_id": "uuid-of-energy-bar",
  "metric": "pct",
  "op": ">=",
  "value": 100
}

// gate_config:
{
  "logic": "AND",
  "conditions": [
    {"type": "form_filled"},
    {"type": "activity_completed", "activity_id": "uuid-of-energy-bar"}
  ]
}
```

### Table: `event_sessions` — Mỗi người tham dự
```sql
CREATE TABLE event_sessions (
  id             TEXT PRIMARY KEY DEFAULT substr(md5(random()::text), 1, 20),
  event_id       TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  session_token  TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  device_fp      TEXT,
  name           VARCHAR(100),
  phone          VARCHAR(20),
  email          VARCHAR(255),
  custom_field   TEXT,
  form_filled    BOOLEAN DEFAULT false,
  spin_used      BOOLEAN DEFAULT false,
  post_count     INTEGER DEFAULT 0,
  points         INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now(),
  last_active_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `posts` — Moment Wall
```sql
CREATE TABLE posts (
  id           TEXT PRIMARY KEY DEFAULT substr(md5(random()::text), 1, 8),
  event_id     TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  session_id   TEXT NOT NULL REFERENCES event_sessions(id),
  activity_id  UUID REFERENCES event_activities(id),
  author_name  VARCHAR(100) DEFAULT 'Khách mời',
  content      TEXT DEFAULT '',
  vibe_emoji   VARCHAR(10) DEFAULT '🔥',
  media_url    TEXT,   -- null trong MVP
  status       TEXT DEFAULT 'approved' CHECK (status IN ('approved','pending','hidden')),
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

### Table: `leads`
```sql
CREATE TABLE leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  session_id   TEXT NOT NULL REFERENCES event_sessions(id),
  name         VARCHAR(100),
  phone        VARCHAR(20),
  email        VARCHAR(255),
  custom_ans   TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `spin_results`
```sql
CREATE TABLE spin_results (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id  UUID NOT NULL REFERENCES event_activities(id),
  session_id   TEXT NOT NULL REFERENCES event_sessions(id),
  prize_id     TEXT,
  prize_label  TEXT,
  spun_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (activity_id, session_id)  -- chống spin 2 lần
);
```

### Table: `poll_votes`
```sql
CREATE TABLE poll_votes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id  UUID NOT NULL REFERENCES event_activities(id),
  session_id   TEXT NOT NULL REFERENCES event_sessions(id),
  option_index INTEGER NOT NULL,
  voted_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (activity_id, session_id)  -- 1 người 1 vote
);
```

### Table: `qa_questions`
```sql
CREATE TABLE qa_questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id   UUID NOT NULL REFERENCES event_activities(id),
  session_id    TEXT NOT NULL REFERENCES event_sessions(id),
  question_text TEXT NOT NULL,
  is_anonymous  BOOLEAN DEFAULT false,
  upvote_count  INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'visible' CHECK (status IN ('visible','hidden','featured')),
  submitted_at  TIMESTAMPTZ DEFAULT now()
);
```

### Table: `energy_counters` — Realtime Counter
```sql
CREATE TABLE energy_counters (
  activity_id  UUID PRIMARY KEY REFERENCES event_activities(id),
  current      INTEGER DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔌 API Endpoints (FastAPI — Serverless trên Vercel)

### Auth — Delegate cho Supabase
```
POST  /auth/register     Gọi Supabase Auth signup
POST  /auth/login        Gọi Supabase Auth signin → trả JWT
GET   /auth/me           Verify JWT, trả user info
```

### Events (Organizer)
```
POST   /events                       Tạo event mới
GET    /events                       Danh sách events của user
GET    /events/{id}                  Chi tiết event + config
PATCH  /events/{id}                  Cập nhật settings
GET    /events/{id}/qr               QR code dạng base64 PNG
GET    /events/{id}/analytics        Số liệu dashboard
GET    /events/{id}/leads/export     Export CSV leads
GET    /events/{id}/posts            Danh sách posts
POST   /events/{id}/announce         Gửi announcement (broadcast Supabase)
```

### Activities (Organizer)
```
POST   /events/{id}/activities                    Thêm activity vào playlist
GET    /events/{id}/activities                    Danh sách activities
PATCH  /events/{id}/activities/{actId}            Cập nhật config
DELETE /events/{id}/activities/{actId}            Xóa
PATCH  /events/{id}/activities/reorder            Đặt lại thứ tự [{id, position}]
POST   /events/{id}/activities/{actId}/start      Kích hoạt thủ công
POST   /events/{id}/activities/{actId}/end        Kết thúc thủ công
```

### Q&A (Organizer quản lý)
```
GET    /events/{id}/qa               Danh sách câu hỏi, sắp xếp theo upvote
PATCH  /events/{id}/qa/{qId}         Đổi status (visible / hidden / featured)
```

### Attendee
```
GET    /e/{eventId}                      Load thông tin event (PWA entry)
POST   /e/{eventId}/session              Tạo mới hoặc restore session
GET    /e/{eventId}/state                Toàn bộ state hiện tại (activities, feed...)
POST   /e/{eventId}/form                 Submit lead form
POST   /e/{eventId}/posts                Đăng khoảnh khắc lên wall
POST   /e/{eventId}/check-gate          Kiểm tra gate trước khi thực hiện action
POST   /e/{eventId}/spin                 Quay Lucky Spin
POST   /e/{eventId}/vote                 Vote poll
POST   /e/{eventId}/qa                   Gửi câu hỏi Q&A
POST   /e/{eventId}/qa/{qId}/upvote      Upvote câu hỏi
```

---

## 🔐 Gate System — Logic Kiểm Tra Điều Kiện

```python
# services/gate.py

def check_gate(session: dict, activity: dict, db) -> dict:
    gate = activity.get("gate_config", {})
    conditions = gate.get("conditions", [])

    if not conditions:
        return {"allowed": True, "missing": []}

    results = []
    for cond in conditions:
        ctype = cond["type"]

        if ctype == "form_filled":
            results.append(session["form_filled"])

        elif ctype == "activity_completed":
            target = db.get_activity(cond["activity_id"])
            results.append(target and target["status"] == "completed")

        elif ctype == "post_count":
            results.append(session["post_count"] >= cond.get("min", 1))

    logic   = gate.get("logic", "AND")
    allowed = all(results) if logic == "AND" else any(results)

    return {
        "allowed": allowed,
        "missing": [
            c["type"] for c, r in zip(conditions, results) if not r
        ]
    }
```

---

## 🔄 Session Management (Attendee — Không Đăng Nhập)

```
Lớp 1: localStorage + Cookie sessionToken  → xử lý 90% trường hợp
Lớp 2: SĐT lookup (sau khi điền form)      → xử lý 9% trường hợp
Lớp 3: Device fingerprint                  → edge case

Nguyên tắc: State lưu trên Supabase, client chỉ là màn hình hiển thị
```

### Flow Tạo Session Lần Đầu
```
GET /e/{eventId}
  → Client kiểm tra localStorage["tok_{eventId}"]
  → Không có: POST /e/{eventId}/session → nhận token mới
  → Lưu token vào localStorage + Cookie (httpOnly, SameSite=Strict, 24h)
```

### Flow Khôi Phục Session
```
POST /e/{eventId}/session  { token: "token-from-localStorage" }

Server:
  1. Tìm session theo token trong Supabase → trả về state
  2. Không tìm thấy → kiểm tra device fingerprint
  3. Vẫn không có → tạo session mới
```

### Flow Khôi Phục Qua SĐT
```
POST /e/{eventId}/session/recover  { phone: "0901234567" }

Server:
  → Tìm lead có phone = số này trong event này
  → Tìm thấy: lấy session, cấp token mới
  → Không thấy: tạo session mới
```

---

## 📁 Cấu Trúc Project

```
eventboard/
│
├── backend/                         ← FastAPI (deploy Vercel Serverless)
│   ├── api/
│   │   ├── index.py                 ← Entry point (Vercel handler)
│   │   └── vercel.json              ← Vercel routing config
│   ├── routers/
│   │   ├── auth.py                  ← Delegate Supabase Auth
│   │   ├── events.py                ← Organizer: CRUD events
│   │   ├── activities.py            ← Playlist management
│   │   ├── attendee.py              ← Attendee-facing APIs
│   │   └── analytics.py            ← Dashboard data + export
│   ├── services/
│   │   ├── gate.py                  ← check_gate() logic
│   │   ├── playlist.py              ← Workflow engine
│   │   ├── spin.py                  ← Lucky spin random
│   │   ├── qr.py                    ← QR generation
│   │   └── realtime.py              ← broadcast() via Supabase REST
│   ├── models/                      ← Pydantic schemas
│   ├── config.py                    ← Env vars (SUPABASE_URL, keys...)
│   └── requirements.txt
│
├── frontend/                        ← React + Vite PWA (deploy Vercel)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Organizer/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Dashboard.tsx    ← Real-time via Supabase JS SDK
│   │   │   │   ├── EventSetup.tsx   ← Wizard 4 bước
│   │   │   │   └── Analytics.tsx
│   │   │   └── Attendee/
│   │   │       ├── EventEntry.tsx   ← QR landing, session init
│   │   │       ├── Wall.tsx         ← Moment Wall
│   │   │       ├── EnergyBar.tsx
│   │   │       ├── LuckySpin.tsx
│   │   │       ├── Poll.tsx
│   │   │       └── QA.tsx
│   │   ├── hooks/
│   │   │   ├── useSupabaseRealtime.ts  ← Supabase channel subscription
│   │   │   └── useSession.ts          ← localStorage + restore logic
│   │   ├── lib/
│   │   │   └── supabase.ts            ← createClient()
│   │   └── components/
│   ├── public/
│   │   └── manifest.json             ← PWA manifest
│   └── vite.config.ts
│
├── supabase/
│   ├── migrations/                   ← SQL migration files
│   │   └── 001_init.sql
│   └── seed.sql                      ← Dữ liệu test
│
└── vercel.json                       ← Routing: /api/* → backend, /* → frontend
```

### vercel.json — Route Config
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/backend/api/index.py" },
    { "source": "/(.*)",       "destination": "/frontend/dist/$1" }
  ]
}
```

### Env Variables (Vercel Dashboard)
```
SUPABASE_URL                  https://xxxx.supabase.co
SUPABASE_ANON_KEY             eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY     eyJhbGci...  (chỉ dùng ở backend)
VITE_SUPABASE_URL             https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY        eyJhbGci...
```

---

## 🎯 Định Nghĩa Done — MVP Thành Công

| Tiêu chí | Mục tiêu |
|---|---|
| QR → vào wall lần đầu | < 30 giây |
| Tạo event xong + có QR | < 10 phút |
| Tải đồng thời | 500 người không lag |
| Tỷ lệ điền form | > 60% |
| Session restore | Đóng tab → mở lại đúng trạng thái |
| Spin chống gian lận | 1 người không quay được 2 lần |
| Chi phí hosting | $0/tháng (free tier) |

---

*EVENTBOARD Technical Spec MVP v1.0 — 04/03/2026*  
*Stack: Python FastAPI + Supabase + Vercel + React PWA*
