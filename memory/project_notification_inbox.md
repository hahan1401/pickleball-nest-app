---
name: project-notification-inbox
description: Offline notification inbox (Option A) — implemented on branch micro-service; notifications are persisted to DB and flushed to the user on WebSocket reconnect
metadata:
  type: project
---

Implemented on branch `micro-service`. All changes are uncommitted as of the end of the session.

**Why:** Previously, notifications sent to offline users were silently dropped. Option A persists every notification to the DB and delivers pending ones when the user reconnects via WebSocket.
**How to apply:** When extending notification features, the `NotificationEntity` is the source of truth; `deliveredAt=null` means pending.

## What was built

### New entity — `libs/database/src/entities/notification.entity.ts`
- Columns: `id` (UUID PK), `userId` (indexed), `message`, `type`, `read` (bool), `deliveredAt` (nullable timestamptz), `createdAt`
- `synchronize: true` in `DatabaseModule` will auto-create the `notifications` table on first run
- Exported from `libs/database/src/index.ts`

### `api-notification` changes
- `app.module.ts` — imports `DatabaseModule` + `TypeOrmModule.forFeature([NotificationEntity])`
- `notification.service.ts` — always INSERTs before attempting WebSocket delivery; sets `deliveredAt` on success; adds `flushPending()`, `getInbox()`, `markRead()`
- `notification-http.controller.ts` (NEW) — HTTP endpoints:
  - `GET  /notifications/pending/:userId` — returns undelivered rows, marks them delivered
  - `GET  /notifications/inbox/:userId` — last 50, newest first
  - `PATCH /notifications/:id/read/:userId` — sets `read = true`

### `api-gateway` changes
- `notification.gateway.ts` — `handleConnection()` now calls `flushPendingNotifications()` which fetches from api-notification and emits each as a `notification` event
- `notification.controller.ts` — added `GET /notification/inbox/:userId` and `PATCH /notification/:id/read/:userId` as proxy endpoints for clients

## New env var required
`NOTIFICATION_SERVICE_URL` on `api-gateway` (default: `http://localhost:3003`)

## What is NOT yet done
- `api-notification/src/notification/notification.gateway.ts` — this file is a stale duplicate of the gateway that now lives in `api-gateway`. It is defined but not registered in `AppModule` and does nothing. Consider deleting it.
- No auth guard on the new HTTP endpoints (they are `@Public()` style for now)
- No pagination on inbox beyond `take: 50`
- FCM/APNs fallback (Option B) is still a TODO comment in `notification.service.ts`

See [[project-microservice-architecture]] for the two-hop delivery call pattern.
