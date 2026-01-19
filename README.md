# Candidate Profile Playground

A minimal, production-ready application that stores a candidate profile in PostgreSQL (NeonDB) and exposes it via a REST-style API using Next.js App Router, along with a basic frontend UI.

## 🎯 Live Demo

- **Live URL**: [https://your-app.vercel.app](https://your-app.vercel.app) _(Update after deployment)_
- **GitHub Repository**: [https://github.com/your-username/assignment](https://github.com/your-username/assignment) _(Update with actual repo)_

---

## 📋 Project Overview

This project demonstrates a full-stack application with:

- **Backend**: RESTful API routes implemented with Next.js App Router
- **Database**: PostgreSQL on NeonDB with Drizzle ORM
- **Frontend**: Server-rendered pages fetching data via the hosted API
- **Deployment**: Vercel with environment-based configuration

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  Next.js App Router                     ││
│  │  ┌────────────────┐    ┌─────────────────────────────┐  ││
│  │  │  Frontend      │    │   API Routes                │  ││
│  │  │  Pages         │───▶│   /api/profile              │  ││
│  │  │  /, /projects  │    │   /api/projects             │  ││
│  │  │  /search       │    │   /api/skills/top           │  ││
│  │  └────────────────┘    │   /api/search               │  ││
│  │                        │   /api/health               │  ││
│  │                        └─────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
│                              │                              │
└──────────────────────────────│──────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      NeonDB         │
                    │    PostgreSQL       │
                    │  ┌───────────────┐  │
                    │  │   profiles    │  │
                    │  │   projects    │  │
                    │  │   work_exp    │  │
                    │  └───────────────┘  │
                    └─────────────────────┘
```

---

## 🧱 Tech Stack

| Technology      | Purpose               | Justification                                                          |
| --------------- | --------------------- | ---------------------------------------------------------------------- |
| **Next.js 16**  | Full-stack framework  | App Router provides unified API routes and SSR pages with excellent DX |
| **TypeScript**  | Type safety           | Catches errors at compile time, improves maintainability               |
| **Drizzle ORM** | Database toolkit      | Type-safe, lightweight, SQL-like syntax, excellent migration support   |
| **NeonDB**      | Serverless PostgreSQL | Instant provisioning, auto-scaling, perfect for serverless deployments |
| **Zod**         | Input validation      | Runtime type validation with TypeScript inference                      |
| **Tailwind**    | Styling               | Utility-first CSS, minimal bundle size, rapid development              |
| **Vercel**      | Hosting               | Native Next.js support, edge functions, automatic deployments          |

---

## 🗄️ Database Schema

### Tables

#### `profiles`

| Column     | Type          | Description                        |
| ---------- | ------------- | ---------------------------------- |
| id         | UUID (PK)     | Auto-generated unique identifier   |
| name       | TEXT          | Full name                          |
| email      | TEXT (unique) | Email address                      |
| summary    | TEXT          | Professional summary               |
| education  | JSONB         | Array of education entries         |
| skills     | TEXT[]        | Array of skill strings             |
| links      | JSONB         | Object with github, linkedin, etc. |
| created_at | TIMESTAMPTZ   | Creation timestamp                 |
| updated_at | TIMESTAMPTZ   | Last update timestamp              |

#### `projects`

| Column      | Type        | Description                       |
| ----------- | ----------- | --------------------------------- |
| id          | UUID (PK)   | Auto-generated unique identifier  |
| profile_id  | UUID (FK)   | References profiles.id            |
| title       | TEXT        | Project title                     |
| description | TEXT        | Project description               |
| links       | JSONB       | Object with repo, demo, docs URLs |
| skills      | TEXT[]      | Technologies used                 |
| created_at  | TIMESTAMPTZ | Creation timestamp                |
| updated_at  | TIMESTAMPTZ | Last update timestamp             |

#### `work_experiences`

| Column     | Type        | Description                      |
| ---------- | ----------- | -------------------------------- |
| id         | UUID (PK)   | Auto-generated unique identifier |
| profile_id | UUID (FK)   | References profiles.id           |
| role       | TEXT        | Job title                        |
| company    | TEXT        | Company name                     |
| location   | TEXT        | Work location                    |
| start_date | TEXT        | Start date (YYYY-MM)             |
| end_date   | TEXT        | End date (null if current)       |
| summary    | TEXT        | Role description                 |
| highlights | JSONB       | Array of bullet points           |
| created_at | TIMESTAMPTZ | Creation timestamp               |
| updated_at | TIMESTAMPTZ | Last update timestamp            |

### JSONB Field Structures

```typescript
// education (JSONB array)
[{
  school: "Stanford University",
  degree: "M.S.",
  area: "Computer Science",
  startYear: "2020",
  endYear: "2022"
}]

// links on profile (JSONB object)
{
  github: "https://github.com/...",
  linkedin: "https://linkedin.com/in/...",
  portfolio: "https://..."
}

// links on projects (JSONB object)
{
  repo: "https://github.com/...",
  demo: "https://...",
  docs: "https://..."
}

// highlights on work (JSONB array)
[{ bullet: "Led team of 5 engineers..." }]
```

### Indexes

- `profiles_email_idx` - Unique email lookup
- `projects_profile_idx` - FK relationship
- `projects_skills_idx` - GIN index for skill filtering
- `projects_title_idx` - Project title search
- `work_profile_idx` - FK relationship
- `work_company_idx` - Company search

---

## 🛠️ Local Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- A NeonDB account (free tier available)

### 1. Clone and Install

```bash
git clone https://github.com/your-username/assignment.git
cd assignment
npm install
```

### 2. Set Up NeonDB

1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string from your dashboard

### 3. Configure Environment

Create `.env` file:

```env
DATABASE_URL="postgres://username:password@host.neon.tech/dbname?sslmode=require"
BASIC_AUTH_TOKEN="your-secure-token"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Run Migrations

```bash
npm run db:push
```

### 5. Seed Database

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🚀 Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables:
    - `DATABASE_URL` - Your NeonDB production connection string
    - `BASIC_AUTH_TOKEN` - Secure token for write operations
    - `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., https://your-app.vercel.app)
4. Deploy

### Post-Deployment

Run migrations against production database:

```bash
DATABASE_URL="your-production-url" npm run db:push
DATABASE_URL="your-production-url" npm run db:seed
```

---

## 📡 API Reference

### Health Check

```bash
curl https://your-app.vercel.app/api/health
```

Response:

```json
{
    "status": "ok",
    "timestamp": "2026-01-19T10:00:00.000Z",
    "version": "1.0.0"
}
```

### Get Profile

```bash
curl https://your-app.vercel.app/api/profile
```

### Create Profile

```bash
curl -X POST https://your-app.vercel.app/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "summary": "Software engineer...",
    "skills": ["TypeScript", "React"],
    "education": [{"school": "MIT", "degree": "BS", "area": "CS"}],
    "links": {"github": "https://github.com/johndoe"},
    "projects": [{"title": "Project X", "description": "...", "skills": ["Go"]}],
    "work": [{"role": "Engineer", "company": "ACME", "startDate": "2020-01"}]
  }'
```

### Update Profile

```bash
curl -X PUT https://your-app.vercel.app/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"name": "Jane Doe", "skills": ["Python", "Go", "Rust"]}'
```

### Filter Projects by Skill

```bash
curl "https://your-app.vercel.app/api/projects?skill=python"
```

### Get Top Skills

```bash
curl https://your-app.vercel.app/api/skills/top
```

### Search

```bash
curl "https://your-app.vercel.app/api/search?q=typescript"
```

---

## 📁 Project Structure

```
├── drizzle/                  # Generated SQL migrations
│   └── 0000_*.sql
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts
│   │   │   ├── profile/route.ts
│   │   │   ├── projects/route.ts
│   │   │   ├── search/route.ts
│   │   │   └── skills/top/route.ts
│   │   ├── projects/page.tsx
│   │   ├── search/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── db/
│   │   ├── index.ts          # Database client
│   │   ├── schema.ts         # Drizzle schema
│   │   └── seed.ts           # Seed script
│   └── lib/
│       ├── api-client.ts     # Frontend API client
│       ├── api-utils.ts      # API helpers (auth, responses)
│       └── validators.ts     # Zod schemas
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚠️ Known Limitations

1. **Single Profile**: The app is designed for a single candidate profile. Multi-tenant support would require additional routing/authentication.

2. **Basic Auth**: Write endpoints use simple Bearer token auth. For production, consider OAuth or JWT.

3. **No Pagination**: API endpoints return all results. Large datasets would need cursor-based pagination.

4. **No Caching**: Data is fetched fresh on each request. Consider adding Redis or Next.js ISR for frequently accessed data.

5. **No Rate Limiting**: API endpoints have no rate limiting. Add middleware like `@upstash/ratelimit` for production.

6. **Client-Side Search**: The search page uses client-side state. For better SEO, consider server-side rendering with URL params.

---

## ✨ Bonus Features Implemented

- ✅ **Input Validation**: Zod schemas for all API inputs
- ✅ **Basic Auth**: Bearer token protection for write endpoints
- ✅ **TypeScript**: Full type safety across the codebase
- ✅ **Indexes**: GIN index on skills array for efficient filtering
- ✅ **Error Handling**: Consistent JSON error responses

---

## 📄 Resume

[Link to Resume (PDF)](https://your-resume-link.com) _(Update with actual link)_

---

## 📜 License

MIT
