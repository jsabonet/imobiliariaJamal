# Configuração de Produção - IJPS Imobiliária

## Variáveis de Ambiente Necessárias

### Frontend (Next.js)

No servidor de produção, configure a variável de ambiente:

```bash
NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api
```

**Importante:** 
- A URL DEVE terminar com `/api` 
- NÃO adicione `/` no final após `/api`
- Exemplo correto: `https://imobiliariajamal.com/api`
- Exemplo errado: `https://imobiliariajamal.com/api/`
- Exemplo errado: `https://imobiliariajamal.com`

### Backend Separado (Opcional)

Se o backend Django estiver em servidor separado:

```bash
NEXT_PUBLIC_API_URL=https://api.imobiliariajamal.com/api
```

## Como Configurar

### Docker Compose

Edite o arquivo `docker-compose.yml` e adicione:

```yaml
services:
  frontend:
    environment:
      - NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api
```

### DigitalOcean App Platform

1. Vá para Settings → Environment Variables
2. Adicione uma nova variável:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://imobiliariajamal.com/api`
3. Faça redeploy da aplicação

### Vercel/Netlify

No painel de configuração:
1. Environment Variables → Add New
2. Name: `NEXT_PUBLIC_API_URL`
3. Value: `https://imobiliariajamal.com/api`
4. Scope: Production

## Verificação

Após configurar, verifique no console do navegador:

```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
// Deve retornar: https://imobiliariajamal.com/api
```

Teste uma requisição:

```bash
curl https://imobiliariajamal.com/api/properties/
```

Deve retornar JSON, não HTML.

## Correções Aplicadas

### 1. Service Worker
✅ Corrigido para não cachear requisições POST/PUT/DELETE
✅ Apenas GET é cacheado agora

### 2. API Configuration
✅ Função que garante que `/api` está sempre presente na URL
✅ Trata casos onde env var vem sem `/api`

### 3. Preload de Imagem
✅ Removido preload desnecessário que causava warnings

## Troubleshooting

### Erro: "POST /agents/ 404"
- Verifique se `NEXT_PUBLIC_API_URL` está configurada
- Confirme que termina com `/api` (sem `/` no final)
- Rebuild do frontend: `docker-compose up --build frontend`

### Erro: "Unexpected token '<', DOCTYPE..."
- Indica que a API está retornando HTML em vez de JSON
- Verifique se o backend está rodando
- Confirme a URL da API está correta
- Teste o endpoint diretamente: `curl https://SEU_DOMINIO/api/properties/`
