@echo off
echo Menjalankan Backend dan Frontend...
start "GIS Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && npm start"
timeout /t 2 /nobreak >nul
start "GIS Frontend (Port 3000)" cmd /k "cd /d "%~dp0frontend" && npm start"
echo Kedua server telah dijalankan di jendela terpisah!
