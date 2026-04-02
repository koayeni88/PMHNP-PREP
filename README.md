# PMHNP Exam Prep — Clinical Reasoning Development Platform

A modern, responsive question bank and clinical reasoning development platform for Psychiatric-Mental Health Nurse Practitioner (PMHNP) certification preparation.

## Core Educational Model: Benner's Clinical Competence Framework

Questions and study pathways align with five stages of skill acquisition:

| Stage | Focus |
|---|---|
| **Novice** | Basic facts, definitions, recognition |
| **Advanced Beginner** | Simple patient scenarios, pattern recognition |
| **Competent** | Clinical prioritization, differential thinking, management |
| **Proficient** | Complex case interpretation, nuanced decisions |
| **Expert** | Integrated psychiatric reasoning, subtle distinctions |

## 3P Categories
- **Pathophysiology** — Neural circuits, neurotransmitter systems, disease mechanisms
- **Pharmacology** — Psychotropic medications, mechanisms, interactions, side effects
- **Physical Assessment** — Mental status exam, psychiatric evaluation, screening tools

## Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express + SQLite (Prisma ORM)
- **Auth:** JWT with bcrypt
- **State:** Zustand

## Quick Start

```bash
# Install dependencies
npm run install:all
# or individually:
cd server && npm install
cd ../client && npm install

# Configure environment
cp server/.env.example server/.env
# Edit server/.env with your JWT_SECRET

# Set up database
cd server
npx prisma migrate dev
npx prisma db seed

# Run development
npm run dev:server   # API on :3001
npm run dev:client   # UI on :5173
```

## Production Deployment

```bash
# Install dependencies
npm run install:all

# Configure production environment
cp server/.env.example server/.env
# Set NODE_ENV=production, a strong JWT_SECRET, and CORS_ORIGIN

# Build
npm run build        # generates Prisma client + Vite build

# Run migrations
npm run migrate

# Start (serves both API and client)
npm start
```

## Features
- Student & Admin dashboards
- Searchable question bank with Benner-level tags
- Custom quiz builder (timed/untimed)
- Full exam simulator (150 questions, 3.5 hours)
- Progress tracking by 3P category and Benner stage
- Bookmarks and notes
- Clinical reasoning ladder / progression map
- Subscription-ready architecture
