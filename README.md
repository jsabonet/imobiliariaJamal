# IJPS - Imobiliária Jamal & Prestação de Serviços
## Plataforma Digital de Imóveis - Frontend

![IJPS Logo](public/logo.png)

Plataforma digital moderna e mobile-first para compra, venda, arrendamento e avaliação de propriedades em Moçambique.

Desenvolvido por **Zawadi Digital** 🚀

---

## 🎯 Sobre o Projeto

Esta é a interface frontend da plataforma IJPS, desenvolvida com as melhores tecnologias web modernas. A plataforma foi especialmente projetada para o mercado moçambicano, com foco em:

- ✅ **Mobile-First**: 85% dos utilizadores acedem via smartphone
- ✅ **Performance**: Carregamento rápido mesmo com conexão 3G/4G
- ✅ **Simplicidade**: Navegação intuitiva e design limpo
- ✅ **PWA Ready**: Instalável e funciona offline
- ✅ **SEO Otimizado**: Melhor visibilidade nos motores de busca

---

## 🛠️ Stack Tecnológico

### Core
- **Next.js 14+** - Framework React com SSR/SSG
- **TypeScript** - Type safety e melhor DX
- **React 18** - UI library

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Modules** - Scoped styling quando necessário

### Libraries
- **React Icons** - Ícones SVG otimizados
- **Swiper** - Carrosséis e galerias touch-friendly
- **Sharp** - Otimização de imagens

### Desenvolvimento
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixes automáticos

---

## 📁 Estrutura do Projeto

```
JamalImobiliaria/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raiz com Navbar e Footer
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Estilos globais
│   ├── propriedades/            # Páginas de propriedades
│   │   ├── page.tsx            # Listagem
│   │   └── [id]/               # Detalhes dinâmicos
│   │       └── page.tsx
│   ├── servicos/                # Páginas de serviços
│   │   └── page.tsx
│   └── avaliar/                 # Formulário de avaliação
│       └── page.tsx
├── components/                   # Componentes React
│   ├── ui/                      # Componentes base reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Badge.tsx
│   ├── layout/                  # Componentes de layout
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/                    # Componentes da homepage
│   │   ├── Hero.tsx
│   │   ├── FeaturedProperties.tsx
│   │   ├── Services.tsx
│   │   ├── WhyChooseUs.tsx
│   │   └── CallToAction.tsx
│   └── properties/              # Componentes de propriedades
│       └── PropertyCard.tsx
├── public/                       # Assets estáticos
│   ├── logo.png
│   └── favicon.ico
├── tailwind.config.ts           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
├── next.config.mjs              # Configuração Next.js
└── package.json                 # Dependências

```

---

## 🚀 Começar a Desenvolver

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn como package manager
- Git para controle de versão

### Instalação

1. **Instalar dependências**

```bash
npm install
```

2. **Executar servidor de desenvolvimento**

```bash
npm run dev
```

3. **Abrir no navegador**

```
http://localhost:3000
```

### Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linting
```

---

## 🎨 Paleta de Cores

Baseada no logotipo IJPS:

```css
/* Primary - Terracota/Laranja */
--primary: #C8552B;
--primary-50: #F9EDE8;
--primary-600: #A04422;

/* Secondary - Azul Escuro */
--secondary: #2C3E50;
--secondary-50: #E8EAED;
--secondary-600: #233240;

/* Accent - Verde */
--accent: #27AE60;
--accent-50: #E8F6EF;
--accent-600: #1F8B4D;
```

---

## 📱 Páginas Implementadas

### ✅ Páginas Completas

1. **Homepage (`/`)**
   - Hero com busca integrada
   - Propriedades em destaque
   - Seção de serviços
   - Por que escolher IJPS
   - Call-to-action

2. **Listagem de Propriedades (`/propriedades`)**
   - Filtros avançados (tipo, localização, preço, quartos)
   - Grid responsivo de cards
   - Ordenação (preço, data, área)
   - Paginação

3. **Detalhes da Propriedade (`/propriedades/[id]`)**
   - Galeria de imagens com navegação
   - Informações detalhadas
   - Características e comodidades
   - Formulário de contacto
   - Perfil do agente
   - Mapa de localização (placeholder)

4. **Avaliação de Imóveis (`/avaliar`)**
   - Formulário multi-step (3 passos)
   - Upload de fotos
   - Validação de campos
   - Indicador de progresso

5. **Serviços (`/servicos`)**
   - Todos os 4 serviços principais
   - Serviços especializados
   - Pricing e features
   - CTAs para cada serviço

### 🧩 Componentes Desenvolvidos

**UI Components:**
- ✅ Button (4 variants: primary, secondary, outline, ghost)
- ✅ Input (com label, error, icon)
- ✅ Select (dropdown)
- ✅ Card (com hover effects)
- ✅ Badge (4 variants)

**Layout Components:**
- ✅ Navbar (responsive, mobile menu)
- ✅ Footer (links, contactos, social media)

**Feature Components:**
- ✅ PropertyCard (card de propriedade)
- ✅ Hero (seção principal homepage)
- ✅ FeaturedProperties (propriedades destaque)
- ✅ Services (seção serviços)
- ✅ WhyChooseUs (razões para escolher)
- ✅ CallToAction (CTA section)

---

## 🔌 Integração com Backend (Django)

### Endpoints a Integrar

O frontend está preparado para conectar com o backend Django/PostgreSQL:

```typescript
// Exemplos de integração

// 1. Listar propriedades
GET /api/properties/
Response: Array<Property>

// 2. Detalhes da propriedade
GET /api/properties/:id/
Response: Property

// 3. Filtrar propriedades
GET /api/properties/?type=apartamento&location=maputo&price_max=15000000

// 4. Submeter avaliação
POST /api/evaluations/
Body: EvaluationForm

// 5. Contactar sobre propriedade
POST /api/properties/:id/contact/
Body: ContactForm
```

### Pontos de Integração

Os seguintes arquivos precisarão de integração com API:

1. `app/page.tsx` - Buscar propriedades em destaque
2. `app/propriedades/page.tsx` - Listagem com filtros
3. `app/propriedades/[id]/page.tsx` - Detalhes da propriedade
4. `app/avaliar/page.tsx` - Submeter formulário de avaliação

**Criar pasta `lib/` para:**
- `lib/api.ts` - Cliente API (fetch/axios)
- `lib/types.ts` - TypeScript interfaces
- `lib/utils.ts` - Funções auxiliares

---

## 📈 Próximos Passos

### Backend Integration
- [ ] Setup de environment variables (.env.local)
- [ ] Criar cliente API com fetch/axios
- [ ] Implementar loading states
- [ ] Implementar error handling
- [ ] Adicionar autenticação (se necessário)

### Features Adicionais
- [ ] Sistema de favoritos
- [ ] Comparação de propriedades
- [ ] Chat/WhatsApp integration
- [ ] Google Maps integration
- [ ] Sistema de busca avançada
- [ ] Filtros salvos
- [ ] Notificações de novas propriedades

### Otimizações
- [ ] Adicionar manifest.json (PWA)
- [ ] Service Worker para offline
- [ ] Image optimization com next/image
- [ ] Lazy loading de componentes
- [ ] Analytics (Google Analytics 4)
- [ ] SEO metadata por página

### Testing
- [ ] Jest para unit tests
- [ ] React Testing Library
- [ ] Cypress para E2E tests
- [ ] Testes de acessibilidade

---

## 📝 Convenções de Código

### Naming
- **Componentes**: PascalCase (`PropertyCard.tsx`)
- **Funções**: camelCase (`formatPrice()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)
- **CSS Classes**: kebab-case ou Tailwind utilities

### Estrutura de Componentes

```tsx
// 1. Imports
import React from 'react';
import { ComponentProps } from './types';

// 2. Interface/Types
interface Props {
  title: string;
  onClinck?: () => void;
}

// 3. Component
const MyComponent: React.FC<Props> = ({ title, onClick }) => {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Handlers
  const handleClick = () => {
    // logic
  };
  
  // 3.3 Render
  return (
    <div>
      {title}
    </div>
  );
};

// 4. Export
export default MyComponent;
```

### Commits
Use Conventional Commits:
- `feat:` Nova feature
- `fix:` Bug fix
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refactoring
- `test:` Testes
- `chore:` Manutenção

---

## 🤝 Parceria Zawadi Digital ↔ IJPS

Este projeto é fruto da parceria entre:

**Zawadi Digital** - Responsável por:
- ✅ Desenvolvimento da plataforma digital completa
- ✅ Marketing digital e gestão de redes sociais
- ✅ Manutenção e suporte técnico 24/7
- ✅ Análise de dados e otimizações

**IJPS** - Responsável por:
- ✅ Atendimento presencial aos clientes
- ✅ Visitas e tours das propriedades
- ✅ Negociação e fecho de negócios
- ✅ Documentação legal
- ✅ Conteúdo (fotos e descrições)

---

## 📞 Contactos

### IJPS - Imobiliária
- **Telefone**: +258 84 000 0000
- **Email**: info@ijps.co.mz
- **WhatsApp**: +258 84 000 0000
- **Localização**: Av. Julius Nyerere, Maputo, Moçambique

### Zawadi Digital
- **Email**: [a preencher]
- **Website**: [a preencher]

---

## 📄 Licença

© 2025 IJPS - Imobiliária Jamal & Prestação de Serviços E.I.  
Desenvolvido por Zawadi Digital. Todos os direitos reservados.

---

## 🙏 Agradecimentos

Obrigado por escolher trabalhar com a Zawadi Digital!

**Vamos construir o futuro do mercado imobiliário digital em Moçambique juntos! 🚀🏠**

---

## 🐳 Deploy com Docker (DigitalOcean)

Este repositório está preparado para deploy com Docker utilizando `docker-compose`, incluindo:
- Frontend (Next.js) em `frontend/`
- Backend (Django + DRF) em `backend/`
- Base de dados PostgreSQL

### 1) Pré-requisitos no Droplet

- Docker e Docker Compose Plugin instalados

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release; echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
# faça logout/login novamente para aplicar o grupo
```

### 2) Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz (veja `.env.example`) com:

```
POSTGRES_DB=ijps_db
POSTGRES_USER=ijps_user
POSTGRES_PASSWORD=troque-por-uma-senha-forte

DJANGO_SECRET_KEY=troque-por-uma-chave-forte
DJANGO_ALLOWED_HOSTS=seu.dominio,backend,localhost,127.0.0.1
DJANGO_CORS_ORIGINS=https://seu.dominio,http://localhost:3000

NEXT_PUBLIC_API_URL=http://backend:8000/api
```

### 3) Build e subida dos serviços

```bash
docker compose up -d --build
```

- Frontend disponível em `http://SEU_IP:3000`
- Backend API em `http://SEU_IP:8000/api`

### 4) (Opcional) Proxy reverso + SSL

Para produção, recomenda-se colocar um proxy reverso (Nginx ou Caddy) em frente ao frontend na porta 80/443 para TLS. É possível adicionar um serviço de proxy ao `docker-compose.yml` apontando para `frontend:3000`.

### 5) Operações úteis

```bash
docker compose logs -f backend      # Ver logs do backend
docker compose logs -f frontend     # Ver logs do frontend
docker compose ps                   # Ver estado dos serviços
docker compose down                 # Parar e remover serviços
```

### Notas técnicas
- O Next.js é construído com `output: 'standalone'` e servido com Node (`server.js`) na porta 3000.
- O Django inicia com `gunicorn` na porta 8000 e executa `migrate` + `collectstatic` automaticamente.
- Arquivos de media são persistidos no volume `media_data` e servidos pelo Django em `/media/`.
