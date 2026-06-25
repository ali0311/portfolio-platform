# --- Stage 1: install + generate prisma client -------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Install only what's needed for npm/prisma to run on alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
COPY .npmrc ./

RUN npm ci --userconfig ./.npmrc \
    && npx prisma generate

# --- Stage 2: production runtime --------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl tini

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma
COPY src ./src
COPY docker/entrypoint.sh ./docker/entrypoint.sh

RUN chmod +x ./docker/entrypoint.sh \
    && addgroup -S app && adduser -S app -G app \
    && chown -R app:app /app

USER app

EXPOSE 4000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./docker/entrypoint.sh"]
