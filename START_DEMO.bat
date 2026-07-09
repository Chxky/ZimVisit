@echo off
title ZimVisit - Investor Demo Suite
color 0A

echo =========================================================
echo          ZimVisit Investor Demo Suite
echo      Zimbabwe's Tourism Digitization Platform
echo =========================================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0start-presentation.ps1"

echo.
pause
