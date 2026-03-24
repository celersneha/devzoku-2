# DevZoku Server Conversion for Vercel (Bun-first)

## What is now implemented

This repository is now prepared so the Express server can be deployed on Vercel while keeping existing API behavior, queue usage, and embedding cron flow.

Implemented changes:
- Added Vercel server entrypoint: `server/api/index.ts`
- Updated Express bootstrap to avoid `listen()` on Vercel: `server/src/index.ts`
- Added internal cron endpoint to process BullMQ email queue: `server/src/controllers/internal.controller.ts` and `server/src/routes/internal.route.ts`
- Mounted internal routes in app: `server/src/app.ts`
- Enabled GET for embedding cron endpoint: `server/src/routes/hackathon.route.ts`
- Made queue writes awaited for serverless safety: `server/src/controllers/hackathon.controller.ts`
- Added Vercel config with cron schedules: `server/vercel.json`
- Kept Bun for scripts (`dev`, `build`, `start`): `server/package.json`
- Removed Docker-only server artifacts not needed for Vercel

## Removed files (unused for Vercel)

- `server/.dockerignore`
- `server/Dockerfile`
- `server/Dockerfile.dev`
- `server/Dockerfile.migrator`
- `server/migrator.package.json`

## Current server flow (unchanged functionally)

- API endpoints still served by Express from existing routes/controllers.
- Team registration and winner emails are still queued using BullMQ.
- Queue processing now runs through a protected cron endpoint:
  - `GET /internal/process-email-queue`
- Hackathon embedding cron still uses the same controller logic:
  - `GET /hackathon/embed-hackathons`

## Vercel configuration

`server/vercel.json` contains:
- Bun install command: `bun install --frozen-lockfile`
- Bun build command: `bun run build`
- Function config for `api/index.ts` with `maxDuration` and memory
- Rewrite of all requests to Express entrypoint
- Cron schedules:
  - Every 5 minutes: `/internal/process-email-queue`
  - Every 6 hours: `/hackathon/embed-hackathons`

## Required environment variables (Server project on Vercel)

Set these in the Vercel project for `server`:

Core:
- `DATABASE_URL`
- `JWT_SECRET`
- `CRON_SECRET`
- `CORS_ORIGIN` (comma-separated if multiple domains)

Redis (BullMQ):
- `UPSTASH_REDIS_HOST` (or `VALKEY_HOST`)
- `UPSTASH_REDIS_PORT` (or `VALKEY_PORT`)
- `UPSTASH_REDIS_PASSWORD` (or `VALKEY_PASSWORD`)
- optional: `UPSTASH_REDIS_USERNAME`
- optional: `EMAIL_QUEUE_BATCH_SIZE` (default `100`)

Email:
- `SMTP_EMAIL`
- `SMTP_PASSWORD`

Storage/AI (as already used in code):
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `QDRANT_URL` / `QDRANT_API_KEY` (if vector store uses Qdrant)
- `PINECONE_API_KEY` (if Pinecone is used)
- model provider keys used by your embeddings/LLM modules

## Deploy steps

## 1) Deploy server

1. Create/import the `server` project on Vercel.
2. Root directory: `server`
3. Ensure `vercel.json` is detected.
4. Add all environment variables listed above.
5. Deploy.

## 2) Verify server

- Health check:
  - `GET /`
- Queue cron endpoint (manual test):
  - `GET /internal/process-email-queue`
  - Header: `Authorization: Bearer <CRON_SECRET>`
- Embedding cron endpoint (manual test):
  - `GET /hackathon/embed-hackathons`
  - Header: `Authorization: Bearer <CRON_SECRET>`

## 3) Deploy client separately (existing Next.js app)

In client Vercel project:
- `NEXT_PUBLIC_API_URL=https://<your-server-project>.vercel.app`
- Keep existing client build settings

## Notes about Bun on Vercel

- This repo is Bun-first for install/build/start commands.
- Vercel handles function runtime infrastructure for deployed serverless functions.

## Build status

Validated locally:
- `cd server && bun run build`
- Result: bundle generated successfully from `api/index.ts`
