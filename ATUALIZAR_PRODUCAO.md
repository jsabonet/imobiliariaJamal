# Atualizar Produção - Corrigir Notificações Push + Timeouts

## Problemas
1. Rotas de notificações (`/api/notifications/subscribe/` e `/api/notifications/unsubscribe/`) retornam 404
2. **WORKER TIMEOUT** do Gunicorn ao processar imagens grandes com marca d'água

## Soluções
- Atualizar código backend com rotas de notificações
- Aumentar timeout do Gunicorn de 30s para 120s (2 minutos)

## Solução

### 1️⃣ Conectar ao Servidor de Produção

```bash
ssh root@SEU_IP
# ou
ssh usuario@imobiliariajamal.com
```

### 2️⃣ Ir para o Diretório do Projeto

```bash
cd /opt/JamalImobiliaria
# ou onde estiver instalado
```

### 3️⃣ Fazer Pull das Últimas Mudanças

```bash
sudo git pull origin main
```

Isso irá baixar:
- Correções de URLs em `frontend/lib/notifications.ts`
- Remoção de proteções frontend de imagens
- Rotas de notificações atualizadas no backend

### 4️⃣ Rebuild e Reiniciar Containers Docker

```bash
# Parar containers
sudo docker compose down

# Rebuild (especialmente backend que mudou)
sudo docker compose build backend frontend

# Subir novamente
sudo docker compose up -d

# Verificar logs
sudo docker compose logs -f backend
```

### 5️⃣ Verificar se as Rotas Estão Funcionando

Teste no navegador ou terminal:

```bash
curl -X POST https://imobiliariajamal.com/api/notifications/subscribe/ \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"test"}'
```

**Resposta esperada:** Erro 400 (Bad Request) com mensagem sobre campos obrigatórios 
**NÃO deve ser:** 404 (Not Found)

### 6️⃣ Limpar Cache do Navegador dos Usuários

Os usuários precisam limpar o Service Worker em cache:

1. Abrir DevTools (F12)
2. Application > Service Workers
3. Clicar "Unregister"
4. Reload: `Ctrl + Shift + R`

---

## Comandos Resumidos

```bash
# No servidor de produção
cd /opt/JamalImobiliaria
sudo git pull origin main
sudo docker compose down
sudo docker compose build backend frontend
sudo docker compose up -d
sudo docker compose logs -f backend
```

---

## Checklist

- [ ] SSH no servidor
- [ ] Git pull das mudanças
- [ ] Rebuild containers
- [ ] Verificar logs do backend
- [ ] Testar rota de notificações
- [ ] Avisar usuários para limpar cache
- [ ] Testar subscribe/unsubscribe no site

---

## Troubleshooting

### Erro: "Cannot connect to the Docker daemon"
```bash
sudo systemctl start docker
```

### Rebuild não aplicou mudanças
```bash
sudo docker compose build --no-cache backend
sudo docker compose up -d --force-recreate backend
```

### Ver logs detalhados
```bash
sudo docker compose logs backend --tail=100
```
