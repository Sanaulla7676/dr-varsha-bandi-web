@echo off
echo ==================================================
echo [Dr. Varsha Bandi] - Full Stack System Starter
echo ==================================================
echo.
echo Starting Backend (API + Public Site)...
start cmd /k "cd backend && node server.js"
echo Starting Admin Dashboard (React)...
start cmd /k "npm run dev"
echo.
echo ==================================================
echo [URLs]
echo Admin Dashboard:   http://localhost:5173
echo Public Website:    http://localhost:5000/site/
echo ==================================================
echo.
pause
