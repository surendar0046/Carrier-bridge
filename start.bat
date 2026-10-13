@echo off
title Career Bridge Dev Runner
echo ========================================================
echo   Starting Career Bridge Monorepo (Web + Gateway)
echo ========================================================
echo.

cd /d "%~dp0"
call pnpm.cmd run dev

pause
