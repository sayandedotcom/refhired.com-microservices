# ─────────────────── Build stage ────────────────────────
FROM node:24.1.0-alpine AS build
WORKDIR /app

# 1) System libs Prisma needs to detect OpenSSL + glibc symbols
RUN apk add --no-cache openssl libc6-compat

# 2) Install production dependencies first (best layer cache)
COPY package*.json ./
RUN npm ci --omit=dev

# 3) Dev‑only tools to transpile TypeScript
RUN npm install --save-dev typescript

# 4) Generate the Prisma client (now that OpenSSL is present)
COPY prisma ./prisma
RUN npx prisma generate

# 5) Compile TypeScript → dist/
COPY tsconfig.json ./
COPY cron ./cron
RUN npx tsc

# ─────────────────── Runtime stage ──────────────────────
FROM node:24.1.0-alpine
WORKDIR /app
ENV NODE_ENV=production

# Same two runtime libraries Prisma needs inside the container
RUN apk add --no-cache openssl libc6-compat

# Copy node modules (contains Prisma engine), compiled code, and schema
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

CMD ["node", "dist/expirePosts.js"]
