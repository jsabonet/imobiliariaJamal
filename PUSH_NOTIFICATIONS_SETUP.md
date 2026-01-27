# Sistema de Notificações Push - Configuração Final

## ✅ Implementação Completa

Todo o código para notificações push foi implementado com sucesso! Agora siga os passos abaixo para ativar o sistema.

---

## 📋 Passos para Ativação

### 1. **Gerar Chaves VAPID** (no servidor)

```bash
# SSH no servidor
ssh root@209.38.236.166

# Entrar no container do backend
docker exec -it jamalimobiliaria-backend-1 /bin/bash

# Gerar chaves VAPID
python -c "from pywebpush import vapid_to_json; print(vapid_to_json(vapid.Vapid().generate_keys()))"
```

Isso gerará um JSON com `publicKey` e `privateKey`. **Guarde essas chaves com segurança!**

Exemplo de saída:
```json
{
  "publicKey": "BKxON...",
  "privateKey": "pQY..."
}
```

---

### 2. **Configurar Variáveis de Ambiente**

#### **Backend** (`backend/.env` ou settings.py)

Adicione ao arquivo de configuração:

```python
# Push Notifications
VAPID_PRIVATE_KEY = "pQY...sua-chave-privada..."
VAPID_CLAIMS_EMAIL = "mailto:contato@imobiliariajamal.com"
```

#### **Frontend** (`.env.local`)

Crie/edite o arquivo `frontend/.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BKxON...sua-chave-publica..."
NEXT_PUBLIC_API_URL="https://imobiliariajamal.com"
```

---

### 3. **Executar Migrações do Banco de Dados**

```bash
# No servidor, dentro do container backend
docker exec -it jamalimobiliaria-backend-1 python manage.py makemigrations
docker exec -it jamalimobiliaria-backend-1 python manage.py migrate
```

---

### 4. **Instalar Dependência Python**

```bash
# No servidor
cd /opt/JamalImobiliaria/backend
docker exec -it jamalimobiliaria-backend-1 pip install pywebpush==1.14.0
```

Ou rebuildar o container (já que pywebpush foi adicionado ao requirements.txt):

```bash
cd /opt/JamalImobiliaria
docker-compose-v2 stop backend
docker-compose-v2 up -d --build backend
```

---

### 5. **Rebuild Frontend** (para incluir variáveis de ambiente)

```bash
cd /opt/JamalImobiliaria
git pull
docker-compose-v2 stop frontend
docker-compose-v2 up -d --build frontend
```

---

## 🧪 Testar o Sistema

### 1. **Frontend - Ativar Notificações**

1. Acesse https://imobiliariajamal.com
2. Clique no botão "**Ativar Notificações**" no navbar
3. Permita notificações quando solicitado pelo navegador
4. Você deve receber uma notificação de teste imediatamente

### 2. **Backend - Criar Propriedade de Teste**

1. Acesse o painel admin: https://imobiliariajamal.com/dashboard
2. Crie uma nova propriedade
3. Todos os usuários inscritos devem receber uma notificação push automaticamente!

### 3. **Verificar Subscriptions**

Acesse o Django Admin para ver subscriptions registradas:
- URL: `https://imobiliariajamal.com/admin/core/pushsubscription/`
- Lista todos os dispositivos inscritos
- Mostra navegador, data de criação, status ativo/inativo

---

## 🔧 Arquivos Criados/Modificados

### Backend
- ✅ `backend/core/models.py` - Modelo PushSubscription
- ✅ `backend/core/serializers.py` - PushSubscriptionSerializer
- ✅ `backend/core/views.py` - API subscribe/unsubscribe
- ✅ `backend/core/api_urls.py` - Rotas de notificações
- ✅ `backend/core/notifications.py` - Lógica de envio (NOVO)
- ✅ `backend/core/signals.py` - Auto-notificação (NOVO)
- ✅ `backend/core/apps.py` - Registro de signals
- ✅ `backend/core/admin.py` - Admin para subscriptions
- ✅ `backend/requirements.txt` - pywebpush adicionado

### Frontend
- ✅ `frontend/public/sw.js` - Push event handlers
- ✅ `frontend/lib/notifications.ts` - Biblioteca de notificações (NOVO)
- ✅ `frontend/components/NotificationButton.tsx` - Botão de ativar/desativar (NOVO)
- ✅ `frontend/components/layout/Navbar.tsx` - Integração do botão

---

## 🚀 Funcionalidades Implementadas

### Automático
- ✅ Notificação push automática quando nova propriedade é criada
- ✅ Limpeza de subscriptions expiradas (erro 410)
- ✅ Suporte a múltiplos navegadores/dispositivos por usuário

### Manual (Futuro)
- Enviar notificações personalizadas via admin
- Notificações de promoções/eventos
- Segmentação por tipo de propriedade

---

## 📱 Navegadores Suportados

- ✅ Chrome (Desktop e Android)
- ✅ Firefox (Desktop e Android)
- ✅ Edge
- ✅ Safari 16+ (macOS)
- ❌ iOS Safari (não suporta push notifications PWA ainda)

---

## 🔐 Segurança

- Chaves VAPID mantidas seguras no backend
- CORS configurado para aceitar apenas domínio autorizado
- Subscriptions vinculadas a endpoints únicos
- Validação de dados no backend

---

## 📊 Monitoramento

### Ver Subscriptions Ativas
```python
# Django shell
python manage.py shell

from core.models import PushSubscription
print(f"Subscriptions ativas: {PushSubscription.objects.filter(is_active=True).count()}")
```

### Logs
- Verifique logs do backend para ver envios de notificações
- Service Worker console mostra recebimento de push

---

## 🐛 Troubleshooting

### Notificações não chegam?
1. Verificar permissão no navegador
2. Verificar console do navegador (F12)
3. Confirmar VAPID_PRIVATE_KEY no backend
4. Verificar logs do Django

### Subscription falha?
- Verificar CORS no backend
- Confirmar NEXT_PUBLIC_VAPID_PUBLIC_KEY no frontend
- Testar em modo privado/anônimo

### Service Worker não registra?
- Limpar cache do navegador
- Fazer hard refresh (Ctrl+Shift+R)
- Verificar se sw.js é acessível em /sw.js

---

## 📚 Próximos Passos (Opcional)

1. **Dashboard de Notificações**
   - Painel admin para enviar notificações manuais
   - Estatísticas de envio/entrega

2. **Segmentação**
   - Notificar apenas usuários interessados em tipos específicos
   - Filtrar por localização

3. **Histórico**
   - Salvar histórico de notificações enviadas
   - Analytics de cliques

4. **Rich Notifications**
   - Imagens maiores
   - Múltiplas ações (Ligar, WhatsApp, Ver)

---

## 📞 Suporte

Se houver dúvidas ou problemas, verifique:
- Logs do container: `docker logs jamalimobiliaria-backend-1`
- Console do navegador (F12 > Console)
- Network tab (requisições à API)

**Sistema implementado com sucesso! 🎉**
