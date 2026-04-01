# Project Structure

NestJS monorepo for a Pickleball tournament/match management backend, built on a microservice architecture.

## Repository Layout

```
pickleball-nest-app/
├── apps/
│   ├── api-gateway/                    # HTTP entry point (port 3000)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── users/
│   │   │   │   └── users.controller.ts
│   │   │   └── posts/
│   │   │       └── posts.controller.ts
│   │   └── tsconfig.app.json
│   │
│   ├── api-user/                       # User microservice (TCP port 3001)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   └── tsconfig.app.json
│   │
│   └── post-service/                   # Post microservice (TCP port 3002)
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── posts.controller.ts
│       │   └── posts.service.ts
│       └── tsconfig.app.json
│
├── libs/
│   └── common/                         # Shared library (@app/common)
│       └── src/
│           ├── decorators/
│           │   └── user.decorator.ts
│           ├── exception-filters/
│           │   └── http-exception.filter.ts
│           ├── interceptors/
│           │   └── response-mapping.interceptor.ts
│           ├── common.module.ts
│           ├── common.service.ts
│           └── index.ts
│
├── compose.yaml                        # Docker Compose (PostgreSQL)
├── nest-cli.json                       # NestJS monorepo config
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## Apps

| App | Port | Transport | Role |
|-----|------|-----------|------|
| `api-gateway` | 3000 | HTTP | Entry point; applies global filters/interceptors, proxies to microservices |
| `api-user` | 3001 | TCP | User microservice; Facebook auth, user data |
| `post-service` | 3002 | TCP | Post microservice (WIP) |

## Message Patterns

| Pattern | Handler | Description |
|---------|---------|-------------|
| `{ cmd: 'facebook_login' }` | api-user | Validate FB token, upsert user, return JWT |
| `{ cmd: 'get_posts' }` | post-service | Return list of posts |

## Shared Library (`@app/common`)

| Export | Description |
|--------|-------------|
| `HttpExceptionFilter` | Global HTTP exception handler; returns `{ statusCode, timestamp, path }` |
| `ResponseMappingInterceptor` | Wraps all responses as `{ data: <response> }` |
| `User` | Param decorator; extracts `request.user` and attaches remote IP |

## Domain Entities

| Entity | Service | Description |
|--------|---------|-------------|
| `UserEntity` | api-user | Player account with Facebook OAuth fields |

## Infrastructure

- **Database**: PostgreSQL 15 (via Docker Compose)
  - Host: `localhost:5432`
  - Database: `pickleball`
  - User/Password: `postgres/postgres`
- **ORM**: TypeORM
- **Auth**: `@nestjs/jwt` (Facebook OAuth flow in api-user)
- **Transport**: `@nestjs/microservices` — TCP between api-gateway and microservices

## Common Commands

```bash
# Start individual services
nest start api-gateway --watch    # HTTP on port 3000
nest start api-user --watch       # TCP on port 3001
nest start post-service --watch   # TCP on port 3002

# Build
nest build api-gateway
nest build api-user
nest build post-service

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
| `POST_SERVICE_HOST` | `localhost` | api-gateway |
| `POST_SERVICE_PORT` | `3002` | api-gateway, post-service |
| `JWT_SECRET` | `changeme` | api-user |
| `DB_HOST` | `localhost` | api-user |
| `DB_PORT` | `5432` | api-user |
| `DB_USERNAME` | `postgres` | api-user |
| `DB_PASSWORD` | `postgres` | api-user |
| `DB_NAME` | `pickleball` | api-user |
