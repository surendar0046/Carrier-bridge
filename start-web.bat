@echo off
title Career Bridge Web Frontend
echo ========================================================
echo   Starting Career Bridge Web Frontend (Port 3000)
echo ========================================================
echo.

cd /d "%~dp0apps\web"
call pnpm.cmd run dev

pause
