# Passo 8 - Integração Frontend Concluída

## ✅ Arquivos Criados

### 1. Configuração de Ambiente
- **frontend/.env.local** - Variável de ambiente com URL da API

### 2. Cliente API
- **frontend/lib/api.ts** - Funções para comunicação com backend Django
  - `fetchProperties()` - Buscar propriedades com filtros
  - `fetchPropertyById()` - Buscar detalhes de propriedade
  - `fetchAgents()` - Buscar agentes
  - `submitEvaluation()` - Enviar pedido de avaliação
  - `submitContact()` - Enviar mensagem de contacto
  - Tipos TypeScript incluídos (Property, Agent, PropertyImage, etc.)

### 3. Configuração Next.js
- **frontend/next.config.mjs** - Configurado para aceitar imagens do backend Django (localhost:8000/media)

## 📝 Próximas Integrações Necessárias

### Atualizar Componentes (Exemplos fornecidos abaixo)

1. **app/propriedades/page.tsx** - Lista de propriedades
2. **app/avaliar/page.tsx** - Formulário de avaliação  
3. **components/home/FeaturedProperties.tsx** - Propriedades em destaque na home
4. **app/contacto/page.tsx** - Formulário de contacto

## 🔧 Como Usar a API

### Exemplo 1: Buscar Propriedades com Filtros

\`\`\`tsx
'use client';
import { useEffect, useState } from 'react';
import { fetchProperties, Property, PaginatedResponse } from '@/lib/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const data: PaginatedResponse<Property> = await fetchProperties({
          is_featured: 'true',  // Apenas destaque
          ordering: '-created_at',  // Mais recentes primeiro
        });
        setProperties(data.results);
      } catch (error) {
        console.error('Erro ao carregar propriedades:', error);
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
        <div key={property.id}>
          <h3>{property.title}</h3>
          <p>{property.location}</p>
          <p>{property.price} MZN</p>
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Exemplo 2: Enviar Formulário de Avaliação

\`\`\`tsx
'use client';
import { useState } from 'react';
import { submitEvaluation } from '@/lib/api';

export default function EvaluationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property_type: '',
    location: '',
    details: '',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitEvaluation(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', property_type: '', location: '', details: '' });
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      {/* ... outros campos ... */}
      <button type="submit">Enviar Pedido</button>
      {success && <p>Pedido enviado com sucesso!</p>}
    </form>
  );
}
\`\`\`

### Exemplo 3: Exibir Imagens do Backend

\`\`\`tsx
import Image from 'next/image';
import { Property } from '@/lib/api';

export default function PropertyCard({ property }: { property: Property }) {
  const mainImage = property.images[0]?.image || '/placeholder.jpg';

  return (
    <div>
      <Image
        src={mainImage}
        alt={property.title}
        width={400}
        height={300}
        className="rounded-lg"
      />
      <h3>{property.title}</h3>
      <p>{property.location}</p>
    </div>
  );
}
\`\`\`

## 🎯 Filtros Disponíveis na API

### fetchProperties(params)

\`\`\`typescript
await fetchProperties({
  type: 'casa',              // 'apartamento' | 'casa' | 'terreno' | 'comercial' | 'condominio'
  status: 'venda',           // 'venda' | 'arrendamento'
  location: 'Maputo',        // Texto livre
  bedrooms: '3',             // Número
  bathrooms: '2',            // Número
  is_featured: 'true',       // 'true' | 'false'
  is_verified: 'true',       // 'true' | 'false'
  search: 'piscina',         // Busca em title, description, location
  ordering: '-price',        // 'price' | '-price' | 'area' | '-area' | 'created_at' | '-created_at'
});
\`\`\`

## 🚀 Testar Integração

1. **Iniciar Backend Django:**
\`\`\`powershell
cd d:\\Projectos\\JamalImobiliaria\\backend
d:\\Projectos\\JamalImobiliaria\\backend\\.venv\\Scripts\\python.exe manage.py runserver
\`\`\`

2. **Iniciar Frontend Next.js:**
\`\`\`powershell
cd d:\\Projectos\\JamalImobiliaria\\frontend
npm run dev
\`\`\`

3. **Verificar:**
- Backend: http://localhost:8000/api/properties/
- Frontend: http://localhost:3000
- Admin: http://localhost:8000/admin/

## 📊 Status da Integração

✅ Configuração de ambiente (.env.local)
✅ Cliente API (lib/api.ts)
✅ Configuração de imagens (next.config.mjs)
⏳ Atualização de páginas (próximo passo)
⏳ Atualização de componentes (próximo passo)

## 🔗 URLs da API

- **Propriedades:** http://localhost:8000/api/properties/
- **Agentes:** http://localhost:8000/api/agents/
- **Avaliações:** http://localhost:8000/api/evaluations/ (POST)
- **Contactos:** http://localhost:8000/api/contacts/ (POST)
- **API Root:** http://localhost:8000/api/
