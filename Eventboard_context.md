\# 🎯 EVENTBOARD — AI CONTEXT DOCUMENT v1.0



> \*\*Dùng để:\*\* Brainstorm, thiết kế sản phẩm, giao dev team, pitch khách hàng  

> \*\*Version:\*\* 1.0 — Ngày 04/03/2026  

> \*\*Trạng thái:\*\* Giai đoạn thiết kế MVP



---



\## 📌 Tổng Quan Dự Án



| Hạng mục | Chi tiết |

|---|---|

| \*\*Tên sản phẩm\*\* | EventBoard \*(tên tạm)\* |

| \*\*Loại sản phẩm\*\* | B2B SaaS — Nền tảng tương tác sự kiện trực tiếp |

| \*\*Thị trường\*\* | Việt Nam → Đông Nam Á |

| \*\*Giai đoạn\*\* | Thiết kế + Build MVP |

| \*\*Công nghệ\*\* | Python FastAPI + React PWA + PostgreSQL + Redis |



---



\## 🔥 Vấn Đề Giải Quyết



\### Phía người tham dự

\- Thụ động, không có lý do tương tác

\- Không có kênh chia sẻ cảm xúc tập thể

\- Trải nghiệm nhạt nhẽo, dễ quên



\### Phía nhà tổ chức / thương hiệu

\- Thu lead thủ công, tỷ lệ thấp

\- Không có UGC từ sự kiện

\- Không đo được engagement thật sự



\### Phía MC / vận hành

\- Phụ thuộc kỹ thuật viên để điều khiển màn hình

\- Thiếu công cụ tương tác real-time tích hợp sẵn



---



\## 💡 Giải Pháp



EventBoard tạo ra \*\*"không gian tương tác số"\*\* cho sự kiện trực tiếp thông qua QR code.  

Người tham dự quét QR → truy cập ngay trên browser → không cần cài app.



\*\*3 lớp giá trị:\*\*

```

Lớp 1 — ENGAGEMENT ENGINE    → Moment Wall, Energy Bar, Lucky Spin, Poll, Q\&A

Lớp 2 — DATA ENGINE          → Lead Form, UGC Collection, Behavior Tracking

Lớp 3 — INTELLIGENCE LAYER   → Dashboard, Export CSV/ZIP, PDF Report

```



---



\## 👥 3 Nhóm Người Dùng



\### 1. Nhà Tổ Chức / Organizer (người mua)

\- Agency tổ chức sự kiện, marketing brand

\- Cần: Thu data, sự kiện WOW, đo ROI

\- Dùng: Setup Wizard, Dashboard, Export



\### 2. MC / Người Vận Hành (người dùng trực tiếp)

\- MC dẫn chương trình, event manager tại sự kiện

\- Cần: Kiểm soát sân khấu, không phụ thuộc kỹ thuật

\- Dùng: MC Control Panel (tablet/laptop)



\### 3. Người Tham Dự / Attendee (người dùng cuối)

\- Khách tham dự, nhân viên, khách hàng thương hiệu

\- Cần: Vui, có quà, được nhìn nhận, không phức tạp

\- Dùng: Attendee PWA trên điện thoại cá nhân



---



\## 🎮 Tính Năng Chi Tiết



\### Phía Người Tham Dự



\#### QR Join — Vào sự kiện tức thì

\- Quét QR → mở browser → vào ngay, \*\*không cài app, không tạo tài khoản\*\*

\- PWA hoạt động trên mọi mobile browser

\- Session lưu bằng localStorage + Cookie (không mất khi đóng tab)

\- Phục hồi session qua số điện thoại nếu mất token

\- Mục tiêu: từ quét QR đến vào wall \*\*< 30 giây\*\*



\#### Moment Wall — Bức tranh kỷ niệm tập thể

\- Feed ảnh/video real-time từ tất cả người tham dự

\- Đăng ảnh từ camera hoặc thư viện

\- \*\*Vibe Emoji\*\* thay caption: 🔥😂😭✨👏🎉 (không cần gõ chữ)

\- Ảnh nén tự động client-side trước khi upload

\- Cập nhật real-time qua WebSocket



\#### Lead Form — Thu thập thông tin tự nhiên

\- Tối đa 4 trường: Họ tên / SĐT / Email / Câu hỏi tùy chỉnh

\- Nhà tổ chức cấu hình thời điểm hiện form: khi vào / khi đăng ảnh / khi quay thưởng

\- Sau khi điền, không hỏi lại trong suốt sự kiện



\#### Energy Bar — Thử thách tập thể 🇻🇳

\- Thanh tiến trình % của toàn hội trường

\- Nhà tổ chức đặt mục tiêu (VD: "1000 ảnh")

\- Hiển thị trên điện thoại VÀ màn hình LED

\- Khi 100%: confetti, push notification, tự mở Lucky Spin

\- Milestone notifications: 50% / 80% / 100%



\#### Lucky Spin — Vòng quay may mắn 🇻🇳

\- Mở khi: Energy Bar 100% + đã điền form

\- Animation vòng quay với CSS/JS

\- Danh sách giải thưởng + xác suất do nhà tổ chức cấu hình

\- Mỗi người quay \*\*1 lần duy nhất\*\* (spinToken chống gian lận)



\#### Live Poll — Bình chọn trực tiếp 🇻🇳

\- MC tạo poll → push đến tất cả điện thoại ngay lập tức

\- Vote bằng 1 tap

\- Kết quả real-time dạng % và biểu đồ

\- Nhiều poll trong 1 sự kiện



\#### Q\&A Ẩn Danh 🇻🇳

\- Gửi câu hỏi cho diễn giả/MC

\- \*\*Tùy chọn ẩn danh hoàn toàn\*\* (phù hợp văn hóa VN)

\- Người khác upvote câu hỏi hay

\- MC duyệt trước khi hiển thị



\#### Phút Vàng — Burst Engagement

\- MC bấm → countdown 60 giây trên tất cả điện thoại

\- Hành động trong 60s = \*\*x2 điểm\*\* vào Energy Bar

\- Dùng khi ra mắt sản phẩm, DJ lên sân khấu, cần tăng nhiệt



---



\### Phía MC / Người Vận Hành



\#### MC Control Panel

Thiết kế: \*\*nút lớn, 1 tay, không cần đọc hướng dẫn\*\*



```

┌─────────────────────────────────────────────────────┐

│  ⚡ LIVE  |  👥 247 người  |  📸 312 ảnh           │

├─────────────────────────────────────────────────────┤

│  \[ 🔥 MỞ POLL ]    \[ ❓ MỞ Q\&A ]                   │

│  \[ ⚡ PHÚT VÀNG ]  \[ 🎰 QUAY THƯỞNG ]              │

│  \[ 📢 GỬI THÔNG BÁO ĐẾN TẤT CẢ ]                  │

├─────────────────────────────────────────────────────┤

│  DUYỆT ẢNH  \[✅ Duyệt] \[❌ Ẩn]                     │

│  LAYOUT LED: ● Wall  ○ Poll  ○ Leaderboard          │

└─────────────────────────────────────────────────────┘

```



\*\*6 nhóm chức năng:\*\*

1\. Live Status (người online, ảnh, Energy Bar %)

2\. Quick Actions (Spin, Phút Vàng, Thông báo)

3\. Content Moderation (duyệt/ẩn ảnh)

4\. Spotlight (chọn ảnh → phóng to LED + tên người đăng)

5\. Screen Layout (chọn layout màn hình chiếu)

6\. Poll \& Q\&A Manager



---



\### Phía Nhà Tổ Chức



\#### Event Setup Wizard — 4 bước, < 10 phút



```

Bước 1/4  Thông tin cơ bản (tên, ngày, logo, màu brand)

Bước 2/4  Bật/tắt tính năng + cấu hình từng tính năng

Bước 3/4  Cài đặt Gate (điều kiện mở khóa từng hoạt động)

Bước 4/4  Preview + Xuất bản → Nhận QR Code

```



\#### Playlist Gamification — Event Workflow Engine

\- Kéo thả sắp xếp thứ tự hoạt động

\- \*\*4 loại trigger:\*\*

&nbsp; - `manual\_mc` — MC bấm tay

&nbsp; - `auto\_after\_prev` — Tự động sau hoạt động trước

&nbsp; - `condition\_met` — Khi điều kiện đạt (Energy Bar 100%...)

&nbsp; - `scheduled` — Đúng giờ đặt trước

\- \*\*Gate config:\*\* điều kiện người dùng cần đáp ứng để tham gia



\#### Analytics Dashboard

\- Số người real-time, số ảnh, leads

\- Tỷ lệ điền form (conversion rate)

\- Activity timeline (giờ nào nhiều tương tác nhất)

\- Kết quả poll



\#### Export \& Deliverables

\- Lead list: \*\*Excel/CSV\*\*

\- UGC: \*\*ZIP ảnh/video\*\*

\- Báo cáo: \*\*PDF 1 trang\*\* số liệu + biểu đồ



---



\## 🏗️ Kiến Trúc Kỹ Thuật



\### Stack



```

Backend:   Python FastAPI (async, WebSocket native)

DB:        PostgreSQL (prod) / SQLite (dev)

ORM:       SQLAlchemy

Cache:     Redis (session cache + real-time counters)

Frontend:  React + Vite (PWA)

Realtime:  FastAPI WebSocket native

Storage:   Cloudinary (MVP) → AWS S3 (prod)

Hosting:   Railway (MVP) → AWS/GCP (prod)

QR Code:   qrcode library (Python)

```



\### Database Schema Cốt Lõi



```sql

events              -- Config, status, brand kit

event\_activities    -- Playlist gamification (JSONB config)

event\_sessions      -- Mỗi người tham dự = 1 session

leads               -- Thông tin form

posts               -- Moment Wall (ảnh/video)

polls               -- Live Poll

poll\_votes          -- 1 người 1 vote (UNIQUE constraint)

qa\_questions        -- Câu hỏi + upvote count

spin\_results        -- Kết quả spin (chống gian lận)

```



\### Event Activity Config (JSONB)



```json

// ENERGY\_BAR

{"target": 1000, "unit": "photos", "milestones": }\[1]



// LUCKY\_SPIN

{"prizes": \[{"label": "Voucher 500k", "prob": 0.05, "qty": 10}],

&nbsp;"spin\_limit": 1}



// LIVE\_POLL

{"question": "...", "options": \["A","B","C"], "duration": 60}



// GOLDEN\_MINUTE

{"duration": 60, "multiplier": 2, "applies\_to": "photos"}

```



\### Gate Config (JSONB)



```json

{

&nbsp; "logic": "AND",

&nbsp; "conditions": \[

&nbsp;   {"type": "form\_filled"},

&nbsp;   {"type": "event\_activity\_completed", "activity\_id": "act\_energy\_001"}

&nbsp; ]

}

```



\### WebSocket Broadcast Events



```

NEW\_POST        → Ảnh mới lên wall

ENERGY\_UPDATE   → Energy bar %

ENERGY\_FULL     → Đạt 100%, mở spin

SPIN\_OPENED     → MC mở spin thủ công

POLL\_STARTED    → Poll mới được tạo

POLL\_UPDATE     → Kết quả vote thay đổi

SPOTLIGHT       → MC spotlight ảnh

ANNOUNCEMENT    → Thông báo từ MC

```



\### Session (Không Đăng Nhập)



```

Lớp 1: localStorage + Cookie token    → 90% trường hợp

Lớp 2: SĐT lookup sau khi điền form  → 9% trường hợp

Lớp 3: Device fingerprint             → Edge case

Nguyên tắc: State lưu server, client chỉ là màn hình hiển thị

```



---



\## 📦 MVP Scope



\### ✅ Làm trong MVP

\- QR Join (PWA, không cài app)

\- Moment Wall real-time

\- Lead Form + Gate System

\- Energy Bar

\- Lucky Spin (chống gian lận)

\- Live Poll

\- Q\&A ẩn danh + upvote

\- Phút Vàng

\- MC Control Panel

\- Spotlight Moment

\- Announcement Push

\- Event Setup Wizard (4 bước)

\- Brand Kit (logo + màu)

\- Basic Analytics Dashboard

\- Export CSV leads

\- Session Restore



\### ❌ Không làm trong MVP

\- Upload ảnh thật (MVP: text + emoji)

\- App native iOS/Android

\- AI video recap

\- API public / Webhook

\- White-label tự phục vụ

\- Payment gateway

\- Tích hợp CRM

\- Livestream



---



\## ⏱️ Timeline 10 Tuần



| Tuần | Nội dung |

|---|---|

| 1-2 | Foundation: Auth, DB, Setup Wizard, QR, Lead Form, Gate |

| 3-4 | Moment Wall: Feed, WebSocket, Emoji, Session Restore |

| 5-6 | Gamification: Energy Bar, Lucky Spin, Phút Vàng |

| 7-8 | MC Tools: Control Panel, Poll, Q\&A, Spotlight, Announcement |

| 9 | Dashboard + Export CSV/ZIP/PDF |

| 10 | QA + Test thật (50-100 người) + Soft Launch |



\### Định Nghĩa Thành Công

\- QR → vào wall: \*\*< 30 giây\*\*

\- MC setup: \*\*< 15 phút training\*\*

\- Tạo event: \*\*< 10 phút\*\*

\- Tải 500 người đồng thời: \*\*không lag\*\*

\- Tỷ lệ điền form: \*\*> 60%\*\*



---



\## 💰 Mô Hình Kinh Doanh



\### Khách Hàng B2B

\- \*\*Primary:\*\* Event agency HCM + Hà Nội

\- \*\*Secondary:\*\* Marketing brand (FMCG, ngân hàng, bất động sản, ô tô)



\### Pricing



| Gói | Giá | Phù hợp |

|---|---|---|

| Starter | 2-3 triệu/event | Agency nhỏ, < 200 người |

| Pro | 6-10 triệu/event | Brand activation, 200-1000 người |

| Enterprise | Thỏa thuận | Sự kiện 1000+ người |



\### Mô Hình Agency

\- White-label: Agency đặt logo, tự báo giá khách

\- Revenue share: Bạn báo giá, chia 15-20% cho agency

\- License: Agency mua license, tự bán lại



---



\## 🇻🇳 Phù Hợp Văn Hóa Việt Nam



| Tính năng | Lý do phù hợp VN |

|---|---|

| Energy Bar tập thể | "Cùng nhau làm" — tinh thần tập thể |

| Lucky Spin | Văn hóa bốc thăm trúng thưởng đã quen |

| Spotlight + gọi tên | Người Việt thích được công nhận trước đám đông |

| Q\&A ẩn danh | Ngại hỏi trực tiếp, sợ mất mặt |

| Live Poll | Thích đưa ý kiến khi không chịu trách nhiệm cá nhân |

| Phút Vàng | Thích đua tranh ngắn hạn, có đếm ngược rõ ràng |



---



\## 🚀 Go-to-Market 6 Tháng Đầu



```

Tháng 1-2   "Đổi event lấy case study"

&nbsp;           → 5 MC qua Facebook Group "Cộng đồng MC Tổ Chức Sự Kiện"

&nbsp;           → Miễn phí 3 event đổi lấy video + số liệu thật



Tháng 2-3   "Pilot có phí"

&nbsp;           → 10 agency nhỏ, giá 1-2 triệu/event

&nbsp;           → Mục tiêu: 3-5 agency trả tiền



Tháng 3-4   "Agency Tier A"

&nbsp;           → Pitch Á Châu Event, VIETLINK, B2 Event

&nbsp;           → Mô hình white-label hoặc revenue share



Tháng 4-6   "Scale trước mùa YEP"

&nbsp;           → Launch MC Partner Program

&nbsp;           → Chuẩn bị peak season tháng 11-12

&nbsp;           → Mục tiêu: 10+ event/tháng

```



---



\## ⚠️ Rủi Ro Và Giải Pháp



| Rủi ro | Giải pháp |

|---|---|

| Wifi hội trường yếu | Nén ảnh client-side, offline queue, tư vấn router riêng |

| MC không biết dùng | UI đơn giản, onboarding video 5 phút, support Zalo |

| User không điền form | Cho xem wall trước, hỏi info khi muốn quay thưởng |

| Spin gian lận | spinToken 1 lần + server-side validation |

| Cạnh tranh "tự làm thủ công" | UX phải đẳng cấp hơn hẳn Google Form + TV ghép |



---



\## 🔮 Roadmap Tương Lai



\### Phase 2 (Tháng 3-8)

\- Upload ảnh/video thật

\- Leaderboard cá nhân real-time

\- Mission Board (nhiệm vụ cá nhân)

\- AI filter ảnh không phù hợp

\- Thank You Email tự động



\### Phase 3 (Tháng 8-18)

\- Mosaic Wall (ghép ảnh thành hình logo)

\- Live Lucky Draw kịch tính

\- Team Battle (đội vs đội)

\- Hidden QR Hunt trong venue

\- Webhook / API public → tích hợp CRM

\- Zalo OA integration

\- White-label tự phục vụ



---



\*Document version 1.0 — EventBoard MVP Context\*  

\*Tạo ngày 04/03/2026\*



