# 📦 Installation Guide

## Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

## Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Database (Neon)
1. Go to https://console.neon.tech
2. Create a new project
3. Run the SQL in `backend/migrations/001_initial.sql`
4. Copy the connection string to `backend/.env`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/s4f3?sslmode=require
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## Deploy

### Frontend → Vercel
```bash
cd frontend
npx vercel
```

### Backend → Railway
```bash
cd backend
railway init
railway up
```
