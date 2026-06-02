@echo off
title Zimbabwe Tourism Platform - Presidential Demo
color 0E

echo =========================================================
echo       ZIMBABWE TOURISM PLATFORM - PRESIDENTIAL DEMO
echo                     GOLDEN EDITION
echo =========================================================
echo.
echo Starting all services for the presentation...
echo.

echo Starting Backend API Server...
start "Backend Server (Port 3000)" cmd /k "npm run dev"

echo Starting Traveler Portal...
start "Traveler Portal (Port 3003)" cmd /k "cd apps\traveler-portal && npm run dev"

echo Starting Government Portal...
start "Government Portal (Port 3002)" cmd /k "cd apps\government-portal && npm run dev"

echo Starting Operator Dashboard...
start "Operator Dashboard (Port 3001)" cmd /k "cd apps\operator-dashboard && npm run dev"

echo.
echo All services are starting up! Please wait 10-15 seconds.
echo.
echo =========================================================
echo                    PLATFORM LINKS
echo =========================================================
echo.
echo 1. Traveler Portal    -^>  http://localhost:3003
echo 2. Government Portal  -^>  http://localhost:3002
echo 3. Operator Dashboard -^>  http://localhost:3001
echo.
echo =========================================================
echo Close this window or press any key to exit this launcher.
echo (The terminal windows for the servers will stay open)
pause >nul
