# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.7.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --only=production

FROM base AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM base AS production

ENV NODE_ENV=production

# Create data directory for SQLite database
RUN mkdir -p /app/data && chown node:node /app/data

USER node

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/bin ./bin
COPY --from=build /app/src/db/migrations ./src/db/migrations
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts

ENTRYPOINT ["node", "bin/index.js"]
