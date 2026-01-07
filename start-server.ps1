# Script pour démarrer le serveur Web Artisant
$ErrorActionPreference = "Stop"

Write-Host "🚀 Démarrage du serveur Web Artisant..." -ForegroundColor Green
Write-Host ""

# Vérifier que Node.js est disponible
$nodePath = "C:\Program Files\nodejs\node.exe"
if (-not (Test-Path $nodePath)) {
    Write-Host "❌ Node.js n'est pas trouvé à $nodePath" -ForegroundColor Red
    exit 1
}

# Changer vers le répertoire du projet
Set-Location $PSScriptRoot

# Démarrer le serveur
Write-Host "📡 Le serveur démarre sur http://localhost:3000" -ForegroundColor Cyan
Write-Host "📊 Interface admin: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

& $nodePath server.js

