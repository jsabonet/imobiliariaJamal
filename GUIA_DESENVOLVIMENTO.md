# GUIA DE DESENVOLVIMENTO - IJPS Frontend

## 🚀 Setup Rápido

### 1. Primeira Vez

```bash
# Clonar repositório (se aplicável)
git clone [repo-url]

# Instalar dependências
npm install

# Copiar variáveis de ambiente
copy .env.example .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📂 Onde Adicionar Novas Features

### Nova Página

1. Criar arquivo em `app/nome-da-pagina/page.tsx`
```tsx
export default function MinhaPage() {
  return <div>Minha Página</div>;
}
```

2. O Next.js automaticamente cria a rota `/nome-da-pagina`

### Novo Componente UI

1. Criar em `components/ui/MeuComponente.tsx`
2. Seguir estrutura dos componentes existentes (Button, Card, etc.)
3. Exportar para uso em outras páginas

### Nova Feature de Propriedade

1. Adicionar em `components/properties/`
2. Importar e usar nas páginas relevantes

---

## 🔗 Integração com Backend Django

### Setup Inicial

1. **Criar pasta `lib/` na raiz**

```bash
mkdir lib
```

2. **Criar `lib/api.ts`**

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchProperties(params?: any) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/properties/?${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

export async function fetchPropertyById(id: string) {
  const response = await fetch(`${API_URL}/properties/${id}/`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

export async function submitEvaluation(data: any) {
  const response = await fetch(`${API_URL}/evaluations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to submit');
  return response.json();
}
```

3. **Criar `lib/types.ts`**

```typescript
export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  verified: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  type?: string;
  location?: string;
  price_min?: number;
  price_max?: number;
  bedrooms?: number;
  bathrooms?: number;
}
```

### Usar nas Páginas

**Exemplo: `app/propriedades/page.tsx`**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { fetchProperties } from '@/lib/api';
import { Property } from '@/lib/types';

export default function PropriedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProperties();
  }, []);
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

---

## 🎨 Adicionar Novos Estilos

### Usando Tailwind

```tsx
<div className="bg-primary text-white p-4 rounded-lg hover:shadow-xl transition">
  Conteúdo
</div>
```

### Cores Disponíveis

```tsx
// Primary (Laranja/Terracota)
bg-primary
text-primary
border-primary
hover:bg-primary-600

// Secondary (Azul Escuro)
bg-secondary
text-secondary
border-secondary

// Accent (Verde)
bg-accent
text-accent
border-accent
```

### Criar Novo Componente com Estilos

```tsx
const MeuComponente = () => {
  return (
    <div className="
      // Layout
      flex flex-col gap-4 p-6
      
      // Cores
      bg-white text-secondary
      
      // Bordas
      rounded-xl border border-gray-200
      
      // Sombras
      shadow-md hover:shadow-lg
      
      // Animações
      transition-all duration-300
      
      // Responsivo
      md:flex-row md:p-8
    ">
      Conteúdo
    </div>
  );
};
```

---

## 📱 Testar Responsividade

### No Browser DevTools

1. Abrir DevTools (F12)
2. Clicar no ícone de dispositivo móvel
3. Testar em:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)

### Breakpoints Tailwind

```css
sm:  640px   /* Tablets pequenos */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Desktops grandes */
```

### Exemplo Responsivo

```tsx
<div className="
  grid
  grid-cols-1      /* Mobile: 1 coluna */
  md:grid-cols-2   /* Tablet: 2 colunas */
  lg:grid-cols-3   /* Desktop: 3 colunas */
  gap-6
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

---

## 🐛 Debug e Troubleshooting

### Erro: "Module not found"

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 already in use"

```bash
# Windows: Matar processo na porta 3000
npx kill-port 3000

# Ou usar outra porta
npm run dev -- -p 3001
```

### Erro de TypeScript

```bash
# Verificar erros
npm run lint

# Build para ver todos os erros
npm run build
```

### Hot Reload não está funcionando

1. Salvar arquivo
2. Se não atualizar, restart o servidor:
```bash
Ctrl+C
npm run dev
```

---

## 📸 Adicionar Imagens

### Imagens Locais

1. Colocar em `public/images/`
2. Usar no código:

```tsx
import Image from 'next/image';

<Image
  src="/images/minha-foto.jpg"
  alt="Descrição"
  width={800}
  height={600}
/>
```

### Imagens Externas

Configurar em `next.config.mjs`:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'seu-dominio.com',
    },
  ],
},
```

---

## 🔍 SEO e Metadata

### Por Página

```tsx
// app/propriedades/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Propriedades | IJPS',
  description: 'Encontre propriedades em Moçambique',
  keywords: ['imóveis', 'moçambique', 'propriedades'],
};

export default function Page() {
  return <div>...</div>;
}
```

### Dinâmica (Server Component)

```tsx
// app/propriedades/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await fetchProperty(params.id);
  
  return {
    title: `${property.title} | IJPS`,
    description: property.description,
    openGraph: {
      images: [property.images[0]],
    },
  };
}
```

---

## 🚀 Deploy para Produção

### Build Local

```bash
npm run build
npm run start
```

### Deploy na Vercel (Recomendado)

1. Criar conta em [vercel.com](https://vercel.com)
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy automático a cada push

### Variáveis de Ambiente para Produção

No Vercel Dashboard:
- `NEXT_PUBLIC_API_URL`: URL do backend Django
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY`: API Key do Google Maps
- Outras conforme `.env.example`

---

## 📋 Checklist Pré-Deploy

- [ ] Testar build localmente: `npm run build`
- [ ] Verificar todas as páginas funcionam
- [ ] Testar em mobile
- [ ] Configurar variáveis de ambiente
- [ ] Verificar imagens otimizadas
- [ ] SEO metadata em todas as páginas
- [ ] Testar formulários
- [ ] Links de WhatsApp/Telefone corretos
- [ ] Analytics configurado (se aplicável)

---

## 🛟 Ajuda e Recursos

### Documentação

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Problemas Comuns

1. **Componente não atualiza**: Verificar se está usando `'use client'` quando necessário
2. **Erro de hydration**: Garantir que HTML do servidor === HTML do cliente
3. **Imagem não carrega**: Verificar configuração de domínios em `next.config.mjs`

### Suporte Zawadi Digital

- Email: [contato]
- WhatsApp: [número]
- Documentação: [link]

---

## 🎯 Próximas Features (Roadmap)

### Curto Prazo (1-2 semanas)
- [ ] Integração completa com backend Django
- [ ] Google Maps API para localização
- [ ] Upload de imagens otimizado
- [ ] Sistema de favoritos

### Médio Prazo (1 mês)
- [ ] PWA completo (service worker)
- [ ] Notificações push
- [ ] Chat/WhatsApp integration
- [ ] Sistema de busca avançada

### Longo Prazo (3+ meses)
- [ ] Tours virtuais 360°
- [ ] AR para visualização
- [ ] App mobile nativo
- [ ] Dashboard de analytics

---

**Última atualização**: 17 de Dezembro de 2025  
**Desenvolvido por**: Zawadi Digital  
**Cliente**: IJPS - Imobiliária Jamal & Prestação de Serviços
