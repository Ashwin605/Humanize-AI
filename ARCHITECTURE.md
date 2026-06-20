# LexWrite AI — Architecture

## System Overview

```
┌─────────────────┐     HTTPS/JWT      ┌─────────────────┐
│  Next.js App    │ ◄────────────────► │  Express API    │
│  (Vercel)       │                    │  (Railway)      │
└────────┬────────┘                    └────────┬────────┘
         │                                      │
         │                              ┌───────┴───────┐
         │                              │               │
         │                       ┌──────▼─────┐  ┌──────▼─────┐
         │                       │ PostgreSQL │  │  AWS S3    │
         │                       │ (Supabase) │  │  Storage   │
         │                       └────────────┘  └────────────┘
         │                                      │
         │                              ┌───────▼────────┐
         │                              │ AI Providers   │
         │                              │ OpenAI         │
         │                              │ Anthropic      │
         │                              │ Gemini         │
         └──────────────────────────────┴────────────────┘
```

## Frontend Component Hierarchy

```
app/
├── page.tsx                    # Landing page
├── login/ register/            # Auth flow
├── dashboard/
│   ├── page.tsx                # Dashboard home
│   ├── documents/              # Document list & editor
│   ├── templates/              # Saved templates
│   ├── citations/              # Citation manager
│   ├── assistant/              # Legal AI assistant
│   └── profile/                # Account & subscription
└── admin/                      # Admin panel

components/
├── landing/                    # Marketing sections
├── dashboard/                  # Sidebar, stats
├── editor/                     # Dual-pane document editor
├── assistant/                  # Legal research tools
├── admin/                      # Admin dashboard
├── auth/                       # Auth forms & guards
└── ui/                         # Design system primitives
```

## API Structure

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Email registration |
| POST | `/api/auth/login` | Email login |
| POST | `/api/auth/google` | Google OAuth |
| POST | `/api/auth/forgot-password` | Password reset |
| GET | `/api/auth/me` | Current user |
| GET | `/api/documents` | List documents |
| POST | `/api/documents` | Create document |
| GET | `/api/documents/:id` | Get document |
| PUT | `/api/documents/:id` | Update document |
| DELETE | `/api/documents/:id` | Delete document |
| POST | `/api/documents/:id/enhance` | AI enhancement |
| POST | `/api/documents/:id/analyze` | Document analysis |
| POST | `/api/documents/import` | File import |
| GET | `/api/documents/:id/export` | Export document |
| POST | `/api/documents/assistant` | Legal assistant |
| GET | `/api/templates` | List templates |
| GET | `/api/citations` | List citations |
| GET | `/api/admin/dashboard` | Admin stats |
| GET | `/api/admin/users` | User management |

## Database Schema

- **Users** — Authentication, roles, profile
- **Subscriptions** — Plan limits (Free/Pro/Enterprise)
- **Documents** — Original & enhanced text, modes, status
- **DocumentVersions** — Version history
- **DocumentAnalysis** — Writing quality scores
- **Templates** — Reusable document templates
- **CitationLibraries** — Saved citations
- **UsageLogs** — Token & action tracking
- **AuditLogs** — Security audit trail
- **PromptTemplates** — Admin-managed AI prompts
- **Analytics** — Daily aggregated metrics

## AI Enhancement Engine

The enhancement engine (`backend/src/services/aiService.ts`):

1. Builds mode-specific prompts (tone, formality, structure, vocabulary)
2. Extracts and preserves citations before processing
3. Routes to OpenAI, Anthropic, or Gemini
4. Falls back to local mock enhancement when no API key is configured
5. Logs token usage for billing analytics

## Security

- JWT authentication with bcrypt password hashing
- Rate limiting (200 req/15 min)
- Helmet security headers
- CORS restricted to frontend origin
- Audit logging for sensitive actions
- Role-based admin access control

## Deployment

| Service | Platform | Directory |
|---------|----------|-----------|
| Frontend | Vercel | `frontend/` |
| Backend | Railway | `backend/` |
| Database | Supabase | PostgreSQL |
| Storage | AWS S3 | Document files |
