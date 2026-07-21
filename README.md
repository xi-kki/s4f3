# 🔗 S4F3 — Save Smarter with AI

> AI-powered cross-platform bookmarking — save from any platform, AI organizes everything, find anything in seconds.

## 🚀 Live Demo

**[https://s4f3.vercel.app](https://s4f3.vercel.app)**

## ✨ Features

- **⚡ One-Click Save** — Save links from YouTube, Instagram, TikTok, X, any website
- **🧠 AI Intelligence** — Auto-summarize, auto-tag, auto-group with Groq AI
- **🔍 Semantic Search** — Find anything using natural language with pgvector
- **💬 AI Chat** — "Show me React tutorials" — finds them instantly
- **📁 Smart Collections** — AI auto-groups your saves by topic
- **🎨 Multiple Views** — Grid, List, Table, Kanban
- **❤️ Favorites** — Quick access to your most important saves

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript + Tailwind |
| Backend | Python FastAPI + SQLAlchemy |
| Database | PostgreSQL + pgvector |
| AI | Groq (Llama 3 70B) |
| State | Zustand |
| Deploy | Vercel (Full-Stack) |

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
pip install -r requirements.txt
uvicorn api.index:app --reload
```

### Database
1. Create a Neon PostgreSQL database
2. Run `backend/migrations/001_initial.sql`
3. Add your `DATABASE_URL` to `.env`

## 📁 Project Structure

```
s4f3/
├── api/                 # Vercel Serverless Functions
│   └── index.py        # FastAPI entry point
├── app/                 # Backend application
│   ├── api/             # API routes
│   ├── core/            # Config, database, auth
│   ├── models/          # SQLAlchemy models
│   └── services/        # AI services
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Zustand store, auth
│   │   ├── lib/         # API client, utils
│   │   └── types/       # TypeScript types
│   └── package.json
├── CLAUDE.md            # AI rules
├── README.md
└── vercel.json          # Vercel config
```

## 🔐 Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `GROQ_API_KEY` | Groq API key for AI features |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret |

## 📊 Status

- [x] Backend API (FastAPI)
- [x] Frontend UI (React + Vite)
- [x] AI Integration (Groq)
- [x] Database setup (Neon PostgreSQL)
- [x] Deployment (Vercel Full-Stack)

## 📝 License

MIT
