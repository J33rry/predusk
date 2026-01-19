# Talent Directory

A modern, production-ready directory application that stores candidate profiles in PostgreSQL (NeonDB) and exposes them via a REST-style API using Next.js App Router. Features a beautiful glassmorphism UI with smooth animations.

## 🎯 Live Demo

- **Live URL**: [https://your-app.vercel.app](https://your-app.vercel.app) _(Update after deployment)_
- **GitHub Repository**: [https://github.com/your-username/assignment](https://github.com/your-username/assignment) _(Update with actual repo)_

---

## 📋 Project Overview

This project demonstrates a full-stack application with:

- **Directory System**: Support for multiple user profiles
- **Backend**: RESTful API routes implemented with Next.js App Router
- **Database**: PostgreSQL on NeonDB with Drizzle ORM
- **Frontend**: Server-rendered pages with dedicated Add/Edit profile screens
- **Deployment**: Vercel with environment-based configuration

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  Next.js App Router                     ││
│  │  ┌────────────────┐    ┌─────────────────────────────┐  ││
│  │  │  Frontend      │    │   API Routes                │  ││
│  │  │  Pages         │───▶│   /api/profile (GET/POST)   │  ││
│  │  │  /             │    │   /api/projects             │  ││
│  │  │  /profile/[id] │    │   /api/skills/top           │  ││
│  │  │  /profile/new  │    │   /api/profile/:id (PUT)    │  ││
│  │  │  /profile/[id]/edit │                             │  ││
│  │  │  /projects     │    │   /api/search               │  ││
│  │  │  /search       │    │   /api/health               │  ││
│  │  └────────────────┘    │                             │  ││
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
| **Tailwind**    | Styling               | Utility-first CSS, configured for custom Glassmorphism design system   |
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

## 📡 API Reference

### Health Check

```bash
curl https://your-app.vercel.app/api/health
```

### Get All Profiles

```bash
curl https://your-app.vercel.app/api/profile
```

### Create Profile

````bash
curl -X POST https://your-app.vercel.app/api/profile \
  -H "Content-Type: application/json" \
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

### Update Profile

```bash
curl -X PUT https://your-app.vercel.app/api/profile/<profile-id> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "summary": "Updated summary",
    "skills": ["TypeScript", "React", "Node.js"],
    "links": {"github": "https://github.com/janedoe"}
  }'
````

```

---

## 📁 Project Structure

```

├── drizzle/ # Generated SQL migrations
├── src/
│ ├── app/
│ │ ├── api/ # API Routes
│ │ ├── profile/[id]/ # Profile Details Page
│ │ ├── profile/[id]/edit # Edit Profile Page
│ │ ├── profile/new/ # New Profile Page
│ │ ├── projects/ # Projects Discovery
│ │ ├── search/ # Search Page
│ │ ├── globals.css # Tailwind & Theme Variables
│ │ ├── layout.tsx # Root Layout
│ │ └── page.tsx # Home (Directory)
│ ├── components/
│ │ ├── AddProfileButton.tsx # Link to create page
│ │ ├── AddProfileForm.tsx # Add profile form
│ │ ├── EditProfileForm.tsx # Edit profile form
│ │ ├── HealthCheckModal.tsx # API Status popup
│ ├── db/
│ │ ├── index.ts # Database client
│ │ ├── schema.ts # Drizzle schema
│ │ └── seed.ts # Seed script
│ └── lib/
│ ├── api-client.ts # Frontend API client
│ └── validators.ts # Zod schemas
├── package.json
└── README.md

```

---

## ⚠️ Limitations & Notes

1. **Public Creation**: Currently, anyone can add or edit a profile. There is no authentication required for the `POST`/`PUT` endpoints.
2. **No Delete**: Profiles can be created and edited, but not deleted via the UI in this version.
3. **Pagination**: The directory page fetches all profiles. Pagination would be needed for production scaling.
4. **Client Search**: The search uses a combination of API filtering and client-side state.

---

## ✨ Features Implemented

- ✅ **Multi-Profile Directory**: Support for unlimited profiles.
- ✅ **Glassmorphism UI**: Custom design with blurs, gradients, and translucency.
- ✅ **Animations**: Fluid entrance animations (`fade-up`, `float`).
- ✅ **Dedicated Add/Edit Pages**: Full-page create and edit forms (no modals).
- ✅ **Input Validation**: Zod schemas for all API inputs.
- ✅ **Indexing**: Postgres GIN indexes on JSONB and Array columns for fast filtering.
- ✅ **Health Monitoring**: Built-in API status check modal.
- ✅ **Full TypeScript**: End-to-end type safety.

---

## 📜 License

MIT
```
