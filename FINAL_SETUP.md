# 🚀 COMPLETE SETUP GUIDE

## Step 1: Update Database (5 minutes)

Open **pgAdmin** → Connect to PostgreSQL → Run this SQL:

```sql
-- Create new database
CREATE DATABASE civicsense2;

-- Connect to civicsense2 and run:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'department')),
    department_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    citizen_name VARCHAR(255),
    citizen_phone VARCHAR(20),
    complaint_text TEXT NOT NULL,
    category VARCHAR(50),
    priority VARCHAR(20),
    sentiment_score FLOAT,
    urgency_keywords TEXT[],
    status VARCHAR(50) DEFAULT 'pending',
    department VARCHAR(100),
    location VARCHAR(255),
    image_url TEXT,
    audio_url TEXT,
    language VARCHAR(10) DEFAULT 'en',
    duplicate_group_id INTEGER,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20)
);

INSERT INTO departments (name, category, email, phone) VALUES
('Sanitation Department', 'Sanitation', 'sanitation@civic.gov', '1234567890'),
('Public Works Department', 'Infrastructure', 'pwd@civic.gov', '1234567891'),
('Police Department', 'Safety', 'police@civic.gov', '1234567892');

INSERT INTO users (name, email, phone, password, role, department_name) VALUES
('Sanitation Dept', 'sanitation@civic.gov', '1234567890', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department', 'Sanitation Department'),
('Public Works Dept', 'pwd@civic.gov', '1234567891', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department', 'Public Works Department'),
('Police Dept', 'police@civic.gov', '1234567892', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department', 'Police Department');

CREATE TABLE hotspots (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255),
    category VARCHAR(50),
    complaint_count INTEGER DEFAULT 1,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(location, category)
);

CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_location ON complaints(location);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
```

## Step 2: Update Backend .env

Edit `backend/.env`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=civicsense2
DB_USER=postgres
DB_PASSWORD=srushti@2026#DB
GEMINI_API_KEY=AIzaSyBeBFyMCeCyGaKWA9hzbBp_UQi-lKDJexc
JWT_SECRET=civicsense_secret_key_2026
```

## Step 3: Restart Backend

```bash
cd backend
npm run dev
```

## Step 4: Test

1. Go to: http://localhost:5173/
2. You'll see the new landing page
3. Click "Login as Citizen" or "Login as Department"
4. Test login with: sanitation@civic.gov / admin123

## 🎯 NEW FEATURES

✅ Creative landing page with role selection
✅ Separate citizen and department portals
✅ Profile page
✅ Protected routes (must login)
✅ Role-based navigation
✅ Department users can update complaint status

## 📱 DEMO ACCOUNTS

**Department:**
- sanitation@civic.gov / admin123
- pwd@civic.gov / admin123
- police@civic.gov / admin123

**Citizen:**
- Register new account at /login

## 🎤 DEMO FLOW

1. **Landing Page** → Shows two portals
2. **Citizen Login** → Register → Submit complaint → View in "My Complaints"
3. **Department Login** → View dashboard → Update status to "in-progress" or "resolved"
4. **Profile** → View user details → Logout

Done! 🚀
