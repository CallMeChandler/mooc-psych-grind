# Psych Grind — Psychology of Learning MCQ Trainer

A gamified Next.js trainer for the 120-question NPTEL/SWAYAM *Psychology of Learning* pool (Weeks 1–12).

## Features

- Week-wise practice with instant right/wrong feedback
- 120-question mixed mode with selectable quiz sizes
- 75-question exam simulator
- Weak-question drill generated from local performance
- Local progress, history, accuracy, streak-like mastery stats
- Google/GitHub OAuth via NextAuth
- Optional Upstash Redis global leaderboard + analytics
- Admin dashboard for users, attempts, hardest questions, and aggregate performance
- Animated responsive UI built for mobile grinding
- Week 12 warning because the supplied PDF says its official key was not released yet

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Fill `.env` locally. On Vercel, copy the same variable names into **Project → Settings → Environment Variables**.

### OAuth callbacks

Google/GitHub should use:

```text
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
```

For production, replace `http://localhost:3000` with your Vercel domain.

## Data model

The question bank is completely static in `data/questions.json`, so no database is needed for quiz content. Browser localStorage powers personal progress even when logged out. Upstash Redis is only used for global stats, leaderboards, and the admin dashboard.

## Important source note

Weeks 1–11 are based on released portal answer keys in the supplied PDF. Week 12 is marked provisional because the PDF states those are submitted answers and the official key was not yet released.
