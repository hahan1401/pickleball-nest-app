---
name: project-microservice-architecture
description: Actual current microservice layout — PROJECT_STRUCTURE.md is outdated and missing api-notification, api-email, and RabbitMQ details
metadata:
  type: project
---

Four services run as a NestJS monorepo. PROJECT_STRUCTURE.md only documents api-gateway and api-user — it is out of date.

**Why:** The project grew beyond the initial two services; the docs were not updated.
**How to apply:** Trust the `apps/` directory over the docs when reasoning about service boundaries.

## Services

| Service | Port | Transport | Role |
|---|---|---|---|
| `api-gateway` | 3000 | HTTP + WebSocket | Entry point; JWT guard; proxies to microservices; hosts WebSocket gateway for clients |
| `api-user` | 3001 | TCP | User auth (Facebook OAuth), JWT issuance |
| `api-email` | 3002 (assumed) | RabbitMQ | Sends emails |
| `api-notification` | 3003 | HTTP + WebSocket + RabbitMQ | Persists & delivers push notifications |

## RabbitMQ topology

- Exchange: `app_exchange` (topic, durable)
- `email_queue` — routing key `email.#`
- `notification_queue` — routing key `notification.#`
- DLX/DLQ configured but commented out in `api-notification/src/main.ts`

## Non-obvious call pattern (notification)

`api-notification` does NOT own the WebSocket connection to clients — `api-gateway` does.
The notification delivery path is a two-hop call:

```
api-notification (RabbitMQ consumer)
  → POST http://api-gateway:3000/api/notification/internal/send-direct
    → NotificationGateway.sendToUser() [lives in api-gateway]
      → WebSocket to client
```

`api-gateway` must know `NOTIFICATION_SERVICE_URL=http://localhost:3003` to call back for pending flush.

## Shared libraries

- `@app/common` — decorators, exception filters, interceptors, RabbitMQ constants, message patterns
- `@app/database` — TypeORM `DatabaseModule` (postgres), `UserEntity`, `NotificationEntity`
