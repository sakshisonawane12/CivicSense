# CivicSense - AI-Driven Civic Complaint Management System

![Stack](https://img.shields.io/badge/Stack-MERN%2BML-blue)
![AI](https://img.shields.io/badge/AI-Gemini%20%2B%20Scikit--Learn-orange)
![Auth](https://img.shields.io/badge/Auth-JWT-green)

## Overview

CivicSense is an AI-powered civic complaint platform for citizens and departments. It supports complaint submission, tracking, map analytics, and AI-based decision support.

The project now includes:
- LLM + ML-driven complaint intelligence
- TruthScore and anti-spam evidence signals
- Outcome optimizer with recommended SLA/priority/department
- Future hotspot prediction for preventive civic action

## Current Architecture

| Layer | Technology |
|------|------|
| Frontend | React 19, TypeScript, Vite |
| Backend API | Node.js, Express |
| Primary Database | MongoDB (Mongoose) |
| LLM | Google Gemini |
| ML Service | FastAPI + scikit-learn |
| Maps | Leaflet + OpenStreetMap |
| Auth | JWT + bcrypt |

## Repository Structure

- `frontend/` - React app
- `backend/` - Node/Express API and MongoDB models
- `ml/` - model training scripts, artifacts, FastAPI inference service

## Prerequisites

- Node.js `18+`
- Python `3.11+`
- MongoDB Atlas/local MongoDB
- Gemini API key (optional fallback AI route still uses it)

## Environment Variables

### `backend/.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://127.0.0.1:8001
```

### `ml/.env` (optional but recommended)

```env
MONGODB_URI=your_mongodb_uri
```

> Use the same MongoDB URI for backend and ML so training uses the same complaint data.

## Quick Start (Run Full Project)

Open 3 terminals from project root.

### 1) Run backend

```bash
cd backend
npm install
npm run dev
```

Backend starts at `http://localhost:5000`.

### 2) Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`.

### 3) Run ML service (recommended for full AIML behavior)

```powershell
cd ml
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python generate_synthetic_data.py --n 1200 --clear
python train_models.py
uvicorn service:app --port 8001
```

ML inference starts at `http://127.0.0.1:8001`.

## Verify Everything Is Working

### Backend
- Open `http://localhost:5000/` -> should return API running message.

### ML service
- Open `http://127.0.0.1:8001/health` -> should return `ok: true` and model availability.

### Frontend
- Submit a complaint from `Report Issue`.
- Check `My Logs` / `Track Status`.
- You should see AI fields:
  - `TruthScore`
  - `Recommended Priority`
  - `Recommended SLA`
  - `Recommended Department`

### API checks (PowerShell)

```powershell
Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8001/predict/category" -ContentType "application/json" -Body '{"text":"Garbage overflowing near Kothrud"}'
Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8001/predict/truth" -ContentType "application/json" -Body '{"text_len":120,"has_media":1,"hour":12,"dow":2,"phone_2d_count":0,"loccat_count":3}'
Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8001/predict/sla" -ContentType "application/json" -Body '{"cat_id":1,"loc_id":12345,"hour":12,"dow":2,"text_len":120,"has_media":1}'
```

## Core Features

- Complaint submission with text + image/audio
- Category classification (`Sanitation`, `Infrastructure`, `Safety`)
- TruthScore and evidence flags
- Duplicate/cluster signal checks
- Outcome optimizer (department + priority + SLA recommendation)
- Future hotspot forecasting (`/api/complaints/future-hotspots`)
- Leaderboard and reward points
- Track by complaint ID or phone number

## Important Endpoints

| Method | Endpoint | Purpose |
|------|------|------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/complaints` | Submit complaint with AI outputs |
| GET | `/api/complaints/my-complaints` | Complaints by logged-in user |
| GET | `/api/complaints/track?id=...` | Track by complaint ID |
| GET | `/api/complaints/track?phone=...` | Track by phone |
| GET | `/api/complaints/hotspots` | Current hotspots |
| GET | `/api/complaints/future-hotspots` | Predicted hotspots |
| GET | `/api/complaints/stats` | Dashboard stats |

## Troubleshooting

### PowerShell `curl` errors
Use `Invoke-RestMethod` instead of `curl -H -d`.

### `POST /predict/sla` returns 422
Request body is missing required fields or has invalid numeric ranges. Use the exact payload shown above.

### ML service starts but some models are `false` in `/health`
Re-run:
```powershell
python train_models.py
```
Then restart:
```powershell
uvicorn service:app --port 8001
```

### No complaints in My Logs
If complaints were submitted before login, use phone tracking or ensure account phone matches complaint phone.

## Contributor Notes

- Keep backend and ML service contracts in sync (payload fields and ranges).
- If model schema changes, re-run training and regenerate `ml/artifacts/`.
- Avoid committing secrets from `.env`.
- Test all three services (frontend, backend, ml) before opening PRs.
