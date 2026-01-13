# IJPS Frontend - Next.js

Frontend da plataforma IJPS desenvolvido com Next.js 14, React 18, TypeScript e Tailwind CSS.

## 🚀 Começar

### Instalar dependências

```powershell
npm install
```

### Configurar variáveis de ambiente

Crie um arquivo `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Executar em desenvolvimento

```powershell
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Estilos globais
│   ├── propriedades/      # Páginas de propriedades
│   ├── avaliar/           # Avaliação de imóveis
│   ├── servicos/          # Serviços
│   ├── sobre/             # Sobre nós
│   └── contacto/          # Contacto
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── layout/           # Navbar, Footer
│   ├── home/             # Componentes da homepage
│   └── properties/       # Componentes de propriedades
├── lib/                  # Utilitários e API (será criado)
├── public/               # Assets estáticos
└── package.json          # Dependências
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Iniciar servidor de produção
- `npm run lint` - Executar linter

## 📚 Documentação

Para documentação completa, consulte:
- [README.md](../README.md) - Visão geral do projeto
- [IMPLEMENTACAO_ATUAL.md](../IMPLEMENTACAO_ATUAL.md) - Implementação atual
- [GUIA_DESENVOLVIMENTO.md](../GUIA_DESENVOLVIMENTO.md) - Guia de desenvolvimento
- [INTEGRACAO_BACKEND_DJANGO_POSTGRESQL.md](../INTEGRACAO_BACKEND_DJANGO_POSTGRESQL.md) - Integração com backend

## 🌐 Integração com Backend

O frontend consome a API Django em `http://localhost:8000/api`. 

Configure a variável `NEXT_PUBLIC_API_URL` no arquivo `.env.local` para apontar para a URL correta da API.

## 📦 Tecnologias

- Next.js 14.2.18
- React 18.3.1
- TypeScript 5
- Tailwind CSS 3.4.1
- React Icons 5.3.0
- Swiper 11.1.14
