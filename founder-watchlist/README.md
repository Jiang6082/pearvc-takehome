# Founder Watchlist

Founder Watchlist is a lightweight full-stack prototype for venture investors who want to track promising people before they become formal investment opportunities. It focuses on the core loop: add founder, track founder, see updates, coordinate internally, and decide follow-up.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- Auth: JWT auth with bcrypt password hashing
- Jobs: optional `node-cron` mock ingestion

## Requirements

- Node.js 20+
- Docker Desktop
- npm

## Run PostgreSQL

From the project root:

```bash
docker compose up -d
```

Postgres runs at `localhost:5432` with:

- Database: `founder_watchlist`
- User: `founder`
- Password: `founderpass`

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

The API runs at `http://localhost:5001`.

## Frontend Setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Demo Credentials

```text
alex@example.com
password123
```

Other seeded users:

```text
priya@example.com / password123
marcus@example.com / password123
```

## Main Demo Flow

1. Log in as Alex.
2. Open the dashboard and review recent updates for tracked founders.
3. Go to Founders and filter by tag `AI`.
4. Open Jane Doe and see that Alex and Priya both track her.
5. Add a shared note.
6. Mark Jane as contacted.
7. Go to Updates.
8. Run Mock Ingestion.
9. Mark a new update important.
10. Return to the dashboard and see the refreshed high-signal feed.

## Useful Commands

Backend:

```bash
cd backend
npm run dev
npm run build
npx prisma studio
npx prisma db seed
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
```

## Mock Ingestion

The mock ingestion endpoint is fully functional:

```http
POST /api/updates/mock-ingest
```

It picks existing founders, generates plausible update signals, avoids exact duplicate titles for the same founder, and labels sources as mock data. To run it automatically every five minutes in development, set this in `backend/.env`:

```text
ENABLE_MOCK_CRON=true
```

## Product Notes

- This is intentionally not a full CRM.
- Shared notes and private tracking notes are separate.
- Multiple investors can track the same founder.
- Duplicate detection uses LinkedIn URL first, then simple name/company matching.
- The update model is structured so real data sources can replace mock ingestion later.

## Known Limitations

- JWTs are stored in `localStorage` for prototype simplicity.
- Authorization is intentionally light; investors can view shared watchlist data.
- Mock ingestion uses generated signals, not real external sources.
- The UI is optimized for the take-home demo rather than production polish.

## Suggested Next Steps

- Add stricter permissions around ownership and note visibility.
- Add pagination for large watchlists.
- Add real ingestion connectors for LinkedIn, news, and launch platforms.
- Add tests around duplicate detection, filtering, and auth flows.
