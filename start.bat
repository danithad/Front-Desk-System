@echo off
echo Starting Front Desk System...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run start:dev"

echo.
echo Starting Frontend Server...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Default login credentials:
echo Email: admin@clinic.com
echo Password: admin123
echo.
pause
