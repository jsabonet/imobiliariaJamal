# 🚀 Deploy Simplificado - IJPS Imobiliária

Este guia elimina a necessidade de criar containers manualmente.

## ✅ Processo Definitivo de Deploy

### 1️⃣ No Servidor (via SSH)
```bash
ssh root@209.38.236.166
# Senha: 1Jossilene

cd /opt/JamalImobiliaria

# Atualizar código
git pull

# Atualizar .env.local do frontend (apenas primeira vez ou se mudou)
echo 'NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api' > frontend/.env.local

# REBUILD E RESTART AUTOMÁTICO - UM ÚNICO COMANDO!
docker-compose up -d --build

# Verificar status
docker-compose ps
```

### 2️⃣ Alternativa: Comando Único do Windows
```powershell
ssh root@209.38.236.166 "cd /opt/JamalImobiliaria && git pull && echo 'NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api' > frontend/.env.local && docker-compose up -d --build && docker-compose ps"
```

## 🔧 Comandos Úteis

### Ver Logs
```bash
# Todos os serviços
docker-compose logs -f

# Apenas frontend
docker-compose logs -f frontend

# Últimas 50 linhas
docker-compose logs --tail=50
```

### Restart de Serviços
```bash
# Apenas frontend
docker-compose restart frontend

# Todos
docker-compose restart
```

### Parar Tudo
```bash
docker-compose down
```

### Rebuild Apenas Frontend
```bash
docker-compose up -d --build frontend
```

## 🎯 Por Que Isso Funciona?

1. **docker-compose gerencia tudo**: Nomes de containers, redes, volumes, aliases
2. **Sem conflito de versões**: Sempre usa a imagem mais recente que ele mesmo criou
3. **Alias de rede automático**: Frontend fica acessível como "frontend" na rede interna
4. **Idempotente**: Pode rodar quantas vezes quiser, sempre fica no estado correto

## ⚠️ NUNCA MAIS FAÇA

❌ `docker run -d --name jamalimobiliaria-frontend-1 ...`
❌ `docker stop jamalimobiliaria-frontend-1 && docker rm ...`
❌ Criar/gerenciar containers manualmente

## ✅ SEMPRE FAÇA

✅ `docker-compose up -d --build`
✅ `docker-compose restart frontend`
✅ `docker-compose logs -f`

## 📝 Notas Importantes

- `.env.local` do frontend NÃO está no git (gitignored)
- Deve ser criado manualmente no servidor: `echo 'NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api' > frontend/.env.local`
- Após mudar variáveis de build (NEXT_PUBLIC_*), fazer rebuild: `docker-compose up -d --build frontend`
- Mudanças no código: `git pull && docker-compose up -d --build`

## 🔍 Verificação Pós-Deploy

```bash
# 1. Ver containers rodando
docker-compose ps

# 2. Testar site
curl -I https://imobiliariajamal.com

# 3. Ver se frontend tem a URL correta
docker-compose exec frontend grep -o "imobiliariajamal.com/api" .next/static/chunks/app/page*.js | head -1
```

**Esperado**: Deve retornar `imobiliariajamal.com/api`
