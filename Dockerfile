  GNU nano 8.3                                                                                                      Dockerfile                                                                                                                
# Base
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules

# Copy package.json & lock first (for caching)
COPY package*.json ./
RUN npm install

# Copy env file (must exist in build context!)
COPY .env.local .env.local

# Copy source
COPY . .

RUN npm run build

# Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
RUN mkdir -p .next/cache/images && chown -R nextjs:nodejs .next
USER nextjs
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]

