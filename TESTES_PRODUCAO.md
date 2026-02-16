# 🧪 Testes de Produção - IJPS Imobiliária

Script para testar sistemas de notificações push e marca d'água em produção.

## 📋 Requisitos

- Acesso SSH ao servidor de produção
- Docker e docker-compose instalados
- Ambiente backend funcionando

## 🚀 Como Usar

### No Servidor de Produção

```bash
cd /opt/JamalImobiliaria

# Copiar script para o container
sudo docker compose cp test_production.py backend:/app/

# Executar testes
```

### 1️⃣ Testar Notificações Push

```bash
sudo docker compose exec backend python test_production.py --push
```

**O que é testado:**
- ✅ Verificação das chaves VAPID configuradas
- ✅ Contagem de subscriptions ativas
- ✅ Envio de notificação de teste para até 3 usuários
- ✅ Relatório de sucessos/falhas

**Resultado esperado:**
```
🔔 TESTE DE NOTIFICAÇÕES PUSH
================================

1️⃣ Verificando configuração VAPID...
   ✅ VAPID_PUBLIC_KEY: BF5KVvrBnUCV_yqDNJ...
   ✅ VAPID_PRIVATE_KEY: **************************************** (oculta)
   ✅ VAPID_CLAIMS_EMAIL: mailto:contato@imobiliariajamal.com

2️⃣ Verificando subscriptions ativas...
   ✅ 3 subscription(s) ativa(s) encontrada(s)

3️⃣ Enviando notificação de teste...
   ✅ Notificação enviada com sucesso!

📊 RESUMO DO TESTE DE NOTIFICAÇÕES
✅ Enviadas com sucesso: 3
❌ Falhas: 0
📱 Total de subscriptions: 3
```

### 2️⃣ Testar Marca d'Água

```bash
sudo docker compose exec backend python test_production.py --watermark
```

**O que é testado:**
- ✅ Verificação do Pillow instalado
- ✅ Contagem de imagens no banco
- ✅ Análise das 5 imagens mais recentes
- ✅ Verificação de dimensões e tamanho dos arquivos

**Resultado esperado:**
```
🎨 TESTE DE MARCA D'ÁGUA
================================

1️⃣ Verificando dependências...
   ✅ Pillow instalado e funcionando

2️⃣ Verificando imagens no banco de dados...
   ✅ 624 imagens cadastradas
   ✅ 52 propriedades com imagens

3️⃣ Analisando imagens recentes...
   Imagem #624:
   - Arquivo: properties/1001110883.jpg
   - Propriedade: IJPS-052
   ✅ Dimensões: 1200x900
   ✅ Formato: JPEG
   ✅ Tamanho: 345.2 KB
   ✅ Imagem processada (tamanho adequado)

📊 RESUMO DO TESTE DE MARCA D'ÁGUA
✅ Total de imagens: 624
✅ Propriedades com fotos: 52
✅ Sistema de marca d'água: OPERACIONAL
```

### 3️⃣ Testar Tudo

```bash
sudo docker compose exec backend python test_production.py --all
```

Executa ambos os testes em sequência.

## 🔍 Troubleshooting

### Notificações não enviadas

**Erro:** "Nenhuma subscription ativa encontrada"
- **Solução:** Acesse o site e clique no sino 🔔 para se inscrever

**Erro:** "VAPID_PUBLIC_KEY não encontrada"
- **Solução:** Verifique o arquivo `.env` e reinicie os containers:
  ```bash
  sudo docker compose down
  sudo docker compose up -d
  ```

**Erro:** "No private key. Call generate_keys()"
- **Solução:** A chave VAPID está no formato errado. Regenere:
  ```bash
  sudo docker compose exec backend python manage.py generate_vapid_keys
  ```

### Marca d'água não visível

**Problema:** Imagens sem marca d'água
- **Solução:** Reprocesse as imagens existentes:
  ```bash
  sudo docker compose exec backend python manage.py add_watermark_to_existing
  ```

**Problema:** Fontes não encontradas
- **Solução:** Reconstrua o backend com `--no-cache`:
  ```bash
  sudo docker compose build --no-cache backend
  sudo docker compose up -d
  ```

## 📊 Monitoramento Contínuo

### Ver logs em tempo real

```bash
# Logs do backend
sudo docker compose logs -f backend

# Filtrar apenas notificações
sudo docker compose logs backend | grep -i "notificação\|notification"

# Filtrar apenas marca d'água
sudo docker compose logs backend | grep -i "watermark\|marca"
```

## 🎯 Testes Manuais Adicionais

### Testar Notificação no Navegador

1. Acesse https://imobiliariajamal.com
2. Abra DevTools (F12) > Console
3. Execute:
   ```javascript
   // Verificar se Service Worker está registrado
   navigator.serviceWorker.getRegistrations().then(regs => {
     console.log('Service Workers:', regs.length);
   });
   
   // Testar permissão de notificação
   console.log('Permissão:', Notification.permission);
   ```

### Verificar Marca d'Água Visualmente

1. Acesse uma propriedade: https://imobiliariajamal.com/propriedades/[ID]
2. Clique com botão direito na imagem > "Abrir em nova aba"
3. Verifique se aparece **"IJPS IMOBILIÁRIA"**:
   - No **canto inferior direito** (branco com contorno preto)
   - No **centro diagonal** (semi-transparente)

## ✅ Critérios de Sucesso

### Notificações Push ✓
- [ ] Chaves VAPID configuradas
- [ ] Pelo menos 1 subscription ativa
- [ ] Notificação entregue com sucesso
- [ ] Usuário recebe notificação no navegador

### Marca d'Água ✓
- [ ] Pillow instalado
- [ ] Imagens processadas sem erros
- [ ] Marca d'água visível nas imagens
- [ ] Texto legível em qualquer fundo

---

**💡 Dica:** Execute os testes após cada deploy para garantir que tudo está funcionando!
