# 🔗 S4F3 — Save Smarter with AI

> AI-powered cross-platform bookmarking — save from any platform, AI organizes everything, find anything in seconds.

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
| Deploy | Vercel + Railway |

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Database
1. Create a Neon PostgreSQL database
2. Run `backend/migrations/001_initial.sql`
3. Add your `DATABASE_URL` to `backend/.env`

## 📁 Project Structure

```
s4f3/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Zustand store
│   │   ├── lib/           # API client, utils
│   │   └── types/         # TypeScript types
│   └── package.json
├── backend/               # FastAPI
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── core/          # Config, database
│   │   ├── models/        # SQLAlchemy models
│   │   └── services/      # AI services
│   ├── migrations/        # SQL migrations
│   └── requirements.txt
├── CLAUDE.md              # AI rules
└── README.md
```

## 🔐 Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `GROQ_API_KEY` | Groq API key for AI features |

## 📊 Status

- [x] Backend API (FastAPI)
- [x] Frontend UI (React + Vite)
- [x] AI Integration (Groq)
- [ ] Database setup
- [ ] Deployment

## 📝 License

MIT
