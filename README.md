# CozyRoom

CozyRoom is a full-stack chat app with authentication, profile management, room-based messaging, and room invitations.

## Project Status

This project is an MVP and a learning sketch.

- It is intentionally focused on exploring architecture and implementation ideas.
- Expect rough edges, incomplete flows, and evolving structure.
- The goal is learning and iteration, not production readiness.

This workspace contains two applications:

- `cozyroom/`: Next.js frontend (App Router)
- `thebackroom/`: NestJS backend API

## What is built

- Email/password auth (login, register, logout)
- Cookie-based session flow with access and refresh tokens
- Automatic token refresh in frontend middleware
- User profile page (display name, bio, phone, avatar upload)
- Room-based chat
- Realtime message updates via Supabase Realtime
- Room invitations (send, list pending, accept)

## Tech stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Backend: NestJS 11, TypeScript
- Data/Auth/Storage/Realtime: Supabase

## Repository layout

```text
.
|- cozyroom/       # Next.js app
|- thebackroom/    # NestJS API
`- README.md       # You are here
```

## How it works

1. User authenticates through frontend forms.
2. Frontend server actions call backend auth endpoints.
3. Tokens are set as HTTP-only cookies (`access_token`, `refresh_token`).
4. Frontend middleware checks cookies and tries `/auth/refresh` when needed.
5. Frontend calls internal Next.js API routes, which proxy requests to NestJS.
6. Backend uses Supabase for auth, profile data, chat data, and avatar storage.
7. Chat UI subscribes to Supabase realtime inserts for new messages.

## Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project with auth enabled

## Environment variables

Create `.env.local` in `cozyroom/` and `.env` (or `.env.local`) in `thebackroom/`.

### Frontend (`cozyroom/.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key

# Optional
NEXT_PUBLIC_SUPABASE_IMAGE_PATH=/storage/v1/object/public/**
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://localhost:3001
```

Notes:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` are required.
- `NEXT_PUBLIC_API_URL` is used in the browser.
- `API_URL` is used by server-side fetches.

### Backend (`thebackroom/.env`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key

# Optional
PORT=3001
```

Notes:
- Backend currently reads the same Supabase variables shown above.
- Default backend port is `3001`.

## Database and storage expectations

The backend expects these Supabase resources to exist:

- Tables/views used by code:
  - `profiles`
  - `public_profiles`
  - `rooms`
  - `room_members`
  - `messages`
  - `room_invitations`
- Storage bucket:
  - `avatar`

## Local development

Open two terminals from the workspace root.

### 1) Start backend

```bash
cd thebackroom
npm install
npm run start:dev
```

Backend runs on `http://localhost:3001` by default.

### 2) Start frontend

```bash
cd cozyroom
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Build and run (production mode)

### Frontend

```bash
cd cozyroom
npm run build
npm run start
```

### Backend

```bash
cd thebackroom
npm run build
npm run start:prod
```

## Useful scripts

### Frontend (`cozyroom/package.json`)

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

### Backend (`thebackroom/package.json`)

- `npm run start:dev`
- `npm run build`
- `npm run start:prod`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`

## API surface (high level)

Auth:
- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/refresh`
- `POST /auth/logout`

Users:
- `GET /users/search?q=...&limit=...`
- `GET /users/me/profile`
- `PATCH /users/me/profile`
- `POST /users/me/avatar`

Chat:
- `GET /chat/rooms`
- `POST /chat/rooms`
- `GET /chat/rooms/:roomId/messages`
- `POST /chat/rooms/:roomId/messages`
- `GET /chat/rooms/:roomId/members`
- `POST /chat/rooms/:roomId/invite`
- `GET /chat/invitations`
- `PATCH /chat/invitations/:invitationId/accept`

## Frontend routes

- `/` landing page
- `/login`
- `/register`
- `/profile`
- `/chat`
- `/chat/[roomId]`

## Troubleshooting

- App fails at startup with missing Supabase vars:
  - Confirm both frontend and backend env files contain required variables.
- Frontend cannot reach backend:
  - Confirm backend is running on `3001`.
  - Set `NEXT_PUBLIC_API_URL` and `API_URL` explicitly if needed.
- Avatar image does not load:
  - Check Next.js image host config and Supabase storage permissions.
- Realtime messages do not appear:
  - Confirm Supabase Realtime is enabled for the `messages` table.

## Notes

- Existing app-specific README files inside `cozyroom/` and `thebackroom/` are starter templates.
- Use this root README as the main project guide.
