@echo off
chcp 65001 >nul
title HoverHire - Leállítás
echo ========================================
echo    HOVERHIRE - Rendszer leállítása
echo ========================================
echo.

echo Konténerek leállítása...
cd /d "%~dp0"
docker-compose down
echo.

echo Frontend terminálok bezárása...
taskkill /f /im cmd.exe /fi "windowtitle eq *npm run dev*"
taskkill /f /im node.exe /t 2>nul
echo.

echo ========================================
echo ✓ Minden leállt!
echo ========================================
pause