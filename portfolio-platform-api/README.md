# portfolio-platform-api

Backend API for the Personal Engineering Portfolio Platform.

## Stack

Node.js · Express · PostgreSQL · Prisma · Zod · JWT (HttpOnly cookies) · bcrypt · Pino · express-rate-limit

## First-time setup

```bash
# 1. Copy env file and fill in values (especially JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD)
cp .env.example .env

# 2. Install deps
npm install --userconfig ./.npmrc

# 3. Start Postgres in Docker
npm run db:up

# 4. Generate Prisma client + apply schema
npm run prisma:migrate -- --name init

# 5. Seed the admin user (uses ADMIN_EMAIL / ADMIN_PASSWORD from .env)
npm run seed

# 6. Start the API in watch mode
npm run dev
```

Server runs at `http://localhost:4000`.

## Routes

### Public
- `GET  /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/analytics/visitor`
- `POST /api/analytics/resume-download`
- `POST /api/analytics/event`
- `POST /api/contact`

### Protected (requires auth cookie)
- `GET /api/auth/me`
- `GET /api/dashboard/overview`
- `GET /api/dashboard/top-sections`
- `GET /api/dashboard/devices`
- `GET /api/dashboard/recent-visitors`
- `GET /api/dashboard/contact-messages`

## Useful commands

```bash
npm run db:up         # start Postgres container
npm run db:down       # stop Postgres
npm run db:logs       # tail Postgres logs
npm run prisma:studio # GUI to browse the DB
npm run seed          # (re)seed admin
```

## Folder layout

```
prisma/
  schema.prisma       Prisma models
  seed.js             admin upsert script
src/
  server.js           entrypoint
  app.js              Express app + middleware wiring
  lib/                prisma, jwt, logger
  middleware/         errorHandler, validate, requireAuth
  routes/             auth, analytics, contact, dashboard
docker-compose.yml    local Postgres
```
