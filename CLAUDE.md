# S4F3 — CLAUDE.md

## 🎯 Overview
- **One-liner:** AI-powered cross-platform bookmarking — save from any platform, AI organizes everything, find anything in seconds
- **Type:** Web2 / AI / Full-stack
- **Status:** 🟢 Building — Sprint 1

## 🏗️ Tech Stack
- **Frontend:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui
- **Backend:** Python 3.11 + FastAPI + LangChain
- **Database:** PostgreSQL (Neon) + pgvector
- **AI:** Groq (Llama 3 70B) for summaries/tags/chat
- **Auth:** Supabase Auth
- **State:** Zustand
- **Tables:** TanStack Table
- **Animations:** Framer Motion
- **Deploy:** Vercel (frontend) + Railway (backend)

## 📁 Structure
```
s4f3/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
├── backend/           # FastAPI
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── main.py
├── CLAUDE.md
└── README.md
```

## ⚡ Build Order
1. Foundation: Scaffold + deps (10 min)
2. Core: Capture + AI + Library (30 min)
3. Ship: Deploy + README (15 min)

## 🔐 Security
1. NEVER commit .env
2. Validate ALL user inputs
3. No console.log in production
4. Handle loading/empty/error states

## ✅ Quality Gates
- [ ] .env.example exists
- [ ] .env in .gitignore
- [ ] Type check passes
- [ ] Happy path works
- [ ] README written
