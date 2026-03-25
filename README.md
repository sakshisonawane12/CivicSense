# CivicSense - AI-Driven Civic Complaint Management System

![Stack](https://img.shields.io/badge/Stack-PERN-blue)
![AI](https://img.shields.io/badge/AI-Gemini-orange)
![Auth](https://img.shields.io/badge/Auth-JWT-green)

## Overview

CivicSense is an AI-powered civic complaint management platform that automatically classifies, prioritizes, and routes citizen grievances to the appropriate government departments using Google Gemini AI.

## Features

- **AI Classification** - Auto-categorizes complaints into Sanitation, Infrastructure, Safety
- **Sentiment Analysis** - Detects urgency and assigns High/Medium/Low priority
- **Duplicate Detection** - 70% similarity threshold prevents spam
- **Map Analytics** - Real-time heatmap of complaint hotspots across Pune
- **Reward System** - Points, badges and leaderboard for civic contributors
- **Authentication** - JWT-based login for Citizens and Departments
- **Multi-lingual** - English, Hindi, Marathi with AI translation
- **Voice & Image** - Audio recording and photo upload support
- **Complaint Tracking** - Track by ID or phone number

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| AI | Google Gemini API |
| Maps | Leaflet.js + OpenStreetMap |
| Auth | JWT + bcrypt |

## Setup

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Google Gemini API Key

### 1. Database Setup

Create database `civicsense2` in pgAdmin and run `backend/database.sql`

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=civicsense2
DB_USER=postgres
DB_PASSWORD=your_password
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_secret_key
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Department | sanitation@civic.gov | admin123 |
| Department | pwd@civic.gov | admin123 |
| Department | police@civic.gov | admin123 |
| Citizen | Register at /login | - |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/complaints | Submit complaint |
| GET | /api/complaints | Get all complaints |
| GET | /api/complaints/track | Track by ID or phone |
| GET | /api/complaints/my-complaints | Get user complaints |
| PATCH | /api/complaints/:id/status | Update status |
| GET | /api/complaints/hotspots | Get hotspot areas |
| GET | /api/complaints/stats | Dashboard stats |
| GET | /api/rewards/leaderboard | Top citizens |
| GET | /api/rewards/my-stats | User reward stats |
