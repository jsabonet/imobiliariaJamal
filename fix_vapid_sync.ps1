# Script PowerShell para executar a correção remotamente
# Uso: .\fix_vapid_sync.ps1

Write-Host "🔧 ════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔧 CORREÇÃO: Sincronizar Chaves VAPID Frontend/Backend" -ForegroundColor Cyan
Write-Host "🔧 ════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$vapidKey = "BMyY0-GCcnmKgCmz47nrzNY0p-TKZt6HnPQfep4Zm5eA1OyJzqqdZvJNVScEZd84chX3cDqOxmVefMoNEPEy-mA"

Write-Host "📤 Enviando script de correção para o servidor..." -ForegroundColor Yellow
scp fix_vapid_sync.sh root@209.38.236.166:/tmp/

Write-Host ""
Write-Host "🚀 Executando correção no servidor..." -ForegroundColor Yellow
ssh root@209.38.236.166 "bash /tmp/fix_vapid_sync.sh"

Write-Host ""
Write-Host "✅ Script executado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Agora faça:" -ForegroundColor Cyan
Write-Host "   1. Abra https://imobiliariajamal.com" -ForegroundColor White
Write-Host "   2. F12 > Application > Clear site data" -ForegroundColor White
Write-Host "   3. Ctrl+Shift+R para recarregar" -ForegroundColor White
Write-Host "   4. Clique no 🔔 e permita notificações" -ForegroundColor White
Write-Host "   5. Crie uma propriedade no Admin" -ForegroundColor White
Write-Host "   6. Aguarde a notificação! 📱" -ForegroundColor White
Write-Host ""
