@echo off
title Zimbabwe Tourism Platform - Presidential Demo
color 0E

echo =========================================================
echo       ZIMBABWE TOURISM PLATFORM - PRESIDENTIAL DEMO
echo                     GOLDEN EDITION
echo =========================================================
echo.
echo Launching the Microservices Presentation Suite...
echo.

echo Starting services via Docker...
powershell -ExecutionPolicy Bypass -File "%~dp0demo.ps1"

echo Opening browsers...
start http://localhost:3003
start http://localhost:3002
start http://localhost:3001

echo.
echo Servers started successfully. Press any key to close this window...
pause >nul
