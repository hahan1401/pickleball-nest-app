# Project Structure

NestJS monorepo for a Pickleball tournament/match management backend, built on a microservice architecture.

## Repository Layout

```
pickleball-nest-app/
├── apps/
│   └── api-gateway/                    # HTTP entry point (port 3000)
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── auth/
│       │   │   ├── jwt.strategy.ts
│       │   │   └── jwt-auth.guard.ts
│       │   └── users/
│       │       └── users.controller.ts
│       └── tsconfig.app.json
│
│   └── api-user/                       # User microservice (TCP port 3001)
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── users.controller.ts
│       └── └── users.service.ts
│
├── libs/
│   ├── common/                         # Shared library (@app/common)
│   │   └── src/
│   │       ├── constants/
│   │       │   └── message-patterns/
│   │       │       └── message-patterns.ts
│   │       ├── decorators/
│   │       │   ├── public-api.decorator.ts
│   │       │   └── user.decorator.ts
│   │       ├── exception-filters/
│   │       │   └── http-exception.filter.ts
│   │       ├── interceptors/
│   │       │   └── response-mapping.interceptor.ts
│   │       ├── common.module.ts
│   │       ├── common.service.ts
│   │       └── index.ts
│   │
│   └── database/                       # Database library (@app/database)
│       └── src/
│           ├── entities/
│           │   └── user.entity.ts
│           ├── database.module.ts
│           └── index.ts
│
├── docs/
│   └── PROJECT_STRUCTURE.md
├── compose.yaml                        # Docker Compose (PostgreSQL)
├── nest-cli.json                       # NestJS monorepo config
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## Apps

| App | Port | Transport | Role |
|-----|------|-----------|------|
| `api-gateway` | 3000 | HTTP | Entry point; applies global JWT guard, filters, and interceptors; proxies to microservices |
| `api-user` | 3001 | TCP | User microservice; handles auth and user data via message patterns |

## Message Patterns

All patterns are defined as constants in `@app/common` (`libs/common/src/constants/message-patterns/message-patterns.ts`).

| Pattern | Handler | Description |
|---------|---------|-------------|
| `facebook_login` | api-user `UsersService.facebookLogin()` | Validate FB token, upsert user, return JWT |
| `get_me` | api-user `UsersService.getMe()` | Fetch authenticated user by ID |

## API Endpoints (api-gateway)

| Method | Path | Auth | Proxies To |
|--------|------|------|------------|
| `POST` | `/api/auth/me` | Public | `facebook_login` |
| `GET` | `/api/auth/me` | JWT | `get_me` |

## Shared Library (`@app/common`)

| Export | Description |
|--------|-------------|
| `HttpExceptionFilter` | Global HTTP exception handler; returns `{ statusCode, timestamp, path }` |
| `ResponseMappingInterceptor` | Wraps all responses as `{ data: <response> }` |
| `CurrentUser` | Param decorator; extracts `request.user` from context |
| `Public` / `IS_PUBLIC_KEY` | Route decorator; bypasses global `JwtAuthGuard` |
| `USER_PATTERN_MESSAGES` | RPC message pattern constants |

## Database Library (`@app/database`)

| Export | Description |
|--------|-------------|
| `DatabaseModule` | TypeORM config module; reads DB env vars |
| `UserEntity` | Player account entity (see below) |

## Domain Entities

| Entity | Service | Description |
|--------|---------|-------------|
| `UserEntity` | api-user | Player account — Facebook OAuth fields, skill level, paddle preferences |

**UserEntity columns:** `id` (UUID PK), `facebookUserId` (unique), `email` (unique), `passwordHash`, `name`, `avatarUrl`, `bio`, `skillLevel` (decimal, default 3.0), `dominantHand`, `paddleType`, `createdAt`, `updatedAt`

## Infrastructure

- **Database**: PostgreSQL 15 (via Docker Compose)
  - Host: `localhost:5432`
  - Database: `pickleball`
  - User/Password: `postgres/postgres`
- **ORM**: TypeORM (configured in `@app/database`)
- **Auth**: `@nestjs/jwt` + Passport JWT strategy in api-gateway; JWT issued by api-user
- **Transport**: `@nestjs/microservices` — TCP between api-gateway and microservices

## Common Commands

```bash
# Start individual services
nest start api-gateway --watch    # HTTP on port 3000
nest start api-user --watch       # TCP on port 3001

# Build
nest build api-gateway
nest build api-user

# Run tests
npm run test

# Start PostgreSQL
docker compose up -d
```

## Environment Variables

| Variable | Default | Used By |
|----------|---------|---------|
| `PORT` | `3000` | api-gateway |
| `USER_SERVICE_HOST` | `localhost` | api-gateway |
| `USER_SERVICE_PORT` | `3001` | api-gateway, api-user |
| `JWT_SECRET` | `changeme` | api-gateway, api-user |
| `DB_HOST` | `localhost` | @app/database |
| `DB_PORT` | `5432` | @app/database |
| `DB_USERNAME` | `postgres` | @app/database |
| `DB_PASSWORD` | `postgres` | @app/database |
| `DB_NAME` | `pickleball` | @app/database |
