# IJPS Backend API

Backend Django REST Framework para a plataforma IJPS.

## Setup Rápido

### 1. Ativar ambiente virtual

```powershell
.\.venv\Scripts\Activate.ps1
```

### 2. Instalar dependências (se necessário)

```powershell
pip install -r requirements.txt
```

### 3. Configurar PostgreSQL

Crie o banco de dados e usuário no PostgreSQL:

```sql
CREATE DATABASE ijps_db;
CREATE USER ijps_user WITH ENCRYPTED PASSWORD 'ijps_password_2026';
GRANT ALL PRIVILEGES ON DATABASE ijps_db TO ijps_user;
ALTER DATABASE ijps_db OWNER TO ijps_user;
```

### 4. Configurar variáveis de ambiente

Edite o arquivo `.env` com suas credenciais do PostgreSQL.

### 5. Executar migrações

```powershell
python manage.py makemigrations
python manage.py migrate
```

### 6. Criar superusuário

```powershell
python manage.py createsuperuser
```

### 7. Iniciar servidor

```powershell
python manage.py runserver
```

## Endpoints Disponíveis

- Admin: http://localhost:8000/admin
- API Root: http://localhost:8000/api/
- Properties: http://localhost:8000/api/properties/
- Agents: http://localhost:8000/api/agents/
- Evaluations: http://localhost:8000/api/evaluations/
- Contacts: http://localhost:8000/api/contacts/

## Estrutura

```
backend/
├── manage.py              # Utilitário Django
├── ijps_api/              # Configurações do projeto
│   ├── settings.py        # Configurações principais
│   ├── urls.py            # URLs raiz
│   └── wsgi.py            # WSGI para produção
├── core/                  # App principal
│   ├── models.py          # Modelos de dados
│   ├── views.py           # ViewSets da API
│   ├── serializers.py     # Serializers DRF
│   ├── admin.py           # Admin Django
│   └── api_urls.py        # URLs da API
├── media/                 # Upload de imagens (criado automaticamente)
├── static/                # Arquivos estáticos (criado automaticamente)
└── .env                   # Variáveis de ambiente
```

## Próximos Passos

Consulte o arquivo `INTEGRACAO_BACKEND_DJANGO_POSTGRESQL.md` na raiz do projeto para instruções completas de implementação.
