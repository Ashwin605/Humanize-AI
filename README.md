# LexWrite AI

Production-grade SaaS platform for law students, legal researchers, academicians, and professionals to improve legal writing clarity, structure, and academic quality while preserving factual accuracy and citations.

## Architecture

```
lexwrite-ai/
├── frontend/          # Next.js 14 (App Router) — Vercel
├── backend/           # Express.js API — Railway
└── README.md
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Supabase) via Prisma ORM |
| Auth | JWT + Google OAuth |
| Storage | AWS S3 |
| AI | OpenAI, Anthropic, Gemini APIs |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or Supabase)

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

API runs at `http://localhost:4000`

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App runs at `http://localhost:3000`

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required configuration.

## Deployment

- **Frontend**: Vercel — connect `frontend/` directory
- **Backend**: Railway — connect `backend/` directory
- **Database**: Supabase PostgreSQL — set `DATABASE_URL` in Railway

## Important Notice

LexWrite AI improves legal writing quality, clarity, and structure. It does **not** claim to bypass AI detectors or guarantee detector evasion.

## License

Proprietary — All rights reserved.
