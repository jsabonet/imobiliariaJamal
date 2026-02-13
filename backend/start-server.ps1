# Script para iniciar o servidor Django com o ambiente virtual correto
# Uso: .\start-server.ps1

Write-Host "🚀 Iniciando IJPS Imobiliária - Backend Django" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Verificar se está no diretório correto
if (-not (Test-Path "manage.py")) {
    Write-Host "❌ Erro: Este script deve ser executado no diretório backend/" -ForegroundColor Red
    exit 1
}

# Ativar ambiente virtual
Write-Host "📦 Ativando ambiente virtual..." -ForegroundColor Yellow
& ..\. venv\Scripts\Activate.ps1

# Verificar se ativou corretamente
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao ativar ambiente virtual" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Ambiente virtual ativado" -ForegroundColor Green

# Iniciar servidor
Write-Host "`n🌐 Iniciando servidor Django..." -ForegroundColor Yellow
Write-Host "   URL: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   Admin: http://localhost:8000/admin" -ForegroundColor Cyan
Write-Host "   API: http://localhost:8000/api" -ForegroundColor Cyan
Write-Host "`n   Pressione Ctrl+C para parar o servidor`n" -ForegroundColor Gray
Write-Host "=" * 60 -ForegroundColor Cyan

python manage.py runserver
