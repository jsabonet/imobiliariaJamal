# Sistema de Loading - IJPS Zawadi Digital

## 📋 Visão Geral

Sistema de loading profissional e elegante para a plataforma imobiliária, com componentes adaptados ao design e identidade visual da marca.

## 🎨 Componentes Disponíveis

### 1. PageLoader
**Uso:** Transições de página completas e carregamento inicial
**Características:**
- Logo animado da imobiliária (ícone de casa)
- Círculo rotativo com cores da marca
- Efeito pulsante
- Pontos animados
- Mensagem customizável
- Tela cheia ou parcial

**Exemplo de Uso:**
```tsx
import PageLoader from '@/components/ui/PageLoader';

function MyPage() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <PageLoader message="Carregando propriedades" />;
  }
  
  return <div>Conteúdo da página</div>;
}
```

**Props:**
- `message?: string` - Mensagem de loading (padrão: "Carregando...")
- `fullScreen?: boolean` - Tela cheia (padrão: true)

---

### 2. LoadingSpinner
**Uso:** Indicadores de loading inline, botões, seções pequenas
**Características:**
- Spinner rotativo minimalista
- Múltiplos tamanhos (sm, md, lg, xl)
- Cores customizáveis (primary, secondary, white, accent)
- Opcional: texto ao lado
- Opcional: centralização automática

**Exemplo de Uso:**
```tsx
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Simples
<LoadingSpinner />

// Com texto
<LoadingSpinner size="md" text="Carregando dados..." />

// Centralizado
<LoadingSpinner centered />

// Em botão
<Button disabled={loading}>
  {loading && <LoadingSpinner size="sm" color="white" />}
  {loading ? 'Enviando...' : 'Enviar'}
</Button>
```

**Props:**
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Tamanho (padrão: 'md')
- `color?: 'primary' | 'secondary' | 'white' | 'accent'` - Cor (padrão: 'primary')
- `text?: string` - Texto opcional ao lado
- `centered?: boolean` - Centralizar (padrão: false)

---

### 3. LoadingOverlay
**Uso:** Operações assíncronas que bloqueiam a interface (envio de formulários, processamento)
**Características:**
- Overlay com backdrop blur
- Ícone contextual (default, property, form)
- Animação elegante de entrada
- Barra de progresso animada
- Mensagem e subtítulo

**Exemplo de Uso:**
```tsx
import LoadingOverlay from '@/components/ui/LoadingOverlay';

function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setSubmitting(true);
    // ... enviar dados
    setSubmitting(false);
  };
  
  return (
    <div>
      <LoadingOverlay 
        isOpen={submitting} 
        message="Enviando mensagem" 
        type="form" 
      />
      <form onSubmit={handleSubmit}>...</form>
    </div>
  );
}
```

**Props:**
- `isOpen: boolean` - Controla visibilidade (obrigatório)
- `message?: string` - Mensagem principal (padrão: "Processando...")
- `type?: 'default' | 'property' | 'form'` - Tipo de ícone

---

### 4. SkeletonCard
**Uso:** Placeholders enquanto dados estão carregando
**Características:**
- Animação shimmer elegante
- Tipos específicos (property, evaluation, contact, agent)
- Quantidade configurável
- Design adaptado ao conteúdo

**Exemplo de Uso:**
```tsx
import SkeletonCard from '@/components/ui/SkeletonCard';

function PropertyList() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  
  return (
    <div className="grid grid-cols-3 gap-6">
      {loading ? (
        <SkeletonCard type="property" count={6} />
      ) : (
        properties.map(prop => <PropertyCard key={prop.id} {...prop} />)
      )}
    </div>
  );
}
```

**Props:**
- `type?: 'property' | 'evaluation' | 'contact' | 'agent'` - Tipo (padrão: 'property')
- `count?: number` - Quantidade de cards (padrão: 1)

---

## 🎯 Casos de Uso

### Carregamento de Página
```tsx
// app/(public)/propriedades/[id]/page.tsx
if (loading) {
  return <PageLoader message="Carregando propriedade" />;
}
```

### Lista com Skeleton
```tsx
// app/(public)/propriedades/page.tsx
<div className="grid gap-6">
  {loading ? (
    <SkeletonCard type="property" count={6} />
  ) : (
    properties.map(p => <PropertyCard {...p} />)
  )}
</div>
```

### Formulário com Overlay
```tsx
// app/(public)/contacto/page.tsx
<LoadingOverlay 
  isOpen={loading} 
  message="Enviando mensagem" 
  type="form" 
/>
```

### Botão com Spinner
```tsx
<Button type="submit" disabled={loading}>
  {loading && <LoadingSpinner size="sm" color="white" />}
  {loading ? 'Enviando...' : 'Enviar'}
</Button>
```

---

## 🎨 Design e Animações

### Cores
- **Primary**: #C8552B (laranja da marca)
- **Secondary**: #2C3E50 (azul escuro)
- **Accent**: #27AE60 (verde)

### Animações CSS Disponíveis
```css
/* Shimmer - para skeleton loading */
.animate-shimmer

/* Loading Bar - barra de progresso */
.animate-loading-bar

/* Scale In - entrada suave */
.animate-scale-in

/* Fade In - fade suave */
.animate-fade-in

/* Bounce - usado no ícone */
.animate-bounce

/* Spin - spinner rotativo */
.animate-spin

/* Pulse - pulsação */
.animate-pulse
```

---

## 📦 Importação

### Individual
```tsx
import PageLoader from '@/components/ui/PageLoader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import SkeletonCard from '@/components/ui/SkeletonCard';
```

### Centralizada
```tsx
import { 
  PageLoader, 
  LoadingSpinner, 
  LoadingOverlay, 
  SkeletonCard 
} from '@/components/ui/loading';
```

---

## ✅ Páginas Já Integradas

### Públicas
- ✅ `/propriedades` - Lista de propriedades (SkeletonCard)
- ✅ `/propriedades/[id]` - Detalhe (PageLoader + LoadingOverlay)
- ✅ `/contacto` - Formulário (LoadingOverlay)
- ✅ `/avaliar` - Formulário (LoadingOverlay)

### Dashboard
- ✅ `/dashboard/avaliacoes` - Lista (SkeletonCard)
- ✅ `/dashboard/contactos` - Lista (SkeletonCard)

---

## 🎯 Melhores Práticas

### 1. Use o componente certo para cada situação
- **Página inteira**: `PageLoader`
- **Lista de dados**: `SkeletonCard`
- **Formulário/Operação**: `LoadingOverlay`
- **Botão/Inline**: `LoadingSpinner`

### 2. Sempre forneça feedback visual
```tsx
// ❌ Evite
<button onClick={submit}>Enviar</button>

// ✅ Faça
<button onClick={submit} disabled={loading}>
  {loading ? 'Enviando...' : 'Enviar'}
</button>
```

### 3. Use mensagens contextuais
```tsx
// ❌ Genérico
<LoadingOverlay isOpen={true} />

// ✅ Específico
<LoadingOverlay 
  isOpen={true} 
  message="Enviando pedido de avaliação" 
  type="property" 
/>
```

### 4. Combine com estados de erro
```tsx
if (loading) return <PageLoader />;
if (error) return <ErrorMessage />;
return <Content />;
```

---

## 🔧 Customização

### Alterar cores do PageLoader
```tsx
// components/ui/PageLoader.tsx
<div className="border-primary-600">  // Cor principal
<FiHome className="text-primary-600" />  // Ícone
```

### Adicionar novo tipo de ícone no LoadingOverlay
```tsx
// components/ui/LoadingOverlay.tsx
case 'custom':
  return <FiIcon className="w-8 h-8 text-primary-600" />;
```

### Criar novo tipo de Skeleton
```tsx
// components/ui/SkeletonCard.tsx
const CustomSkeleton = () => (
  <div className="animate-pulse">
    {/* Seu design */}
  </div>
);
```

---

## 📱 Responsividade

Todos os componentes são totalmente responsivos:
- Mobile-first design
- Touch targets adequados (min 44px)
- Animações otimizadas
- Backdrop blur suportado

---

## ⚡ Performance

- Animações CSS nativas (não JS)
- Componentes leves
- Lazy loading quando possível
- Sem bibliotecas externas

---

## 🐛 Troubleshooting

### Problema: Animações não funcionam
**Solução**: Verifique se `globals.css` foi importado corretamente

### Problema: LoadingOverlay não bloqueia scroll
**Solução**: Verifique `z-index` (padrão: z-50)

### Problema: Cores não aparecem
**Solução**: Confirme configuração do Tailwind em `tailwind.config.ts`

---

## 📄 Licença

Sistema desenvolvido exclusivamente para **IJPS Zawadi Digital**
© 2026 - Todos os direitos reservados
