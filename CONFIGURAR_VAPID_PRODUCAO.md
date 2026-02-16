# Configurar Chaves VAPID em Produção

## Problema
```
Erro inesperado ao enviar notificação: curve must be an EllipticCurve instance
```

Isso ocorre porque as chaves VAPID não estão configuradas no servidor de produç ão.

## Solução

### 1️⃣ Conectar ao Servidor

```bash
ssh root@SEU_IP
cd /opt/JamalImobiliaria
```

### 2️⃣ Gerar Chaves VAPID

Execute no servidor:

```bash
sudo docker compose exec backend python manage.py generate_vapid_keys
```

Este comando vai exibir algo como:

```
🔑 Chaves VAPID geradas com sucesso!

Adicione estas variáveis ao arquivo .env:

VAPID_PUBLIC_KEY=BNtaaNMRqWSZwU6GCjkgSHW_gGyk_0GVamG8XQlHou1_hLSoc40GYjVvpf0TFvdXlfp3q5DXB-u3iB1mgViVYiI
VAPID_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg...
-----END PRIVATE KEY-----
VAPID_CLAIMS_EMAIL=mailto:contato@imobiliariajamal.com
```

### 3️⃣ Adicionar ao Arquivo .env

Edite o arquivo `.env` no servidor:

```bash
sudo nano .env
```

Adicione as variáveis no final do arquivo:

```env
# Chaves VAPID para Push Notifications
VAPID_PUBLIC_KEY=SUA_CHAVE_PUBLICA_AQUI
VAPID_PRIVATE_KEY=SUA_CHAVE_PRIVADA_AQUI
VAPID_CLAIMS_EMAIL=mailto:contato@imobiliariajamal.com
```

Salve: `Ctrl + O`, `Enter`, `Ctrl + X`

### 4️⃣ Atualizar docker-compose.yml

Edite o arquivo:

```bash
sudo nano docker-compose.yml
```

Na seção `backend` > `environment`, adicione:

```yaml
backend:
  environment:
    # ... outras variáveis ...
    VAPID_PUBLIC_KEY: ${VAPID_PUBLIC_KEY}
    VAPID_PRIVATE_KEY: ${VAPID_PRIVATE_KEY}
    VAPID_CLAIMS_EMAIL: ${VAPID_CLAIMS_EMAIL:-mailto:contato@imobiliariajamal.com}
```

### 5️⃣ Reiniciar Containers

```bash
sudo docker compose down
sudo docker compose up -d
```

### 6️⃣ Verificar Logs

```bash
sudo docker compose logs -f backend
```

Se aparecer `"VAPID_PRIVATE_KEY não configurada"`, revise os passos anteriores.

### 7️⃣ Atualizar Frontend (Chave Pública)

A chave pública VAPID também precisa estar no frontend. Edite o `.env` do projeto **local**:

```env
# frontend/.env.local (localmente)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=SUA_CHAVE_PUBLICA_AQUI
```

Depois faça commit e push:

```bash
git add frontend/.env.local
git commit -m "Adicionar chave VAPID pública"
git push origin main
```

E atualize o servidor:

```bash
# No servidor
cd /opt/JamalImobiliaria
sudo git pull origin main
sudo docker compose down
sudo docker compose build --no-cache frontend
sudo docker compose up -d
```

---

## Verificar se Funcionou

Acesse o site e teste as notificações. Se funcionar:
- ✅ Notificação aparece no navegador
- ✅ Logs do backend mostram: "Notificação enviada com sucesso"

---

## Troubleshooting

### Erro persiste após configurar

1. Verificar se as variáveis foram carregadas:
   ```bash
   sudo docker compose exec backend printenv | grep VAPID
   ```

2. Se não aparecer nada, o problema está no `.env` ou `docker-compose.yml`

### "VAPID_PRIVATE_KEY não configurada"

O Django não está recebendo a variável. Verifique:
- `.env` tem as chaves?
- `docker-compose.yml` tem as variáveis no `environment`?
- Os containers foram reiniciados após mudanças?
