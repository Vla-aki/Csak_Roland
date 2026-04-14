@echo off
chcp 65001 >nul
title HoverHire - Indítás
echo ========================================
echo    HOVERHIRE - Rendszer indítása
echo ========================================
echo.

echo [1/4] Backend és adatbázis indítása...
cd /d "%~dp0"
docker-compose up -d mysql phpmyadmin backend
echo ✓ Backend fut a háttérben
echo.

echo [2/4] Várakozás a backend indulására...
timeout /t 3 /nobreak >nul
echo.

echo [3/4] Frontend függőségek ellenőrzése és telepítése (első indításnál eltarthat egy percig)...
cd /d "%~dp0hoverhire\frontend"
call npm install
echo.

echo [4/4] Frontend indítása...
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