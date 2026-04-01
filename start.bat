@echo off
title HoverHire - Indítás
echo ========================================
echo    HOVERHIRE - Rendszer indítása
echo ========================================
echo.

echo [1/3] Backend és adatbázis indítása...
cd /d C:\Csak_Roland
docker-compose up -d
echo ✓ Backend fut a háttérben
echo.

echo [2/3] Várakozás a backend indulására...
timeout /t 3 /nobreak >nul
echo.

echo [3/3] Frontend indítása...
cd /d C:\Csak_Roland\dronsag\frontend
start cmd /k "npm run dev"
echo.

echo ========================================
echo ✓ Minden elindult!
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo phpMyAdmin: http://localhost:8081
echo.
echo A frontend terminálablaka külön nyílik.
echo Ha végzel, a leállításhoz írd be: stop
echo ========================================