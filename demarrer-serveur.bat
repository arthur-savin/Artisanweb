@echo off
echo ========================================
echo   Demarrage du serveur Web Artisant
echo ========================================
echo.
echo Le serveur va demarrer sur http://localhost:3000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
echo ========================================
echo.

cd /d "%~dp0"
"C:\Program Files\nodejs\node.exe" server.js

pause

