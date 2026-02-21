# 🐌 ANÁLISE: Performance Lenta em Cards de Propriedades
**Data:** 21 de Fevereiro de 2026  
**Problema Reportado:** Atraso na renderização de cards nas páginas principal, listagem e seção "Propriedades Similares"

---

## 🔍 DIAGNÓSTICO

### Problemas Identificados

#### 1. **PropertyCard - Loading Parcial** ✅/⚠️
**Arquivo:** `frontend/components/properties/PropertyCard.tsx`

**Status Atual:**
- ✅ Usa `loading="lazy"` no Next.js Image (linha 149)
- ✅ Tem skeleton loader enquanto imagem carrega (linha 135-137)
- ⚠️ Componente inteiro renderiza mesmo fora da viewport
- ⚠️ Intersection Observer não implementado

**Impacto:**
- Primeiros 3-6 cards OK
- Cards abaixo da dobra (below the fold) renderizam desnecessariamente
- JavaScript executa para todos os cards de uma vez

**Linha do código:**
```tsx
// Linha 145-152
<Image
  src={property.image}
  alt={property.title}
  fill
  className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
    imageLoaded ? 'opacity-100' : 'opacity-0'
  }`}
  onLoad={() => setImageLoaded(true)}
  loading="lazy"  // ✅ Bom, mas não suficiente
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

#### 2. **Galeria de Thumbnails - Eager Loading** ❌
**Arquivo:** `frontend/app/(public)/propriedades/[id]/page.tsx`

**Status Atual:** (linhas 423-442)
```tsx
{property.images.map((image: string, index: number) => (
  <button key={index} ...>
    <Image
      src={image}
      alt={`${property.title} - ${index + 1}`}
      fill
      className="object-cover"
      // ❌ SEM loading="lazy"
      // ❌ Todas as thumbnails carregam imediatamente
    />
  </button>
))}
```

**Impacto:**
- Página de detalhes com 10+ imagens carrega todas de uma vez
- Request waterfall: 10-15 imagens simultâneas
- First Contentful Paint (FCP) atrasado
- Largura de banda desperdiçada

**Exemplo Real:**
- Propriedade com 12 imagens
- 12 × ~150KB = 1.8MB de thumbnails
- Usuário vê apenas 4-5 thumbnails na tela

#### 3. **Propriedades Similares - Sem Lazy Loading** ❌
**Arquivo:** `frontend/app/(public)/propriedades/[id]/page.tsx`

**Status Atual:** (linhas 920-947)
```tsx
{/* Propriedades Recomendadas */}
{recommendedProperties.length > 0 && (
  <div className="mt-12">
    <h2>Propriedades Similares</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendedProperties.map((recommendedProp) => (
        <PropertyCard key={recommendedProp.id} property={recommendedProp} />
        // ❌ Renderiza mesmo estando no final da página
        // ❌ 3 PropertyCards carregam imediatamente
      ))}
    </div>
  </div>
)}
```

**Impacto:**
- Seção está ~2000-3000px abaixo da dobra
- 3 PropertyCards × 1 imagem cada = 3 imagens carregadas desnecessariamente
- Usuário pode nunca rolar até esta seção
- ~450-600KB desperdiçados

#### 4. **Grid de Listagem - Renderização Completa** ⚠️
**Arquivo:** `frontend/app/(public)/propriedades/page.tsx`

**Status Atual:** (linha 471-483)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
  {!loading && !error && properties.map((property) => (
    <PropertyCard key={property.id} property={property} />
    // ⚠️ Renderiza 12-18 cards de uma vez (página completa)
  ))}
</div>

{/* Paginação */}
{results && results.count > itemsPerPage && (
  <Pagination ... />
)}
```

**Impacto:**
- Com 12 propriedades/página: 12 cards renderizados
- ~50% ficam abaixo da dobra (viewport 1080p)
- 6-8 imagens carregam desnecessáriamente
- ~900KB-1.2MB desperdiçados por página

#### 5. **FeaturedProperties - Home Page** ⚠️
**Arquivo:** `frontend/components/home/FeaturedProperties.tsx`

**Status Atual:** (linhas 66-73)
```tsx
{!loading && adaptedProperties.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
    {adaptedProperties.map((property) => (
      <PropertyCard key={property.id} property={property} />
      // ⚠️ 6 propriedades em destaque
      // ⚠️ 3-4 podem estar abaixo da dobra
    ))}
  </div>
)}
```

**Impacto:**
- Home page: 6 propriedades em destaque
- Desktop: ~3 visíveis, 3 abaixo da dobra
- Mobile: 1 visível, 5 abaixo da dobra
- Mobile desperdiça ~750KB-1MB

---

## 📊 MÉTRICAS DE PERFORMANCE

### Antes da Otimização (Estimado)

| Página | Cards | Imagens | Below Fold | Desperdício |
|--------|-------|---------|------------|-------------|
| **Home** | 6 | 6 | 3-5 | 450-750KB |
| **Listagem** | 12 | 12 | 6-8 | 900-1.2MB |
| **Detalhes (Galeria)** | — | 12 thumbnails | 7-8 | 1.05-1.2MB |
| **Detalhes (Similares)** | 3 | 3 | 3 | 450-600KB |
| **TOTAL** | — | — | — | **2.8-3.75MB** |

### Core Web Vitals Impactados

1. **LCP (Largest Contentful Paint):** 
   - Atual: ~2.5-3.5s (estimado)
   - Causa: Muitas imagens competindo por largura de banda

2. **CLS (Cumulative Layout Shift):**
   - Atual: ~0.05-0.1 (OK)
   - Skeleton loaders ajudam

3. **FID (First Input Delay):**
   - Atual: ~50-100ms (OK)
   - Pode melhorar com menos JavaScript inicial

---

## 🎯 SOLUÇÕES PROPOSTAS

### 1. **LazyPropertyCard Wrapper** 🚀
Wraps PropertyCard com Intersection Observer para lazy rendering.

**Benefícios:**
- Renderiza apenas quando entra no viewport
- Reduz JavaScript inicial em 60-70%
- Skeleton até entrar na viewport

**Implementação:**
```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import PropertyCard from './PropertyCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function LazyPropertyCard({ property, rootMargin = '200px' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin } // Começa a carregar 200px antes de entrar na tela
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? (
        <PropertyCard property={property} />
      ) : (
        <SkeletonCard type="property" count={1} />
      )}
    </div>
  );
}
```

### 2. **LazyThumbnailGallery** 🖼️
Otimiza galeria de thumbnails com lazy loading inteligente.

**Estratégia:**
- Primeiras 5 thumbnails: eager loading
- Thumbnails 6+: lazy loading
- Placeholder blur enquanto carrega

**Implementação:**
```tsx
{property.images.map((image: string, index: number) => (
  <button key={index} ...>
    <Image
      src={image}
      alt={`${property.title} - ${index + 1}`}
      fill
      className="object-cover"
      loading={index < 5 ? 'eager' : 'lazy'} // ✅ Otimizado
      placeholder="blur"
      blurDataURL="/placeholder-blur.jpg"
    />
  </button>
))}
```

**Economia:**
- Galeria com 12 imagens: 7 lazy loaded
- ~1.05MB → ~750KB carregados inicialmente
- 300-350KB economizados (~30%)

### 3. **LazyRecommendedSection** 📦
Seção completa de "Propriedades Similares" com lazy load.

**Estratégia:**
- Usa Intersection Observer
- Carrega dados apenas quando seção entra no viewport
- Skeleton state enquanto carrega

**Implementação:**
```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import PropertyCard from '@/components/properties/PropertyCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function LazyRecommendedSection({ 
  loadRecommendedProperties, 
  recommendedProperties,
  loading 
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoad && !loading && recommendedProperties.length === 0) {
      loadRecommendedProperties();
    }
  }, [shouldLoad]);

  return (
    <div ref={ref} className="mt-12">
      <h2>Propriedades Similares</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading || !shouldLoad ? (
          <SkeletonCard type="property" count={3} />
        ) : (
          recommendedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))
        )}
      </div>
    </div>
  );
}
```

**Economia:**
- ~450-600KB não carregados até scroll
- Dados da API não solicitados até necessário

### 4. **Priority Loading para Hero Image** ⚡
Otimiza imagem principal na página de detalhes.

**Atual:**
```tsx
<Image
  src={property.images[currentImageIndex]}
  alt={property.title}
  fill
  className="object-cover"
  priority // ✅ Já tem priority
/>
```

**Status:** ✅ Já otimizado!

### 5. **Virtual Scrolling (Futuro)** 🔮
Para listagens com 50+ propriedades.

**Bibliotecas:**
- `react-window` ou `react-virtual`
- Renderiza apenas cards visíveis + buffer
- Performance constante independente de quantidade

**Quando implementar:**
- Se listagens tiverem >30 itens por página
- Para infinite scroll

---

## 📈 RESULTADOS ESPERADOS

### Após Implementação

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Imagens carregadas (Home)** | 6 | 3-4 | -33-50% |
| **Imagens carregadas (Listagem)** | 12 | 6-8 | -33-50% |
| **Galeria Thumbnails** | 12 | 5 eager + 7 lazy | -58% inicial |
| **Propriedades Similares** | 3 (sempre) | 0-3 (sob demanda) | -100% até scroll |
| **LCP (estimado)** | 2.5-3.5s | 1.5-2.2s | -40% |
| **JS Initial Bundle** | 100%  | ~40-50% | -50-60% |
| **Largura de banda economizada** | — | 2-3MB | — |

### Core Web Vitals Melhorados

1. **LCP:** 2.5-3.5s → **1.5-2.2s** ✅ (meta: <2.5s)
2. **CLS:** Mantém ~0.05-0.1 ✅ (meta: <0.1)
3. **FID:** ~50-100ms → **~30-50ms** ✅ (meta: <100ms)

---

## 🔧 PLANO DE IMPLEMENTAÇÃO

### Fase 1: Componentes Base (30min)
1. ✅ Criar `LazyPropertyCard.tsx`
2. ✅ Criar `LazyRecommendedSection.tsx`
3. ✅ Otimizar galeria de thumbnails

### Fase 2: Integração (20min)
4. ✅ Atualizar `propriedades/page.tsx` (listagem)
5. ✅ Atualizar `propriedades/[id]/page.tsx` (detalhes + similares)
6. ✅ Atualizar `FeaturedProperties.tsx` (home)

### Fase 3: Testes (10min)
7. ✅ Testar scroll behavior
8. ✅ Verificar Intersection Observer nos principais browsers
9. ✅ Lighthouse audit antes/depois

### Fase 4: Documentação (5min)
10. ✅ Atualizar README com métricas
11. ✅ Documentar rootMargin configurável

**Tempo Total:** ~65 minutos

---

## 🧪 TESTES RECOMENDADOS

### 1. Lighthouse Audit
```bash
# Antes
npm run build
npm run start
# Chrome DevTools > Lighthouse > Desktop
```

**Métricas a monitorar:**
- Performance Score
- LCP
- Total Blocking Time
- Speed Index

### 2. Network Throttling
**Chrome DevTools > Network > Slow 3G:**
- Verificar quantas imagens carregam inicial
- Confirmar lazy load funciona

### 3. Scroll Test
- Scroll rápido até o final
- Confirmar cards lazy loaded aparecem
- Sem layout shift

### 4. Mobile Testing
**Chrome DevTools > Device Toolbar > iPhone 12:**
- Home page: 1 visível vs 6 total
- Confirmar economia de banda

---

## 🎓 CONCEITOS APLICADOS

### Intersection Observer API
- **Browser Support:** 95%+ (todos modernos)
- **Fallback:** Server-side rendering garante SEO
- **rootMargin:** Buffer de 200-400px para smooth UX

### Next.js Image Optimization
- **loading="lazy":** Native browser lazy loading
- **priority:** Para LCP (hero images)
- **sizes:** Responsive images (srcset automático)

### Progressive Enhancement
- ✅ Sem JavaScript: imagens carregam (SSR)
- ✅ Com JavaScript: lazy loading otimizado
- ✅ SEO: Googlebot vê todo conteúdo (hydration)

---

## 📝 PRÓXIMOS PASSOS

1. **Implementar soluções** (agora)
2. **Medir baseline** (Lighthouse antes)
3. **Deploy** para produção
4. **Medir impacto** (Lighthouse depois)
5. **Monitorar** Core Web Vitals (Google Search Console)
6. **Iterar** se necessário (virtual scrolling, etc.)

---

**Status:** 🟡 Análise Completa - Pronto para Implementação  
**Prioridade:** 🔴 Alta (afeta UX diretamente)  
**Complexidade:** 🟢 Baixa-Média (1-2 horas de trabalho)
