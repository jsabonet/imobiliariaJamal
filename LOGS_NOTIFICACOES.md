# 📋 Sistema de Logs - Notificações Push

## Logs Implementados

Todo o processo de notificações push agora possui logs detalhados em cada etapa, facilitando o debug e monitoramento.

---

## 🔍 Exemplo de Saída no Console

### **Quando o usuário clica em "Ativar Notificações":**

```
🔔 ══════════════════════════════════════════════════════
🔔 [NotificationButton] BOTÃO CLICADO
🔔 [NotificationButton] Ação: ATIVAR notificações
🔔 ══════════════════════════════════════════════════════

🔔 [NotificationButton] Iniciando processo de ATIVAÇÃO...
🔔 [NotificationButton] Permissão atual: default
🔔 [NotificationButton] Chamando subscribeToPushNotifications()...

📱 ══════════════════════════════════════════════════════
📱 [Subscribe] INICIANDO PROCESSO DE SUBSCRIPTION
📱 ══════════════════════════════════════════════════════

📱 [Subscribe] PASSO 1: Verificar suporte do navegador
🔍 [Suporte] Verificando APIs disponíveis:
   - Service Worker: ✅
   - Push Manager: ✅
   - Notification: ✅
📱 [Subscribe] ✅ Navegador suporta push notifications

📱 [Subscribe] PASSO 2: Solicitar permissão do usuário
🔔 [Permissão] Solicitando permissão ao usuário...
🔔 [Permissão] Resposta do usuário: granted
🔔 [Permissão] ✅ CONCEDIDA
📱 [Subscribe] ✅ Permissão concedida

📱 [Subscribe] PASSO 3: Obter Service Worker registration
📱 [Subscribe] ✅ Service Worker pronto: ServiceWorkerRegistration {...}
📱 [Subscribe] SW Scope: http://localhost:3002/

📱 [Subscribe] PASSO 4: Verificar subscription existente
📱 [Subscribe] ℹ️  Nenhuma subscription encontrada
📱 [Subscribe] PASSO 5: Criar nova subscription

📱 [Subscribe] VAPID Key disponível: BNtaaNMRqWSZwU6GCjkg...
🔐 [VAPID] Convertendo chave VAPID de base64 para Uint8Array...
🔐 [VAPID] Comprimento da chave: 88 caracteres
🔐 [VAPID] ✅ Conversão completa: 65 bytes
📱 [Subscribe] Chamando pushManager.subscribe()...
📱 [Subscribe] ✅ Nova push subscription criada!
📱 [Subscribe] Endpoint: https://fcm.googleapis.com/fcm/send/cH8_browserSimu...

📱 [Subscribe] PASSO 6: Registrar no backend
📤 [Backend] Enviando subscription para o backend...
📤 [Backend] Subscription convertida para JSON
📤 [Backend] Dados: {
  endpoint: 'https://fcm.googleapis.com/fcm/send/cH8_browserS...',
  p256dh: 'BKxON_simulated_p256...',
  auth: 'simulated_auth_secr...'
}
📤 [Backend] URL: http://localhost:8000/api/notifications/subscribe/
📤 [Backend] Enviando requisição POST...
📤 [Backend] Resposta recebida: 201 Created
📤 [Backend] ✅ Subscription registrada com sucesso!
📤 [Backend] Resposta: {
  success: true,
  message: 'Notificações ativadas com sucesso!',
  subscription_id: 5
}

📱 [Subscribe] ✅ PROCESSO COMPLETO!
📱 ══════════════════════════════════════════════════════

🔔 [NotificationButton] ✅ Ativação concluída com sucesso!
🔔 [NotificationButton] Subscription: PushSubscription {...}
🔔 [NotificationButton] Aguardando 1s para exibir notificação de teste...
🔔 [NotificationButton] Processo finalizado.

🔔 [NotificationButton] Chamando showTestNotification()...

🧪 ══════════════════════════════════════════════════════
🧪 [TestNotification] EXIBINDO NOTIFICAÇÃO DE TESTE
🧪 ══════════════════════════════════════════════════════

🧪 [TestNotification] Verificando suporte...
🔍 [Suporte] Verificando APIs disponíveis:
   - Service Worker: ✅
   - Push Manager: ✅
   - Notification: ✅
🧪 [TestNotification] Verificando permissão...
🧪 [TestNotification] Permissão: granted
🧪 [TestNotification] Obtendo Service Worker...
🧪 [TestNotification] ✅ Service Worker pronto
🧪 [TestNotification] Exibindo notificação...
🧪 [TestNotification] ✅ Notificação exibida com sucesso!
🧪 ══════════════════════════════════════════════════════

🔔 [NotificationButton] ✅ Notificação de teste exibida!
```

---

### **Quando o usuário clica em "Desativar Notificações":**

```
🔔 ══════════════════════════════════════════════════════
🔔 [NotificationButton] BOTÃO CLICADO
🔔 [NotificationButton] Ação: DESATIVAR notificações
🔔 ══════════════════════════════════════════════════════

🔔 [NotificationButton] Iniciando processo de DESATIVAÇÃO...

🚫 ══════════════════════════════════════════════════════
🚫 [Unsubscribe] INICIANDO PROCESSO DE DESATIVAÇÃO
🚫 ══════════════════════════════════════════════════════

🚫 [Unsubscribe] Obtendo Service Worker...
🚫 [Unsubscribe] Buscando subscription ativa...
🚫 [Unsubscribe] ✅ Subscription encontrada
🚫 [Unsubscribe] Endpoint: https://fcm.googleapis.com/fcm/send/cH8_browserSimu...

🚫 [Unsubscribe] PASSO 1: Remover do backend
📤 [Backend] Removendo subscription do backend...
📤 [Backend] URL: http://localhost:8000/api/notifications/unsubscribe/
📤 [Backend] Endpoint: https://fcm.googleapis.com/fcm/send/cH8_browserS...
📤 [Backend] Enviando requisição POST...
📤 [Backend] Resposta: 200 OK
📤 [Backend] ✅ Subscription removida com sucesso!
📤 [Backend] Resposta: {
  success: true,
  message: 'Notificações desativadas com sucesso!'
}
🚫 [Unsubscribe] PASSO 2: Desinscrever localmente
🚫 [Unsubscribe] ✅ Desinscrição local bem-sucedida

🚫 [Unsubscribe] ✅ PROCESSO COMPLETO!
🚫 ══════════════════════════════════════════════════════

🔔 [NotificationButton] ✅ Desativação concluída com sucesso!
🔔 [NotificationButton] Processo finalizado.
```

---

### **Quando o componente é montado (página carrega):**

```
🔔 [NotificationButton] Verificando suporte a notificações...
🔍 [Suporte] Verificando APIs disponíveis:
   - Service Worker: ✅
   - Push Manager: ✅
   - Notification: ✅
🔔 [NotificationButton] Suporte: ✅ Suportado
🔔 [NotificationButton] Verificando status de subscription...
🔔 [NotificationButton] Status inicial: ✅ Inscrito
```

---

## 📊 Categorias de Logs

### **Ícones e Prefixos:**

| Ícone | Categoria | Descrição |
|-------|-----------|-----------|
| 🔔 | NotificationButton | Ações do componente UI |
| 📱 | Subscribe | Processo de inscrição |
| 🚫 | Unsubscribe | Processo de desinscrição |
| 🧪 | TestNotification | Notificação de teste |
| 📤 | Backend | Comunicação com API |
| 🔐 | VAPID | Processamento de chaves |
| 🔍 | Suporte | Verificação de APIs |
| 🔔 | Permissão | Solicitação de permissões |

### **Status Indicators:**

- ✅ = Sucesso
- ❌ = Erro/Falha
- ⚠️ = Aviso
- ℹ️ = Informação

---

## 🛠️ Como Usar os Logs

### **No Navegador:**

1. Abra o DevTools (F12)
2. Vá para a aba "Console"
3. Clique no botão "Ativar Notificações"
4. Observe os logs detalhados em tempo real

### **Filtrar Logs:**

No console do navegador, você pode filtrar por categoria:

```javascript
// Filtrar apenas logs de backend:
Filter: "[Backend]"

// Filtrar apenas logs de subscription:
Filter: "[Subscribe]"

// Filtrar apenas erros:
Filter: "❌"
```

---

## 🐛 Debug de Problemas Comuns

### **Problema: Permissão Negada**
```
🔔 [Permissão] Resposta do usuário: denied
🔔 [Permissão] ❌ NEGADA
```
**Solução:** Limpar permissões do site nas configurações do navegador

### **Problema: VAPID Key não configurada**
```
📱 [Subscribe] ❌ ERRO: VAPID_PUBLIC_KEY não configurada!
```
**Solução:** Verificar arquivo `.env.local` e reiniciar Next.js

### **Problema: Service Worker não registrado**
```
🔍 [Suporte] Verificando APIs disponíveis:
   - Service Worker: ❌
```
**Solução:** Verificar se `sw.js` existe em `/public/`

### **Problema: Backend fora do ar**
```
📤 [Backend] Resposta recebida: 500 Internal Server Error
📤 [Backend] ❌ Erro na resposta
```
**Solução:** Verificar se Django está rodando em localhost:8000

---

## 📝 Arquivos Modificados

1. **`frontend/components/NotificationButton.tsx`**
   - Logs de interação do usuário
   - Logs de mudanças de estado

2. **`frontend/lib/notifications.ts`**
   - Logs de cada função
   - Logs de requisições HTTP
   - Logs de conversão VAPID
   - Logs de Service Worker

---

## 🎯 Benefícios

✅ **Debug facilitado** - Identifique rapidamente onde ocorrem problemas  
✅ **Monitoramento** - Acompanhe todo o fluxo de ativação  
✅ **Educacional** - Entenda como o sistema funciona internamente  
✅ **Produção** - Logs podem ser desabilitados via environment variable  

---

## 🚀 Como Testar

1. Abra: http://localhost:3002
2. Abra DevTools (F12) → Console
3. Clique em "Ativar Notificações"
4. Observe os logs detalhados!

**Os logs aparecerão em tempo real mostrando cada passo do processo! 🎉**
