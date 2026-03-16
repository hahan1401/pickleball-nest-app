# Pickleball App — Backend API

Backend API cho ứng dụng quản lý giải đấu Pickleball, xây dựng trên **NestJS** + **TypeORM** + **PostgreSQL**.

---

## Tech Stack

| Thành phần | Công nghệ |
|-----------|-----------|
| Framework | NestJS 10 (Node.js + Express) |
| Language | TypeScript |
| ORM | TypeORM |
| Database | PostgreSQL |
| Cache | Redis |
| Realtime | Socket.io (WebSocket Gateways) |
| Auth | JWT + Passport |
| Storage | Cloudinary |
| Push Notification | Firebase Cloud Messaging (FCM) |
| Queue / Async Jobs | BullMQ (Redis-based) |

---

## Kiến Trúc Tổng Thể

```
┌─────────────────┐     ┌─────────────────┐
│  React (Web)    │     │  React Native   │
│  Vite + TS      │     │  Expo + TS      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │     REST API + WebSocket (Socket.io)
         │                       │
         └──────────┬────────────┘
                    │
         ┌──────────▼────────────┐
         │    NestJS Backend     │
         │   (pickleball-api)    │
         └──────────┬────────────┘
                    │
       ┌────────────┼────────────┐
       │            │            │
  ┌────▼───┐  ┌────▼───┐  ┌────▼──────┐
  │Postgres│  │ Redis  │  │Cloudinary │
  │  (DB)  │  │(Cache) │  │ (Storage) │
  └────────┘  └────────┘  └───────────┘
```

---

## Cấu Trúc Thư Mục

```
src/
├── main.ts                          # Bootstrap app
├── app.module.ts                    # Root module — khai báo tất cả modules
├── app.controller.ts                # Health check endpoint
│
├── modules/                         # Feature modules (business logic)
│   ├── auth/                        # M1 — Xác thực
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts       # POST /api/auth/social, /register, /login
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts      # Passport JWT strategy
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       └── login.dto.ts
│   │
│   ├── users/                       # M1 — Hồ sơ người dùng
│   │   ├── users.module.ts
│   │   ├── users.controller.ts      # GET/PUT /api/users/me, follows
│   │   ├── users.service.ts
│   │   └── dto/
│   │       └── update-profile.dto.ts
│   │
│   ├── tournaments/                 # M2 — Quản lý giải đấu
│   │   ├── tournaments.module.ts
│   │   ├── tournaments.controller.ts # CRUD giải, participants, groups, teams
│   │   ├── tournaments.service.ts
│   │   └── dto/
│   │       ├── create-tournament.dto.ts
│   │       └── update-tournament.dto.ts
│   │
│   ├── matches/                     # M3 — Trận đấu & ghi điểm
│   │   ├── matches.module.ts
│   │   ├── matches.controller.ts    # Score submission, standings, results
│   │   ├── matches.service.ts
│   │   └── dto/
│   │       └── submit-score.dto.ts
│   │
│   ├── notifications/               # M7 — Thông báo
│   │   ├── notifications.module.ts
│   │   ├── notifications.controller.ts
│   │   └── notifications.service.ts
│   │
│   ├── community/                   # M5 — Game cộng đồng (Phase 2)
│   │   ├── community.module.ts
│   │   ├── community.controller.ts
│   │   └── community.service.ts
│   │
│   └── chat/                        # M6 — Chat (Phase 2)
│       ├── chat.module.ts
│       ├── chat.controller.ts
│       └── chat.service.ts
│
├── domain/                          # Domain layer — entities & enums
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── tournament.entity.ts
│   │   ├── participant.entity.ts
│   │   ├── team.entity.ts
│   │   ├── tournament-group.entity.ts
│   │   ├── group-member.entity.ts
│   │   ├── match.entity.ts
│   │   └── notification.entity.ts
│   └── enums/
│       ├── tournament-type.enum.ts    # SINGLES | DOUBLES
│       ├── tournament-status.enum.ts  # DRAFT → OPEN → READY → IN_PROGRESS → COMPLETED
│       ├── scoring-format.enum.ts     # BEST_OF_1 | BEST_OF_3
│       ├── participant-status.enum.ts # CONFIRMED | INVITED_PENDING | REQUEST_PENDING | REJECTED
│       └── match-status.enum.ts       # SCHEDULED | IN_PROGRESS | COMPLETED | WALKOVER
│
├── infrastructure/                  # External services
│   ├── database/
│   │   └── data-source.ts           # TypeORM DataSource (dùng cho migration CLI)
│   ├── redis/
│   │   └── redis.service.ts         # Cache: standings, dashboard
│   ├── storage/
│   │   └── cloudinary.service.ts    # Upload avatar (256x256), banner (1200x630)
│   └── fcm/
│       └── fcm.service.ts           # Firebase push notifications
│
├── gateways/                        # WebSocket (Socket.io) — realtime
│   ├── tournament.gateway.ts        # namespace /tournament — live score, standings
│   ├── chat.gateway.ts              # namespace /chat — messages, typing indicator
│   └── notification.gateway.ts     # namespace /notification — realtime alerts
│
├── queues/                          # Async background jobs (BullMQ)
│   ├── standings.processor.ts       # Tính lại BXH sau khi nhập điểm
│   └── notification.processor.ts   # Gửi FCM push async
│
└── common/                          # Shared utilities
    ├── guards/
    │   ├── jwt-auth.guard.ts        # Bảo vệ endpoint cần đăng nhập
    │   └── roles.guard.ts           # Phân quyền theo role
    ├── decorators/
    │   └── current-user.decorator.ts # @CurrentUser() — lấy user từ JWT
    ├── filters/
    │   └── http-exception.filter.ts  # Chuẩn hóa error response
    └── interceptors/
        └── transform.interceptor.ts  # Wrap response: { data: ... }
```

---

## Domain Model

```
User ──────────────────────── Tournament (creator)
  │                                │
  │                           Participant ── (invited / requested / confirmed)
  │                                │
  │                             Team  (doubles only)
  │                                │
  │                        TournamentGroup  (A, B, C, D)
  │                                │
  │                          GroupMember ── Match (Round Robin)
  │
  ├── Follows  (follower ↔ following)
  ├── Notification
  ├── CommunityGame ── GameParticipant   [Phase 2]
  └── ChatRoom ── ChatMember ── Message  [Phase 2]
```

---

## Module Map

| Module | Phase | Endpoints chính |
|--------|:-----:|----------------|
| M1 — Auth & Profile | 1 | `/api/auth/*`, `/api/users/*` |
| M2 — Tournament Management | 1 | `/api/tournaments/*` |
| M3 — Match & Scoring | 1 | `/api/matches/*`, standings, results |
| M4 — Khám phá | 1 | `GET /api/tournaments` (filter/search) |
| M5 — Community Game | 2 | `/api/community/*` |
| M6 — Chat | 2 | `/api/chats/*` |
| M7 — Notification | 1 | `/api/notifications/*` |

---

## Tournament State Machine

```
draft ──► open ──► ready ──► in_progress ──► completed
                                  │
                               cancelled  (có thể hủy bất kỳ lúc nào trước completed)
```

| Trạng thái | Điều kiện chuyển |
|-----------|-----------------|
| `draft` → `open` | Creator publish giải |
| `open` → `ready` | Đủ người + creator đóng đăng ký + xếp bảng xong |
| `ready` → `in_progress` | Creator bắt đầu giải |
| `in_progress` → `completed` | Tất cả trận đấu có kết quả (tự động) |

---

## Round Robin Schedule (mỗi bảng 4 đơn vị)

| Vòng | Trận 1 | Trận 2 |
|:----:|:------:|:------:|
| 1 | A vs B | C vs D |
| 2 | A vs C | B vs D |
| 3 | A vs D | B vs C |

**Tiebreaker** (khi bằng số trận thắng):
1. Hiệu số điểm (tổng điểm ghi − tổng điểm bị mất)
2. Đối đầu trực tiếp
3. Vòng tròn riêng nếu 3 người cùng điểm

---

## WebSocket Events (Socket.io)

### Namespace `/tournament`

| Hướng | Event | Payload |
|-------|-------|---------|
| Client → Server | `JoinTournament` | `tournamentId` |
| Client → Server | `LeaveTournament` | `tournamentId` |
| Server → Client | `ScoreUpdated` | `{ matchId, player1Scores, player2Scores }` |
| Server → Client | `StandingsUpdated` | `{ groupId, standings }` |
| Server → Client | `MatchStatusChanged` | `{ matchId, status }` |
| Server → Client | `TournamentStatusChanged` | `{ status }` |

### Namespace `/chat`

| Hướng | Event | Payload |
|-------|-------|---------|
| Client → Server | `SendMessage` | `{ roomId, content, type }` |
| Client → Server | `TypingStart` / `TypingStop` | `roomId` |
| Client → Server | `MarkAsRead` | `{ roomId, messageId }` |
| Server → Client | `MessageReceived` | message object |
| Server → Client | `UserTyping` / `UserStoppedTyping` | `{ roomId, userId }` |
| Server → Client | `MessageRead` | `{ roomId, userId, messageId }` |

### Namespace `/notification`

| Hướng | Event | Payload |
|-------|-------|---------|
| Server → Client | `NewNotification` | notification object |
| Server → Client | `UnreadCountUpdated` | `{ count }` |

---

## Response Format

Tất cả API responses được wrap bởi `TransformInterceptor`:

```json
// Success
{ "data": { ... } }

// Error
{
  "statusCode": 404,
  "timestamp": "2026-03-16T10:00:00.000Z",
  "path": "/api/tournaments/abc"
}
```

---

## Setup & Chạy Local

```bash
# Cài dependencies
npm install

# Copy env
cp .env.example .env

# Chạy PostgreSQL + Redis (Docker)
docker compose up -d

# Dev mode (hot reload)
npm run start:dev

# Build production
npm run build && npm run start:prod
```

### Environment Variables

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=pickleball

JWT_SECRET=your-secret-key-here

REDIS_URL=redis://localhost:6379

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FCM_SERVICE_ACCOUNT_KEY=
```

### Database Migrations

```bash
# Generate migration sau khi thay đổi entity
npm run migration:generate -- src/migrations/MigrationName

# Chạy migration
npm run migration:run

# Rollback
npm run migration:revert
```

---

## Lộ Trình Triển Khai

### Phase 1 — MVP (Tuần 1–8)
- [x] Folder structure & Clean Architecture setup
- [ ] M1: Auth (JWT + Facebook OAuth)
- [ ] M1: User profile CRUD
- [ ] M2: Tournament CRUD + state machine
- [ ] M2: Participant management (invite / request / approve)
- [ ] M2: Doubles team pairing (manual + random)
- [ ] M2: Group seeding + Round Robin schedule generation
- [ ] M3: Score submission + standings calculation
- [ ] M3: Live score via Socket.io
- [ ] M7: Notifications (in-app + FCM push)

### Phase 2 — Social & Community (Tuần 9–14)
- [ ] M1: Following / Followers system
- [ ] M5: Community games (lobby, join, waitlist, Google Maps)
- [ ] M6: Real-time chat (direct + group)

### Phase 3 — Advanced
- [ ] Thể thức Single / Double Elimination
- [ ] ELO-based skill ranking
- [ ] VNPay / Momo payment integration
- [ ] QR check-in tại sân
- [ ] Admin dashboard & analytics
- [ ] Share result card (auto-generate image)
