# --- Builder ---
  FROM node:24.1.0-alpine AS builder

  WORKDIR /app
  
  # Install essential system packages
  RUN apk add --no-cache openssl libc6-compat
  
  # Copy dependency files and install full dependencies (including devDependencies)
  COPY package.json yarn.lock ./
  RUN yarn install --frozen-lockfile
  
  # Copy the full source code
  COPY . .
  
  # Build the application (assumes output to /app/build or similar)
  RUN yarn build
  
  # --- Prod dependencies only ---
  FROM node:24.1.0-alpine AS prod-deps
  
  WORKDIR /app
  
  COPY package.json yarn.lock ./
  RUN yarn install --production --frozen-lockfile
  
  # --- Runtime ---
  FROM node:24.1.0-alpine AS runtime
  
  WORKDIR /app
  
  # Install minimal runtime packages
  RUN apk add --no-cache openssl libc6-compat
  
  ENV NODE_ENV=production
  
  # Copy production dependencies
  COPY --from=prod-deps /app/node_modules ./node_modules
  
  # Copy built application
  COPY --from=builder /app/build ./build
  
  # Optionally copy other needed assets like public/ or config/
  # COPY --from=builder /app/public ./public
  
  # Start the app
  CMD ["node", "build/index.js"]
  