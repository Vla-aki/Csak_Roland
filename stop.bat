@echo off
title HoverHire - Leállítás
echo ========================================
echo    HOVERHIRE - Rendszer leállítása
echo ========================================
echo.

echo Konténerek leállítása...
cd /d C:\Csak_Roland
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