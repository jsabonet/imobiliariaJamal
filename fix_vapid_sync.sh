#!/bin/bash
# Script para corrigir sincronização de chaves VAPID e deploy completo

echo "🔧 ════════════════════════════════════════════════════════"
echo "🔧 CORREÇÃO: Sincronizar Chaves VAPID Frontend/Backend"
echo "🔧 ════════════════════════════════════════════════════════"
echo ""

# Chave VAPID correta (backend)
VAPID_KEY="BMyY0-GCcnmKgCmz47nrzNY0p-TKZt6HnPQfep4Zm5eA1OyJzqqdZvJNVScEZd84chX3cDqOxmVefMoNEPEy-mA"

echo "📝 Passo 1: Atualizar frontend/.env.local em produção"
echo "   Chave VAPID: ${VAPID_KEY:0:20}..."

# Atualizar .env.local do frontend
cat > /opt/JamalImobiliaria/frontend/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api

# Django Admin URL
NEXT_PUBLIC_ADMIN_URL=https://imobiliariajamal.com/admin

# Media URL (para servir imagens)
NEXT_PUBLIC_MEDIA_URL=https://imobiliariajamal.com/media

# VAPID Public Key para Push Notifications (atualizada)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=$VAPID_KEY
EOF

echo "   ✅ Arquivo atualizado"
echo ""

echo "📝 Passo 2: Verificar alteração"
grep "NEXT_PUBLIC_VAPID_PUBLIC_KEY" /opt/JamalImobiliaria/frontend/.env.local
echo ""

echo "🔄 Passo 3: Reiniciar frontend"
cd /opt/JamalImobiliaria
sudo docker compose restart frontend
echo ""

echo "⏳ Aguardando frontend inicializar (10s)..."
sleep 10
echo ""

echo "✅ Passo 4: Verificar status dos containers"
sudo docker compose ps
echo ""

echo "📊 Passo 5: Verificar subscriptions ativas"
sudo docker compose exec backend python manage.py shell -c "from core.models import PushSubscription; print(f'Subscriptions ativas: {PushSubscription.objects.filter(is_active=True).count()}')"
echo ""

echo "🎉 ════════════════════════════════════════════════════════"
echo "🎉 CORREÇÃO APLICADA COM SUCESSO!"
echo "🎉 ════════════════════════════════════════════════════════"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "   1. Acesse: https://imobiliariajamal.com"
echo "   2. Abra DevTools (F12) > Application > Storage"
echo "   3. Clique em 'Clear site data'"
echo "   4. Recarregue a página (Ctrl+Shift+R)"
echo "   5. Clique no botão de notificações 🔔"
echo "   6. Permita quando solicitado"
echo "   7. Crie uma propriedade no Admin"
echo "   8. Aguarde a notificação! 📱"
echo ""
