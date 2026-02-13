# 🚀 Como Executar a Plataforma IJPS Imobiliária

## ⚠️ IMPORTANTE: Sempre Use o Ambiente Virtual!

O erro `ModuleNotFoundError: No module named 'pywebpush'` acontece quando você usa o Python global em vez do ambiente virtual.

---

## 📋 Métodos para Executar

### ✅ MÉTODO 1: Ativar Ambiente Virtual (RECOMENDADO)

```powershell
# 1. Navegar para o backend
cd D:\Projectos\JamalImobiliaria\backend

# 2. Ativar o ambiente virtual
..\.venv\Scripts\Activate.ps1

# 3. Executar comandos normalmente
python manage.py runserver
python manage.py migrate
python manage.py createsuperuser
python test_watermark.py
```

**Como saber se está ativo?**  
Seu prompt mostrará `(.venv)` no início:
```
(.venv) PS D:\Projectos\JamalImobiliaria\backend>
```

---

### ✅ MÉTODO 2: Script Automático (MAIS FÁCIL)

```powershell
# No diretório backend
cd D:\Projectos\JamalImobiliaria\backend
.\start-server.ps1
```

Este script:
- ✅ Ativa o ambiente virtual automaticamente
- ✅ Inicia o servidor Django
- ✅ Mostra URLs úteis

---

### ✅ MÉTODO 3: Caminho Completo (Sem Ativar)

```powershell
cd D:\Projectos\JamalImobiliaria\backend

# Runserver
D:\Projectos\JamalImobiliaria\.venv\Scripts\python.exe manage.py runserver

# Migrate
D:\Projectos\JamalImobiliaria\.venv\Scripts\python.exe manage.py migrate

# Teste de marca d'água
D:\Projectos\JamalImobiliaria\.venv\Scripts\python.exe test_watermark.py
```

---

## 🎯 Executar Backend + Frontend

### Terminal 1 - Backend (Django)
```powershell
cd D:\Projectos\JamalImobiliaria\backend
..\.venv\Scripts\Activate.ps1
python manage.py runserver
```

### Terminal 2 - Frontend (Next.js)
```powershell
cd D:\Projectos\JamalImobiliaria\frontend
npm run dev
```

---

## 🔧 Comandos Úteis

### Django (Backend)

```powershell
# Sempre ative o ambiente virtual primeiro!
..\.venv\Scripts\Activate.ps1

# Executar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Criar shell interativo
python manage.py shell

# Limpar sessões expiradas
python manage.py clearsessions

# Testar marca d'água
python test_watermark.py

# Processar imagens com marca d'água
python manage.py add_watermark_to_existing

# Ver lista de comandos
python manage.py help
```

### Next.js (Frontend)

```powershell
# Instalar dependências
npm install

# Modo desenvolvimento
npm run dev

# Build de produção
npm run build

# Executar produção
npm start

# Lint
npm run lint
```

---

## 🐛 Troubleshooting

### ❌ ModuleNotFoundError: No module named 'pywebpush'

**Problema**: Você está usando Python global, não o ambiente virtual.

**Solução**:
```powershell
# Ativar ambiente virtual
cd D:\Projectos\JamalImobiliaria\backend
..\.venv\Scripts\Activate.ps1

# OU usar o script
.\start-server.ps1
```

### ❌ Ambiente virtual não ativa

**Solução**:
```powershell
# Permitir execução de scripts (executar como Administrador)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Tentar ativar novamente
..\.venv\Scripts\Activate.ps1
```

### ❌ Port 8000 already in use

**Solução**:
```powershell
# Usar porta diferente
python manage.py runserver 8001

# OU matar processo na porta 8000
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
```

### ❌ npm: command not found

**Solução**: Instale Node.js de https://nodejs.org/

---

## 📦 Instalar Dependências

### Backend (Python)
```powershell
cd D:\Projectos\JamalImobiliaria\backend
..\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Frontend (Node.js)
```powershell
cd D:\Projectos\JamalImobiliaria\frontend
npm install
```

---

## 🔑 URLs Importantes

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:3000 | Interface pública |
| Backend API | http://localhost:8000/api | API REST |
| Admin Django | http://localhost:8000/admin | Painel admin |
| API Docs | http://localhost:8000/api/docs | Documentação API |

---

## 💡 Dicas

1. **Sempre ative o ambiente virtual antes de executar qualquer comando Python**
2. **Use dois terminais**: um para backend, outro para frontend
3. **Verifique o prompt**: `(.venv)` indica que o ambiente está ativo
4. **Use o script `start-server.ps1`** para facilitar

---

## 📞 Comandos Rápidos

```powershell
# Iniciar tudo rapidamente

# Terminal 1
cd D:\Projectos\JamalImobiliaria\backend
.\start-server.ps1

# Terminal 2
cd D:\Projectos\JamalImobiliaria\frontend
npm run dev
```

Acesse: http://localhost:3000

---

**Criado em**: 13 de Fevereiro de 2026  
**Sistema**: IJPS Imobiliária - Jamal Imobiliaria  
**Tech Stack**: Django + Next.js + PostgreSQL
