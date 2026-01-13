# PROBLEMA IDENTIFICADO: URLs Hardcoded causando prompt de permissão de rede local

## Problema
O navegador está solicitando permissão para acessar a rede local porque existem várias chamadas `fetch('http://localhost:8000/api/...')` hardcoded no código do frontend.

Quando o site roda em produção (https://imobiliariajamal.com) mas tenta fazer fetch para `localhost:8000`, o navegador interpreta isso como tentativa de acessar a rede local do usuário e pede permissão.

## Arquivos afetados
- `app/dashboard/page.tsx`  
- `app/dashboard/propriedades/page.tsx`
- `app/dashboard/propriedades/nova/page.tsx`
- `app/dashboard/propriedades/[id]/editar/page.tsx`
- `app/dashboard/agentes/page.tsx`
- `app/dashboard/agentes/novo/page.tsx`
- `app/dashboard/agentes/[id]/editar/page.tsx`

## Solução
Substituir todas as URLs hardcoded por variável de ambiente:

### ANTES:
```typescript
fetch('http://localhost:8000/api/agents/')
```

### DEPOIS:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
fetch(`${API_URL}/api/agents/`)
```

## Arquivo helper criado
Criado `lib/api-config.ts` com configuração centralizada:
- Exporta `API_BASE_URL`
- Exporta `API_ENDPOINTS` com todas as rotas
- Função helper `apiUrl()` para construir URLs

## TODO
Refatorar todos os arquivos listados acima para usar o helper `lib/api-config.ts`.

## Configuração em produção
O `.env` no servidor já está correto:
```
NEXT_PUBLIC_API_URL=https://imobiliariajamal.com
```

Mas o código ainda usa `localhost:8000` hardcoded, ignorando essa variável.
