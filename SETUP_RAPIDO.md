# 🚀 SETUP RÁPIDO - IJPS Plataforma Completa

## Estrutura Reorganizada ✅

```
JamalImobiliaria/
├── frontend/          ← Todo código Next.js aqui
├── backend/           ← Todo código Django aqui  
└── *.md              ← Documentação
```

---

## ⚡ Início Rápido

### 1️⃣ Backend (Terminal 1)

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

✅ Backend: http://localhost:8000  
✅ Admin: http://localhost:8000/admin  
✅ API: http://localhost:8000/api/

### 2️⃣ Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

✅ Frontend: http://localhost:3000

---

## 🔧 Configuração Inicial (Primeira Vez)

### Backend

```powershell
cd backend

# Ativar virtualenv
.\.venv\Scripts\Activate.ps1

# Criar banco PostgreSQL
# No psql ou pgAdmin:
# CREATE DATABASE ijps_db;
# CREATE USER ijps_user WITH ENCRYPTED PASSWORD 'ijps_password_2026';
# GRANT ALL PRIVILEGES ON DATABASE ijps_db TO ijps_user;

# Editar backend/.env com suas credenciais

# Executar migrações
python manage.py makemigrations
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### Frontend

```powershell
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local

# Iniciar servidor
npm run dev
```

---

## 📋 Checklist

- [ ] PostgreSQL instalado e rodando
- [ ] Python 3.11+ instalado
- [ ] Node.js 18+ instalado
- [ ] Banco `ijps_db` criado no PostgreSQL
- [ ] Arquivo `backend/.env` configurado
- [ ] Migrações executadas (`python manage.py migrate`)
- [ ] Superusuário criado
- [ ] Arquivo `frontend/.env.local` criado
- [ ] Dependências do frontend instaladas (`npm install`)
- [ ] Backend rodando em http://localhost:8000
- [ ] Frontend rodando em http://localhost:3000

---

## 🆘 Problemas Comuns

### Backend não inicia
- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no arquivo `.env`
- Verifique se o virtualenv está ativado

### Frontend não conecta com backend
- Verifique se o backend está rodando
- Verifique a variável `NEXT_PUBLIC_API_URL` no `.env.local`
- Verifique CORS no backend (já configurado)

### Erro de migração
```powershell
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

---

## 📚 Documentação Completa

- [README_PROJETO.md](README_PROJETO.md) - Visão geral completa
- [INTEGRACAO_BACKEND_DJANGO_POSTGRESQL.md](INTEGRACAO_BACKEND_DJANGO_POSTGRESQL.md) - Guia passo a passo
- [frontend/README.md](frontend/README.md) - Documentação do frontend
- [backend/README.md](backend/README.md) - Documentação do backend

---

**Desenvolvido por Zawadi Digital para IJPS** 🚀
