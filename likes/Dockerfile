# Stage 1: Build dependencies
FROM node:24.1.0-alpine AS builder

WORKDIR /app

# Only copy dependency files first to leverage Docker layer caching
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Copy the rest of the application
COPY . .

# Stage 2: Minimal runtime image
FROM node:24.1.0-alpine

WORKDIR /app

# Copy built app and dependencies from builder
COPY --from=builder /app /app


CMD ["yarn", "start"]
