# 🔄 Rebuild Frontend - Guia Rápido

## Problema Atual
O frontend está usando `https://imobiliariajamal.com` mas precisa de `https://imobiliariajamal.com/api`.

## ✅ Correções Aplicadas
- ✅ `.env.local`: Atualizado para `NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api`
- ✅ `Dockerfile`: Default ARG agora é `https://imobiliariajamal.com/api`
- ✅ `docker-compose.yml`: Build arg atualizado
- ✅ Commit 82de473 criado e pushed para GitHub

## 🚀 Como Fazer Rebuild no Servidor

### Opção 1: Via SSH (Recomendado)
```bash
ssh root@209.38.236.166
# Senha: 1Jossilene

cd /opt/JamalImobiliaria

# 1. Puxar última versão
git pull

# 2. Atualizar .env.local
echo 'NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api' > frontend/.env.local

# 3. Rebuild frontend
docker-compose build --no-cache frontend

# 4. Parar container antigo
docker stop jamalimobiliaria-frontend-1
docker rm jamalimobiliaria-frontend-1

# 5. Criar novo container com alias correto
docker run -d \
  --name jamalimobiliaria-frontend-1 \
  --network jamalimobiliaria_jamal_net \
  --network-alias frontend \
  -p 3000:3000 \
  jamalimobiliaria_frontend:latest

# 6. Verificar logs
docker logs --tail=20 jamalimobiliaria-frontend-1
```

### Opção 2: Script Automatizado
```bash
ssh root@209.38.236.166 "cd /opt/JamalImobiliaria && \
  git pull && \
  echo 'NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api' > frontend/.env.local && \
  docker-compose build --no-cache frontend && \
  docker stop jamalimobiliaria-frontend-1 && \
  docker rm jamalimobiliaria-frontend-1 && \
  docker run -d --name jamalimobiliaria-frontend-1 --network jamalimobiliaria_jamal_net --network-alias frontend -p 3000:3000 jamalimobiliaria_frontend:latest && \
  docker logs --tail=20 jamalimobiliaria-frontend-1"
```

## ✅ Verificação Pós-Deploy

### 1. Verificar Container
```bash
ssh root@209.38.236.166 "docker ps | grep frontend"
```
**Esperado:** Status "Up" com porta 3000:3000

### 2. Verificar URL Compilada
```bash
ssh root@209.38.236.166 "docker exec jamalimobiliaria-frontend-1 grep -r 'imobiliariajamal.com/api' .next/static/ | head -1"
```
**Esperado:** Deve encontrar `https://imobiliariajamal.com/api`

### 3. Testar Site
- Abrir https://imobiliariajamal.com
- F12 → Console
- **Esperado:** 
  - ✅ Requests para `https://imobiliariajamal.com/api/properties/`
  - ❌ Nenhum erro de 404 ou localhost

## 🐛 Solução de Problemas

### Erro: DNS "frontend" não resolve
```bash
ssh root@209.38.236.166 "docker network disconnect jamalimobiliaria_jamal_net jamalimobiliaria-frontend-1 && \
  docker network connect --alias frontend jamalimobiliaria_jamal_net jamalimobiliaria-frontend-1"
```

### Erro: Backend não responde
```bash
ssh root@209.38.236.166 "docker start jamalimobiliaria-backend-1 && \
  docker logs --tail=20 jamalimobiliaria-backend-1"
```

### Site retorna 502
```bash
# Reiniciar proxy
ssh root@209.38.236.166 "docker restart jamalimobiliaria-proxy-1"
```

## 📊 Status Atual (Antes do Rebuild)
- ✅ Site acessível: https://imobiliariajamal.com (200 OK)
- ❌ API calls retornando 404 porque falta `/api` no path
- ✅ Código já corrigido no GitHub (commit 82de473)
- ⏳ Aguardando rebuild para aplicar correção

## 🎯 Próximos Passos
1. **Execute o rebuild** usando uma das opções acima
2. **Aguarde 2-3 minutos** para o build completar
3. **Teste no navegador**: https://imobiliariajamal.com
4. **Verifique console**: Deve ver chamadas para `/api/properties/`
