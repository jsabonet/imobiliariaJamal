# Guia Completo de Integração Backend (Django + PostgreSQL) com Frontend (Next.js)

Plataforma: IJPS - Imobiliária Jamal & Prestação de Serviços  
Autores: Zawadi Digital  
Data: Jan 2026

---

## Objetivo

Implementar um backend robusto em Django com banco de dados PostgreSQL, expor uma API REST para propriedades, avaliações e contactos, configurar uma área administrativa completa, e integrar o frontend Next.js com estes endpoints.

---

## Visão Geral da Arquitetura

- Frontend: Next.js 14 (App Router) — já implementado
- Backend: Django 5 + Django REST Framework (DRF)
- Banco de dados: PostgreSQL
- Autenticação: Admin via Django Admin (MVP); API pública de leitura
- Uploads: Sistema de media local (MVP), com opção de S3/Cloudinary depois
- CORS: `next` (http://localhost:3000) em desenvolvimento, domínio IJPS na produção
- Localização: `pt` e fuso horário `Africa/Maputo`

---

## Pré-requisitos (Windows)

- Python 3.11+ instalado (verifique com `python --version`)
- PostgreSQL 14+ (com pgAdmin ou psql)
- Git
- Node.js 18+

---

## Passo 1 — Criar a pasta do Backend

Estruture o backend dentro do mesmo repositório:

```
JamalImobiliaria/
├── backend/
│   ├── manage.py
│   ├── ijps_api/            # Projeto Django
│   └── core/                # App principal
└── app/, components/, ...   # Frontend Next.js existente
```

Comandos (PowerShell):

```powershell
# Na raiz do projeto
cd d:\Projectos\JamalImobiliaria

# Criar pasta backend
mkdir backend; cd backend

# Criar e ativar virtualenv
python -m venv .venv; .\.venv\Scripts\Activate.ps1

# Instalar Django e libs
pip install django djangorestframework psycopg2-binary django-cors-headers Pillow django-filter python-dotenv

# Criar projeto e app
django-admin startproject ijps_api .
python manage.py startapp core
```

Crie um arquivo `.env` em `backend/.env`.

---

## Passo 2 — Configurar PostgreSQL

1. Criar base de dados `ijps_db` e usuário `ijps_user` com senha segura.

Exemplo (psql):

```sql
CREATE DATABASE ijps_db;
CREATE USER ijps_user WITH ENCRYPTED PASSWORD 'SENHA_SEGURA_AQUI';
GRANT ALL PRIVILEGES ON DATABASE ijps_db TO ijps_user;
```

2. Ajustar `.env` do backend:

```
DJANGO_SECRET_KEY=troque_por_uma_chave_secreta
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DJANGO_CORS_ORIGINS=http://localhost:3000

DB_NAME=ijps_db
DB_USER=ijps_user
DB_PASSWORD=SENHA_SEGURA_AQUI
DB_HOST=localhost
DB_PORT=5432

# Media/Static
MEDIA_URL=/media/
STATIC_URL=/static/
TIME_ZONE=Africa/Maputo
LANGUAGE_CODE=pt
```

---

## Passo 3 — Configurar `settings.py`

Edite `backend/ijps_api/settings.py`:

```python
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'unsafe-secret')
DEBUG = os.getenv('DJANGO_DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'corsheaders',
    'django_filters',

    # Local
    'core',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ijps_api.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.debug',
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
        ],
    },
}]

WSGI_APPLICATION = 'ijps_api.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

LANGUAGE_CODE = os.getenv('LANGUAGE_CODE', 'pt')
TIME_ZONE = os.getenv('TIME_ZONE', 'Africa/Maputo')
USE_I18N = True
USE_TZ = True

STATIC_URL = os.getenv('STATIC_URL', '/static/')
STATIC_ROOT = BASE_DIR / 'static'
MEDIA_URL = os.getenv('MEDIA_URL', '/media/')
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# DRF
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/minute',
        'user': '1000/minute',
    },
}

# CORS
CORS_ALLOWED_ORIGINS = os.getenv('DJANGO_CORS_ORIGINS', '').split(',')
```

Em `backend/ijps_api/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.api_urls')),  # criaremos este arquivo
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## Passo 4 — Modelos (core/models.py)

Defina entidades principais:

```python
from django.db import models

class Agent(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=30)
    whatsapp = models.CharField(max_length=30, blank=True, null=True)
    photo = models.ImageField(upload_to='agents/', blank=True, null=True)

    def __str__(self):
        return self.name

class Property(models.Model):
    TYPE_CHOICES = [
        ('apartamento', 'Apartamento'),
        ('casa', 'Casa'),
        ('terreno', 'Terreno'),
        ('comercial', 'Comercial'),
        ('condominio', 'Condomínio'),
    ]
    STATUS_CHOICES = [
        ('venda', 'Venda'),
        ('arrendamento', 'Arrendamento'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)   # ex: Maputo, Matola, bairro
    price = models.DecimalField(max_digits=14, decimal_places=2)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    bedrooms = models.PositiveIntegerField(default=0)
    bathrooms = models.PositiveIntegerField(default=0)
    area = models.PositiveIntegerField(help_text='m²', default=0)

    is_featured = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    amenities = models.JSONField(default=list, blank=True)  # ['garagem', 'piscina']

    agent = models.ForeignKey(Agent, on_delete=models.SET_NULL, null=True, related_name='properties')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='properties/')
    order = models.PositiveIntegerField(default=0)

class EvaluationRequest(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    property_type = models.CharField(max_length=50)
    location = models.CharField(max_length=200)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=30)
    message = models.TextField()
    property = models.ForeignKey(Property, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

Migrações:

```powershell
python manage.py makemigrations
python manage.py migrate
```

---

## Passo 5 — Admin (core/admin.py)

```python
from django.contrib import admin
from .models import Agent, Property, PropertyImage, EvaluationRequest, ContactMessage

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'price', 'type', 'status', 'is_featured', 'is_verified')
    list_filter = ('type', 'status', 'location', 'is_featured', 'is_verified')
    search_fields = ('title', 'location', 'description')
    inlines = [PropertyImageInline]

@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email')
    search_fields = ('name',)

@admin.register(EvaluationRequest)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'property_type', 'location', 'created_at')
    search_fields = ('name', 'email', 'location')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'property', 'created_at')
    search_fields = ('name', 'phone')
```

Crie superusuário:

```powershell
python manage.py createsuperuser
```

Acesse `http://localhost:8000/admin`.

---

## Passo 6 — API (DRF)

Crie `core/serializers.py`:

```python
from rest_framework import serializers
from .models import Property, PropertyImage, Agent, EvaluationRequest, ContactMessage

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'name', 'email', 'phone', 'whatsapp', 'photo']

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'order']

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    agent = AgentSerializer(read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'location', 'price', 'type', 'status',
            'bedrooms', 'bathrooms', 'area', 'is_featured', 'is_verified', 'amenities',
            'agent', 'images', 'created_at'
        ]

class EvaluationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationRequest
        fields = ['id', 'name', 'email', 'phone', 'property_type', 'location', 'details', 'created_at']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'message', 'property', 'created_at']
```

Crie `core/views.py`:

```python
from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Property, Agent, EvaluationRequest, ContactMessage
from .serializers import (
    PropertySerializer, AgentSerializer,
    EvaluationRequestSerializer, ContactMessageSerializer
)

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.select_related('agent').prefetch_related('images').order_by('-created_at')
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status', 'location', 'bedrooms', 'bathrooms', 'is_featured', 'is_verified']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'area', 'created_at']

class AgentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

class EvaluationRequestViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = EvaluationRequest.objects.all().order_by('-created_at')
    serializer_class = EvaluationRequestSerializer

class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
```

Crie `core/api_urls.py`:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, AgentViewSet, EvaluationRequestViewSet, ContactMessageViewSet

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'evaluations', EvaluationRequestViewSet, basename='evaluation')
router.register(r'contacts', ContactMessageViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
]
```

Inicie o servidor:

```powershell
python manage.py runserver
```

Testar:
- `GET http://localhost:8000/api/properties/`
- `GET http://localhost:8000/api/properties/?type=casa&location=Maputo`
- `GET http://localhost:8000/api/properties/1/`
- `POST http://localhost:8000/api/evaluations/` (JSON body)
- `POST http://localhost:8000/api/contacts/` (JSON body)

---

## Passo 7 — Popular dados (opcional)

Crie `core/management/commands/seed.py` para semear dados inicial:

```python
from django.core.management.base import BaseCommand
from core.models import Agent, Property

class Command(BaseCommand):
    help = 'Popula dados iniciais'

    def handle(self, *args, **options):
        agent, _ = Agent.objects.get_or_create(name='Agente IJPS', phone='+258840000000')
        Property.objects.get_or_create(
            title='Casa Moderna na Somershield',
            defaults={
                'description': 'Casa de luxo com piscina',
                'location': 'Maputo',
                'price': 15000000,
                'type': 'casa',
                'status': 'venda',
                'bedrooms': 4,
                'bathrooms': 3,
                'area': 350,
                'is_featured': True,
                'is_verified': True,
                'agent': agent,
                'amenities': ['garagem', 'piscina', 'jardim'],
            }
        )
        self.stdout.write(self.style.SUCCESS('Dados iniciais criados'))
```

Execute:

```powershell
python manage.py makemigrations; python manage.py migrate; python manage.py loaddata || python manage.py seed
```

---

## Passo 8 — Integração com o Frontend (Next.js)

1. Crie `lib/api.ts` (conforme guia já no projeto) e defina `NEXT_PUBLIC_API_URL`.

Crie `.env.local` no frontend (raiz do projeto Next):

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

2. Funções de API no frontend:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchProperties(params?: Record<string, string | number>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const res = await fetch(`${API_URL}/properties/${queryString}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Falha ao buscar propriedades');
  return res.json();
}

export async function fetchPropertyById(id: string) {
  const res = await fetch(`${API_URL}/properties/${id}/`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Falha ao buscar propriedade');
  return res.json();
}

export async function submitEvaluation(data: any) {
  const res = await fetch(`${API_URL}/evaluations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao enviar avaliação');
  return res.json();
}

export async function submitContact(data: any) {
  const res = await fetch(`${API_URL}/contacts/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao enviar contacto');
  return res.json();
}
```

3. Uso nas páginas:
- Atualize `app/propriedades/page.tsx` para consumir `fetchProperties()`
- Atualize `app/propriedades/[id]/page.tsx` para consumir `fetchPropertyById()`
- Atualize `app/avaliar/page.tsx` para enviar `submitEvaluation()`
- Atualize formulário de contacto para enviar `submitContact()`

4. Imagens:
- `image` de `PropertyImage` retorna URL absoluta (via MEDIA_URL). Configure Next Image Domains se necessário no `next.config.mjs`:

```js
export default {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/media/**' },
    ],
  },
}
```

---

## Passo 9 — Segurança e Produção

- Desative `DEBUG` em produção
- Defina `ALLOWED_HOSTS` com o domínio IJPS
- Configure `CORS_ALLOWED_ORIGINS` com o domínio do frontend
- Ative `SECURE_*` headers e `CSRF_TRUSTED_ORIGINS` (se houver sessões)
- Use armazenamento de media externo (S3/Cloudinary) para imagens
- Banco: PostgreSQL gerenciado (Railway, Render, DigitalOcean)
- Backend: Deploy em Railway/Render/DigitalOcean + gunicorn

Exemplo `Procfile` (se usar Render/Heroku):

```
web: gunicorn ijps_api.wsgi --log-file -
```

Exemplo `requirements.txt` (gere com `pip freeze > requirements.txt`).

---

## Passo 10 — Admin Avançado

- Personalizar branding do admin (`admin.site.site_header = 'IJPS Admin'`)
- Permissões por grupo (Agentes vs Admin)
- Export CSV via ações no admin
- Campos somente leitura para `created_at`
- Pré-visualização de imagens inline

---

## API — Especificação Rápida

- `GET /api/properties/` → lista com paginação `count`, `next`, `previous`, `results`
- Filtros: `type`, `status`, `location`, `bedrooms`, `bathrooms`, `is_featured`, `is_verified`
- Busca: `search=texto`
- Ordenação: `ordering=price|area|created_at` (prefixo `-` para desc)
- `GET /api/properties/{id}/` → detalhe
- `GET /api/agents/` → lista de agentes
- `POST /api/evaluations/` → criar solicitação
- `POST /api/contacts/` → criar contacto

Exemplo `POST /api/evaluations/` body:

```json
{
  "name": "João",
  "email": "joao@example.com",
  "phone": "+258840000000",
  "property_type": "casa",
  "location": "Maputo",
  "details": "Pretendo avaliar para venda"
}
```

---

## Testes Básicos (opcional)

- Crie `core/tests/test_properties.py` com testes de API (pytest ou unittest)
- Valide filtros, paginação e schema

---

## Checklist de Execução

1. Criar backend e virtualenv
2. Instalar dependências
3. Criar projeto e app
4. Configurar `.env`, DB e `settings.py`
5. Criar modelos e migrações
6. Registrar no admin
7. Implementar serializers, viewsets e rotas
8. Semear dados (opcional)
9. Configurar CORS e iniciar servidor
10. Integrar frontend (lib/api.ts, páginas)
11. Testar end-to-end
12. Planejar deploy

---

## Próximos Passos

- Implementar autenticação (JWT) para endpoints de escrita (fase 2)
- Adicionar Google Maps no detalhe da propriedade
- Dashboard de métricas no admin
- CDN/Cloud storage para imagens
- Monitoramento (Sentry) e logs estruturados

---

Este guia cobre ponta-a-ponta a implementação do backend IJPS e a integração com o frontend Next.js. Seguindo estes passos, você terá uma plataforma funcional, administrável e pronta para evoluir para produção.
