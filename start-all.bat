@echo off
REM Start Mock Backend and Frontend together on Windows
echo Starting VPN Monitor (Frontend + Mock Backend)...
echo.
echo Starting Mock Backend on http://localhost:8080
echo Starting Frontend on http://localhost:3000
echo.
start "Mock Backend" cmd /k "npm run backend"
timeout /t 2
start "Frontend" cmd /k "npm run dev"
echo Both servers started in separate windows!
