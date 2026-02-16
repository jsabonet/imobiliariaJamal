# Sistema de Preferências de Notificações Push - IJPS

## 📋 Visão Geral

Sistema completo de gerenciamento de preferências para notificações push, permitindo que usuários personalizem quando e como recebem alertas sobre propriedades.

## 🎯 Funcionalidades Implementadas

### 1. **Backend (Django)**

#### Modelo de Dados (PushSubscription)
Campos adicionados ao modelo existente:

**Preferências de Categorias:**
- `notify_new_properties` - Novas propriedades (padrão: ✅ ativo)
- `notify_price_changes` - Mudanças de preço (padrão: ✅ ativo)
- `notify_status_changes` - Mudanças de status (padrão: ✅ ativo)
- `notify_recommendations` - Recomendações (padrão: ❌ inativo)

**Filtros de Interesse:**
- `location_filters` - Array de localizações (JSON)
- `property_types` - Array de tipos de propriedade (JSON)
- `price_min` - Preço mínimo (Decimal)
- `price_max` - Preço máximo (Decimal)
- `bedrooms_min` - Quartos mínimos (Integer)

**Horário Silencioso:**
- `quiet_hours_enabled` - Ativar horário silencioso (Boolean)
- `quiet_hours_start` - Hora de início (Time, padrão: 22:00)
- `quiet_hours_end` - Hora de fim (Time, padrão: 08:00)

#### Endpoints API

**1. GET `/api/notifications/preferences/`**
```
Query Params: endpoint (obrigatório)
Retorna: Preferências completas da subscription
```

**2. PATCH `/api/notifications/preferences/update/`**
```json
{
  "endpoint": "https://...",
  "notify_new_properties": true,
  "notify_price_changes": true,
  "property_types": ["apartamento", "casa"],
  "price_min": 1000000,
  "price_max": 5000000,
  "bedrooms_min": 2,
  "quiet_hours_enabled": true,
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "08:00"
}
```

### 2. **Frontend (Next.js)**

#### Componentes Criados

**1. NotificationButton** (atualizado)
- Botão principal de ativação/desativação
- Botão de configurações (⚙️) quando ativo
- Integração com modais
- Gerencia estado de subscription

**2. FirstTimeNotificationModal**
- Modal que aparece na primeira ativação
- Seleção de categorias de interesse
- Interface visual com ícones e cores
- Categorias recomendadas destacadas
- Opção de pular configuração

**3. NotificationPreferences**
- Painel completo de configurações
- **Tipos de Notificação:**
  - Cards interativos para cada categoria
  - Ícones e cores distintivas
  - Toggle switches personalizados
  
- **Filtros de Interesse:**
  - Tipos de propriedade (multi-seleção)
  - Faixa de preço (min/max)
  - Quartos mínimos (dropdown)
  
- **Horário Silencioso:**
  - Toggle de ativação
  - Seleção de hora de início/fim
  - Explicação do comportamento

#### UX/UI Implementada

**Design System:**
```
Cores por Categoria:
- Novas Propriedades: Azul (#3B82F6)
- Mudanças de Preço: Verde (#10B981)
- Mudanças de Status: Laranja (#F59E0B)
- Recomendações: Roxo (#8B5CF6)
```

**Estados Visuais:**
- ✅ Ativo: Fundo colorido + borda colorida
- ⬜ Inativo: Fundo cinza + borda cinza
- 🔄 Loading: Spinner animado
- ✓ Sucesso: Tooltip de confirmação

### 3. **Banco de Dados**

**Migração:** `0008_pushsubscription_bedrooms_min_and_more.py`

Adiciona 12 novos campos ao modelo PushSubscription.

## 🚀 Como Usar

### Para Desenvolvedores

1. **Aplicar migração:**
```bash
cd backend
python manage.py migrate
```

2. **Reiniciar servidor Django:**
```bash
python manage.py runserver
```

3. **O frontend já está configurado** - basta testar!

### Para Usuários

1. **Primeira Ativação:**
   - Clique em "Ativar Notificações"
   - Permita notificações no navegador
   - Configure suas preferências no modal
   - Receba notificação de teste

2. **Gerenciar Preferências:**
   - Clique no ícone ⚙️ ao lado do botão
   - Ajuste categorias e filtros
   - Salve as alterações

3. **Horário Silencioso:**
   - Ative nas preferências
   - Configure horário de início/fim
   - Não receberá notificações nesse período

## 📊 Padrões de UX Implementados

✅ **Soft Permission** - Modal de configuração antes de pedir permissão nativa  
✅ **Granularidade** - Controle por categoria  
✅ **Contextualização** - Descrições claras do que cada opção faz  
✅ **Personalização** - Filtros de preço, tipo, localização  
✅ **Respeito** - Horário silencioso configurável  
✅ **Transparência** - Categorias recomendadas destacadas  
✅ **Reversibilidade** - Fácil desativação  

## 🔧 Estrutura de Arquivos

```
backend/
├── core/
│   ├── models.py                 # ✅ Modelo PushSubscription atualizado
│   ├── serializers.py            # ✅ Serializer atualizado
│   ├── views.py                  # ✅ Endpoints de preferências
│   ├── api_urls.py               # ✅ Rotas adicionadas
│   ├── admin.py                  # ✅ Admin interface melhorada
│   └── migrations/
│       └── 0008_...py            # ✅ Migração aplicada

frontend/
├── components/
│   ├── NotificationButton.tsx           # ✅ Atualizado
│   ├── FirstTimeNotificationModal.tsx   # ✅ Novo
│   └── NotificationPreferences.tsx      # ✅ Novo
└── lib/
    └── notifications.ts                  # ✅ Existente (sem alterações)
```

## 📝 Próximos Passos (Opcionais)

### Melhorias Futuras:
1. **Filtros de Localização** - Implementar seleção de cidades/bairros
2. **Frequência de Notificações** - Opções: Instantânea, Diária, Semanal
3. **Analytics** - Dashboard de notificações enviadas/abertas
4. **A/B Testing** - Testar mensagens e horários
5. **Rich Notifications** - Imagens e ações customizadas
6. **Multi-idioma** - Suporte para português e inglês

### Integrações Sugeridas:
- **Busca Salva** - Alertas baseados em buscas específicas
- **Favoritos** - Notificar mudanças em propriedades favoritas
- **Agentes** - Mensagens diretas de agentes
- **Visitas Agendadas** - Lembretes de compromissos

## 🎨 Screenshots Esperados

### 1. Modal de Primeira Ativação
```
┌─────────────────────────────────────┐
│ 🔔 Configure suas Notificações   ✕ │
├─────────────────────────────────────┤
│                                     │
│ [🏠] Novas Propriedades    ✓       │
│     Alertas quando novas...        │
│     [Recomendado]                  │
│                                     │
│ [💰] Reduções de Preço     ✓       │
│     Notificações de mudanças...    │
│     [Recomendado]                  │
│                                     │
│ [📊] Mudanças de Status    ✓       │
│     Atualizações de...             │
│                                     │
│ [🌟] Recomendações         ☐       │
│     Sugestões personalizadas...    │
│                                     │
├─────────────────────────────────────┤
│ [Pular]          [Continuar]      │
└─────────────────────────────────────┘
```

### 2. Painel de Preferências
```
┌─────────────────────────────────────┐
│ Preferências de Notificação     ✕  │
├─────────────────────────────────────┤
│ 🔔 Tipos de Notificação             │
│ [Cards com toggles...]              │
│                                     │
│ Filtros de Interesse                │
│ ┌─────────────────────────────────┐ │
│ │ Tipos: [Aprt] [Casa] [Terreno] │ │
│ │ Preço: 1M - 5M MZN              │ │
│ │ Quartos: 2+                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🕐 Horário Silencioso [ON]          │
│ ┌─────────────────────────────────┐ │
│ │ Início: 22:00  |  Fim: 08:00   │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [Cancelar]  [Salvar Preferências]  │
└─────────────────────────────────────┘
```

## 🧪 Testando

1. **Limpar localStorage:**
```javascript
localStorage.removeItem('notification_preferences_set');
```

2. **Recarregar e ativar notificações** - Verá o modal

3. **Configurar preferências** - Clique no ⚙️

4. **Verificar no Django Admin:**
   - http://localhost:8000/admin/core/pushsubscription/
   - Ver preferências salvas

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Logs do console (DevTools)
- Django Admin (subscriptions)
- Documentação do projeto

---

**Data de Implementação:** Fevereiro 2026  
**Versão:** 1.0  
**Status:** ✅ Completo e Funcional
