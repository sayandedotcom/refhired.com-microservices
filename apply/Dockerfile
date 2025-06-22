# --- Builder ---
  FROM node:24.1.0-alpine AS builder
  WORKDIR /app
  
  RUN apk add --no-cache openssl libc6-compat
  
  COPY package.json yarn.lock ./
  RUN yarn install --frozen-lockfile
  
  COPY prisma ./prisma
  RUN npx prisma generate
  
  COPY . .
  RUN yarn build  # builds to /app/build
  
  # --- Prod dependencies only ---
  FROM node:24.1.0-alpine AS prod-deps
  WORKDIR /app
  COPY package.json yarn.lock ./
  RUN yarn install --production --frozen-lockfile
  
  # --- Runtime ---
  FROM node:24.1.0-alpine AS runtime
  WORKDIR /app
  RUN apk add --no-cache openssl libc6-compat
  
  ENV NODE_ENV=production
  
  COPY --from=prod-deps /app/node_modules ./node_modules
  COPY --from=builder /app/build ./build
  COPY --from=builder /app/prisma ./prisma
  COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
  
  CMD ["node", "build/index.js"]
