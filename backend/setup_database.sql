-- Criar banco de dados IJPS
CREATE DATABASE ijps_db;

-- Criar usuário
CREATE USER ijps_user WITH ENCRYPTED PASSWORD 'ijps_password_2026';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE ijps_db TO ijps_user;

-- Tornar o usuário dono do banco
ALTER DATABASE ijps_db OWNER TO ijps_user;

-- Mensagem de sucesso
\echo 'Banco de dados ijps_db criado com sucesso!'
\echo 'Usuário: ijps_user'
\echo 'Senha: ijps_password_2026'
