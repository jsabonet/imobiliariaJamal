# Configuração PostgreSQL - IJPS

## ✅ Banco de Dados Configurado

**Database:** `ijps_db`  
**Usuário:** `ijps_user`  
**Senha:** `ijps_password_2026`  
**Host:** `localhost`  
**Porta:** `5432`

---

## 🔧 Como foi configurado

### 1. Script SQL executado

Arquivo: `setup_database.sql`

```sql
CREATE DATABASE ijps_db;
CREATE USER ijps_user WITH ENCRYPTED PASSWORD 'ijps_password_2026';
GRANT ALL PRIVILEGES ON DATABASE ijps_db TO ijps_user;
ALTER DATABASE ijps_db OWNER TO ijps_user;
```

### 2. Comando executado

```powershell
psql -U postgres -f setup_database.sql
```

---

## 🧪 Testar Conexão

### Via psql

```powershell
# Windows PowerShell
$env:PGPASSWORD='ijps_password_2026'
psql -U ijps_user -d ijps_db
```

### Via Django

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py dbshell
```

---

## 📋 Comandos Úteis PostgreSQL

### Listar bancos de dados

```sql
\l
```

### Conectar a outro banco

```sql
\c ijps_db
```

### Listar tabelas

```sql
\dt
```

### Ver informações de conexão

```sql
\conninfo
```

### Sair do psql

```sql
\q
```

---

## 🔄 Recriar banco (se necessário)

**⚠️ ATENÇÃO: Isso apagará todos os dados!**

```powershell
# Conectar como postgres
psql -U postgres

# No psql:
DROP DATABASE IF EXISTS ijps_db;
DROP USER IF EXISTS ijps_user;

# Executar setup novamente
\i setup_database.sql
```

Ou via PowerShell:

```powershell
psql -U postgres -c "DROP DATABASE IF EXISTS ijps_db;"
psql -U postgres -c "DROP USER IF EXISTS ijps_user;"
psql -U postgres -f setup_database.sql
```

---

## 🔐 Segurança

### Para Produção

1. **Alterar senha forte**:
   ```sql
   ALTER USER ijps_user WITH PASSWORD 'senha_muito_forte_e_complexa';
   ```

2. **Atualizar `.env`** com a nova senha

3. **Restringir acesso**:
   - Editar `pg_hba.conf` para permitir apenas IPs específicos
   - Usar SSL/TLS para conexões remotas

---

## 📊 Backup e Restore

### Fazer backup

```powershell
pg_dump -U ijps_user -d ijps_db -F c -f backup_ijps.dump
```

### Restaurar backup

```powershell
pg_restore -U ijps_user -d ijps_db -c backup_ijps.dump
```

---

## 🐛 Troubleshooting

### Erro: "password authentication failed"

- Verificar senha no `.env`
- Verificar usuário existe: `psql -U postgres -c "\du"`

### Erro: "database does not exist"

- Verificar banco existe: `psql -U postgres -c "\l"`
- Recriar com `setup_database.sql`

### Erro: "could not connect to server"

- Verificar se PostgreSQL está rodando:
  ```powershell
  Get-Service postgresql*
  ```
- Iniciar se necessário:
  ```powershell
  Start-Service postgresql-x64-17
  ```

---

**Configuração concluída em**: Janeiro 2026  
**PostgreSQL Versão**: 17.5
