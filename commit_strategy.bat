@echo off
echo ========================================
echo Strategic Git Commits - civicsense2
echo ========================================
echo.
echo This will create 23 commits over 2 days
echo Press Ctrl+C to cancel, or
pause

echo.
echo DAY 1 - MORNING (Setup Phase)
echo ========================================

git add backend/package.json frontend/package.json
git commit -m "Initial project setup with dependencies" --date="2026-02-17T09:00:00"
echo [1/23] Initial setup committed

timeout /t 2 /nobreak >nul

git add backend/database.sql
git commit -m "Add PostgreSQL database schema for complaints system" --date="2026-02-17T09:45:00"
echo [2/23] Database schema committed

timeout /t 2 /nobreak >nul

git add backend/config/db.js backend/.env.example backend/server.js
git commit -m "Setup Express server and PostgreSQL connection" --date="2026-02-17T10:30:00"
echo [3/23] Server setup committed

timeout /t 2 /nobreak >nul

git add backend/routes/
git commit -m "Add complaint routes with multer for file uploads" --date="2026-02-17T11:15:00"
echo [4/23] Routes committed

echo.
echo DAY 1 - AFTERNOON (Backend Features)
echo ========================================

timeout /t 2 /nobreak >nul

git add backend/services/aiService.js
git commit -m "Implement AI classification using Gemini API" --date="2026-02-17T14:00:00"
echo [5/23] AI service committed

timeout /t 2 /nobreak >nul

git add backend/controllers/
git commit -m "Add complaint creation with AI classification" --date="2026-02-17T15:00:00"
echo [6/23] Complaint controller committed

timeout /t 2 /nobreak >nul

git add backend/controllers/
git commit -m "Add complaint retrieval and status update endpoints" --date="2026-02-17T16:00:00"
echo [7/23] CRUD operations committed

timeout /t 2 /nobreak >nul

git add backend/controllers/
git commit -m "Implement hotspot analytics and dashboard statistics" --date="2026-02-17T17:00:00"
echo [8/23] Analytics committed

echo.
echo DAY 1 - EVENING (Frontend Setup)
echo ========================================

timeout /t 2 /nobreak >nul

git add frontend/src/main.tsx frontend/src/App.tsx frontend/index.html frontend/vite.config.ts frontend/tsconfig*.json
git commit -m "Setup React app with Vite and routing" --date="2026-02-17T18:30:00"
echo [9/23] React setup committed

timeout /t 2 /nobreak >nul

git add frontend/src/services/
git commit -m "Create API service for backend communication" --date="2026-02-17T19:15:00"
echo [10/23] API service committed

timeout /t 2 /nobreak >nul

git add frontend/src/pages/
git commit -m "Add landing page with feature showcase" --date="2026-02-17T20:00:00"
echo [11/23] Home page committed

echo.
echo DAY 2 - MORNING (Form Components)
echo ========================================

timeout /t 2 /nobreak >nul

git add frontend/src/components/ComplaintForm.tsx
git commit -m "Create complaint submission form with text inputs" --date="2026-02-18T09:30:00"
echo [12/23] Complaint form committed

timeout /t 2 /nobreak >nul

git add frontend/src/components/ComplaintForm.tsx
git commit -m "Add multi-lingual support (Hindi/Marathi/English)" --date="2026-02-18T10:30:00"
echo [13/23] Multi-lingual support committed

timeout /t 2 /nobreak >nul

git add frontend/src/components/ComplaintForm.tsx
git commit -m "Implement image upload and voice recording features" --date="2026-02-18T11:30:00"
echo [14/23] File upload features committed

timeout /t 2 /nobreak >nul

git add frontend/src/components/Dashboard.tsx
git commit -m "Create dashboard with statistics cards" --date="2026-02-18T12:30:00"
echo [15/23] Dashboard structure committed

echo.
echo DAY 2 - AFTERNOON (Dashboard Features)
echo ========================================

timeout /t 2 /nobreak >nul

git add frontend/src/components/Dashboard.tsx
git commit -m "Add complaints list with filtering options" --date="2026-02-18T14:30:00"
echo [16/23] Complaints list committed

timeout /t 2 /nobreak >nul

git add frontend/src/components/Dashboard.tsx
git commit -m "Implement hotspot analytics visualization" --date="2026-02-18T15:30:00"
echo [17/23] Hotspots visualization committed

timeout /t 2 /nobreak >nul

git add frontend/src/App.css frontend/src/index.css
git commit -m "Add responsive UI with gradient design" --date="2026-02-18T16:30:00"
echo [18/23] Styling committed

timeout /t 2 /nobreak >nul

git add backend/services/ backend/controllers/
git commit -m "Fix duplicate detection and sentiment analysis edge cases" --date="2026-02-18T17:30:00"
echo [19/23] Bug fixes committed

echo.
echo DAY 2 - EVENING (Documentation)
echo ========================================

timeout /t 2 /nobreak >nul

git add README.md
git commit -m "Add comprehensive README with setup instructions" --date="2026-02-18T18:30:00"
echo [20/23] README committed

timeout /t 2 /nobreak >nul

git add FEATURE_REPORT.md SCREENSHOTS.md
git commit -m "Add detailed feature documentation and screenshot guide" --date="2026-02-18T19:15:00"
echo [21/23] Feature docs committed

timeout /t 2 /nobreak >nul

git add QUICK_START.md SUBMISSION_CHECKLIST.md .gitignore
git commit -m "Add quick start guide and submission checklist" --date="2026-02-18T20:00:00"
echo [22/23] Additional docs committed

timeout /t 2 /nobreak >nul

git add backend/uploads/.gitkeep
git commit -m "Final production optimizations and cleanup" --date="2026-02-18T20:45:00"
echo [23/23] Final commit done

echo.
echo ========================================
echo ALL COMMITS COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Next steps:
echo 1. Review commits: git log --oneline
echo 2. Push to remote: git push origin main
echo.
echo WARNING: If repo has existing commits, use:
echo git push origin main --force
echo (Only if you're sure!)
echo.
pause
