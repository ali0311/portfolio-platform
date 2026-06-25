#!/bin/sh
set -e

echo "[entrypoint] Applying database migrations..."
npx prisma migrate deploy

if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "[entrypoint] Seeding admin user (idempotent upsert)..."
  node prisma/seed.js
else
  echo "[entrypoint] Skipping seed: ADMIN_EMAIL or ADMIN_PASSWORD not set."
fi

echo "[entrypoint] Starting API server..."
exec node src/server.js
