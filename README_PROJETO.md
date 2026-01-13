# IJPS - Imobiliária Jamal & Prestação de Serviços
## Plataforma Digital Completa (Frontend + Backend)

![IJPS Logo](frontend/public/logo.png)

Plataforma digital moderna e mobile-first para compra, venda, arrendamento e avaliação de propriedades em Moçambique.

**Desenvolvido por Zawadi Digital** 🚀

---

## 📁 Estrutura do Projeto

```
JamalImobiliaria/
├── frontend/                          # Frontend Next.js
│   ├── app/                          # Páginas Next.js
│   ├── components/                   # Componentes React
│   ├── public/                       # Assets estáticos
│   ├── package.json                  # Dependências Node.js
│   └── README.md                     # Documentação frontend
│
├── backend/                          # Backend Django
│   ├── ijps_api/                    # Projeto Django
│   ├── core/                        # App principal
│   ├── manage.py                    # Utilitário Django
│   ├── requirements.txt             # Dependências Python
│   └── README.md                    # Documentação backend
│
└── docs/                            # Documentação (arquivos .md)
    ├── IMPLEMENTACAO_ATUAL.md
    ├── GUIA_DESENVOLVIMENTO.md
    ├── INTEGRACAO_BACKEND_DJANGO_POSTGRESQL.md
    ├── ESTRATEGIA_IJPS_ZAWADI_DIGITAL.md
    ├── REUNIAO_CLIENTE_PERGUNTAS.md
    └── ENTREGA_PROJETO.md
```

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

### 1. Configurar Backend (Django)

```powershell
# Entrar na pasta backend
cd backend

# Ativar ambiente virtual
.\.venv\Scripts\Activate.ps1

# Instalar dependências (se necessário)
pip install -r requirements.txt

# Configurar PostgreSQL (criar banco ijps_db)
# Editar .env com credenciais

# Executar migrações
python manage.py makemigrations
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Iniciar servidor Django
python manage.py runserver
```

Backend rodando em: **http://localhost:8000**  
Admin: **http://localhost:8000/admin**  
API: **http://localhost:8000/api/**

### 2. Configurar Frontend (Next.js)

```powershell
# Abrir nova janela de terminal
# Entrar na pasta frontend
cd frontend

# Instalar dependências
npm install

# Criar .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Iniciar servidor Next.js
npm run dev
```

Frontend rodando em: **http://localhost:3000**

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React com SSR/SSG
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React Icons** - Ícones

### Backend
- **Django 5** - Framework Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Banco de dados
- **Pillow** - Processamento de imagens
- **django-cors-headers** - CORS

---

## 📖 Documentação

### Para Desenvolvedores
- [GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md) - Como desenvolver novas features
- [INTEGRACAO_BACKEND_DJANGO_POSTGRESQL.md](INTEGRACAO_BACKEND_DJANGO_POSTGRESQL.md) - Integração completa
- [IMPLEMENTACAO_ATUAL.md](IMPLEMENTACAO_ATUAL.md) - Estado atual da implementação

### Para Negócios
- [ESTRATEGIA_IJPS_ZAWADI_DIGITAL.md](ESTRATEGIA_IJPS_ZAWADI_DIGITAL.md) - Estratégia de mercado
- [REUNIAO_CLIENTE_PERGUNTAS.md](REUNIAO_CLIENTE_PERGUNTAS.md) - Perguntas para reunião
- [ENTREGA_PROJETO.md](ENTREGA_PROJETO.md) - Resumo da entrega

---

## 🌐 APIs Disponíveis

### Endpoints Principais

**Propriedades**
- `GET /api/properties/` - Listar propriedades (com filtros)
- `GET /api/properties/{id}/` - Detalhes de propriedade

**Agentes**
- `GET /api/agents/` - Listar agentes

**Formulários**
- `POST /api/evaluations/` - Solicitar avaliação
- `POST /api/contacts/` - Enviar mensagem de contacto

### Filtros Disponíveis
- `type` - Tipo de propriedade (apartamento, casa, terreno, comercial, condomínio)
- `status` - Status (venda, arrendamento)
- `location` - Localização
- `bedrooms` - Número de quartos
- `bathrooms` - Número de casas de banho
- `is_featured` - Propriedades em destaque
- `is_verified` - Propriedades verificadas
- `search` - Busca por texto
- `ordering` - Ordenação (price, area, created_at)

---

## 🎨 Funcionalidades Implementadas

### Frontend
✅ Homepage com busca integrada  
✅ Listagem de propriedades com filtros  
✅ Detalhes de propriedade com galeria  
✅ Formulário de avaliação  
✅ Página de serviços  
✅ Design mobile-first e responsivo  
✅ Componentes reutilizáveis (Button, Card, Input, etc.)  

### Backend
✅ API REST completa  
✅ Admin Django configurado  
✅ Modelos: Property, Agent, PropertyImage, EvaluationRequest, ContactMessage  
✅ Filtros, busca e paginação  
✅ Upload de imagens  
✅ CORS configurado  

---

## 🚀 Deploy (Futuro)

### Frontend
- **Vercel** ou **Netlify** - Deploy automático do Next.js

### Backend
- **Railway**, **Render** ou **DigitalOcean** - Django + PostgreSQL
- **Cloudinary** ou **AWS S3** - Armazenamento de imagens

---

## 👥 Equipe

**Zawadi Digital**
- Desenvolvimento Frontend & Backend
- Design & UX/UI
- Marketing Digital
- Suporte Técnico

**IJPS - Imobiliária Jamal**
- Conteúdo e propriedades
- Conhecimento do mercado moçambicano
- Gestão de leads e vendas

---

## 📄 Licença

Projeto proprietário - IJPS & Zawadi Digital © 2026

---

## 📞 Suporte

Para questões técnicas ou de negócios, contacte Zawadi Digital.

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2026
