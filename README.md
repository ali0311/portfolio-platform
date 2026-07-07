# Personal Engineering Portfolio Platform

Full-stack portfolio at [helloiamali.com](https://www.helloiamali.com/) — React + Node + PostgreSQL, deployed to AWS (S3 + CloudFront for the frontend, EC2 + Docker Compose for the backend).

## Repository layout

```
portfolio-platform/
├── portfolio-platform-web/     React + Vite frontend
├── portfolio-platform-api/     Node + Express + Prisma backend
├── infra/nginx/                Nginx config used on EC2
├── docker-compose.yml          Full-stack local run (mirrors prod)
├── docker-compose.prod.yml     Production compose (EC2)
├── DEPLOY.md                   Deploy runbook + first-time AWS setup
└── .env                        Root env for the full-stack compose
```

## Prerequisites

- Node.js 20+
- npm
- Docker Desktop (only for Postgres in the fast dev loop, and full stack when you need it)
- A local git clone of this repo

## First-time setup after cloning

**1. Fill in env files.** Copy each example and set real values:

```bash
cp .env.example .env
cp portfolio-platform-api/.env.example portfolio-platform-api/.env
cp portfolio-platform-web/.env.example portfolio-platform-web/.env.development
```

The three files serve different consumers:

| File | Used by |
|---|---|
| `.env` (root) | Full-stack Docker Compose (`docker compose up`) |
| `portfolio-platform-api/.env` | Native API dev server (`npm run dev` inside the api folder) |
| `portfolio-platform-web/.env.development` | Vite dev server (should contain `VITE_API_URL=http://localhost:4000`) |

**2. Install dependencies.** Because a corporate `~/.npmrc` may point at a private Artifactory, always pass `--userconfig ./.npmrc` so the project-local registry override wins:

```bash
cd portfolio-platform-api && npm install --userconfig ./.npmrc
cd ../portfolio-platform-web && npm install --userconfig ./.npmrc
```

**3. Bring up Postgres (Docker) and initialize the schema + admin user.** From the repo root:

```bash
cd portfolio-platform-api
npm run db:up                             # start just Postgres on :5433
npm run prisma:migrate -- --name init     # apply schema (first time only)
npm run seed                              # create the admin user from ADMIN_EMAIL / ADMIN_PASSWORD
```

## Everyday development loop (fast — HMR + node --watch)

This is the setup you'll use day-to-day. Three terminals; no Docker rebuilds needed for code changes.

**Terminal 1 — Postgres (long-lived, leave running):**
```bash
cd portfolio-platform-api
npm run db:up
```

**Terminal 2 — API on port 4000 (auto-restarts on file save):**
```bash
cd portfolio-platform-api
npm run dev
```

**Terminal 3 — Vite dev server on port 5173 (HMR):**
```bash
cd portfolio-platform-web
npm run dev
```

Open **http://localhost:5173** — the web app calls the API at `http://localhost:4000`, which reads/writes to Postgres in Docker on `:5433`.

**What each change requires:**

| What changed | What to do |
|---|---|
| React JSX / CSS | Nothing — HMR handles it instantly |
| API code (routes, middleware, lib) | Nothing — `node --watch` restarts on save |
| `prisma/schema.prisma` (DB schema) | `npm run prisma:migrate -- --name <what_you_did>` inside `portfolio-platform-api/` |
| `package.json` in api or web | `npm install --userconfig ./.npmrc` in that folder |
| Any `.env` file | Kill and restart the affected terminal (env vars read at startup) |

## Full-stack Docker (mirrors production)

When you need to test the prod-like path — built Vite bundle, Nginx, containerized API — use the root compose:

```bash
docker compose up -d --build     # builds and starts postgres + api + web
docker compose ps                # what's up and healthy
docker compose logs -f api       # tail API logs
docker compose down              # stop everything (DB volume preserved)
docker compose down -v           # stop AND wipe the DB (fresh init)
```

Access at **http://localhost:8080**. No HMR — every code change requires `docker compose up -d --build`. Use this only for prod-parity checks, not everyday iteration.

**Important:** Don't run the full-stack Docker and native dev servers at the same time — they fight over ports 4000 / 5173 / 5432.

## Useful commands

Inside `portfolio-platform-api/`:

```bash
npm run dev            # API in watch mode
npm run db:up          # Postgres container up
npm run db:down        # Postgres container down (data preserved)
npm run db:logs        # tail Postgres logs
npm run prisma:studio  # GUI to browse the DB
npm run prisma:migrate # apply schema changes and generate client
npm run seed           # (re)seed admin user — idempotent
```

Inside `portfolio-platform-web/`:

```bash
npm run dev            # Vite dev server on :5173
npm run build          # Production build to dist/
npm run preview        # Serve the built dist/ locally to test prod bundle
npm run lint           # ESLint
```

## Ports used

| Port | Service |
|---|---|
| 5173 | Vite dev server (web) |
| 4000 | Node API |
| 5433 | Postgres in Docker (host-mapped from container's 5432) |
| 8080 | Nginx serving built web bundle (only when full-stack Docker is up) |

## Troubleshooting

- **API crashes with `P1000: Authentication failed`** — your `POSTGRES_USER` / `POSTGRES_PASSWORD` in `.env` don't match what the Postgres volume was initialized with. Fix: `docker compose down -v` (wipes DB) then `docker compose up -d --build` (re-initializes with current env).
- **`npm install` fails with 401 / registry errors** — corporate `~/.npmrc` is intercepting. Always pass `--userconfig ./.npmrc` from the project folder.
- **Login works but dashboard redirects back to `/login`** — the JWT cookie isn't being sent. Verify `FRONTEND_ORIGIN` in the api env matches the origin you're browsing from (`http://localhost:5173` for native dev, `http://localhost:8080` for full-stack Docker).
- **Frontend changes don't appear** — you're likely on `:8080` (Docker's pre-built bundle). Switch to `:5173` for the live Vite dev server.

## Deploying to AWS

See [DEPLOY.md](DEPLOY.md) for the first-time AWS provisioning walkthrough and the CI/CD pipeline layout. Once secrets are in place, push to `main` and both `deploy-frontend.yml` and `deploy-backend.yml` run automatically.
