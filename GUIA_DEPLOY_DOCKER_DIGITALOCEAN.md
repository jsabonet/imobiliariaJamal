# Guia Completo de Deploy – IJPS (Docker + DigitalOcean)

Este documento descreve, passo a passo, como publicar a plataforma IJPS (frontend Next.js + backend Django + PostgreSQL) em um Droplet da DigitalOcean usando Docker e docker-compose, com recomendações para domínio, HTTPS e manutenção.

---

## Visão Geral

- Frontend: Next.js (output standalone) porta 3000
- Backend: Django + DRF (Gunicorn) porta 8000
- Base de dados: PostgreSQL porta 5432
- Media/Uploads: servidos pelo Django em `/media/`
- Orquestração: `docker-compose.yml`

Arquivos relevantes:
- `docker-compose.yml`
- `frontend/Dockerfile`
- `backend/Dockerfile`
- `backend/docker/entrypoint.sh`
- `.env.example` (modelo das variáveis)

---

## 1) Preparar o Droplet (Ubuntu)

1. Acesse via SSH:

```bash
ssh root@SEU_IP
```

2. Instale Docker e Docker Compose Plugin:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release; echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Faça logout e login novamente (ou reinicie) para aplicar o grupo `docker`.

3. (Opcional) Configure um firewall básico (ufw) permitindo SSH, HTTP e HTTPS:

```bash
sudo apt-get install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## 2) Clonar o Repositório

```bash
cd /opt
sudo git clone https://SEU_REPO.git JamalImobiliaria
cd JamalImobiliaria
```

Se usar uma chave SSH:

```bash
sudo git clone git@github.com:ORGANIZACAO/REPO.git JamalImobiliaria
```

---

## 3) Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz baseado em `.env.example`.

Recomendação para produção:

```env
POSTGRES_DB=ijps_db
POSTGRES_USER=ijps_user
POSTGRES_PASSWORD=troque-por-uma-senha-forte

DJANGO_SECRET_KEY=troque-por-uma-chave-forte
DJANGO_ALLOWED_HOSTS=seu.dominio,backend,localhost,127.0.0.1
DJANGO_CORS_ORIGINS=https://seu.dominio
TIME_ZONE=Africa/Maputo
LANGUAGE_CODE=pt

# IMPORTANTE: defina para um endereço público acessível pelo navegador
# Ex.: https://seu.dominio/api ou http://SEU_IP:8000/api
NEXT_PUBLIC_API_URL=https://seu.dominio/api
```

Notas:
- `NEXT_PUBLIC_API_URL` é usado no browser; **não** use `http://backend:8000/api` em produção sem proxy, pois o host `backend` não existe fora da rede Docker.
- Ajuste `DJANGO_ALLOWED_HOSTS` e `DJANGO_CORS_ORIGINS` para o seu domínio.

---

## 4) Build e Subida com Docker Compose

Na raiz do projeto:

```bash
docker compose up -d --build
```

Serviços padrão:
- Frontend: porta 3000 → `http://SEU_IP:3000`
- Backend: porta 8000 → `http://SEU_IP:8000/api`

Verifique status:

```bash
docker compose ps
docker compose logs -f frontend
docker compose logs -f backend
```

---

## 5) Domínio e HTTPS (Proxy Reverso)

Para produção, é recomendado servir via 80/443 com TLS. Duas opções populares:

### Opção A: Caddy (Let’s Encrypt automático)

Crie um arquivo `Caddyfile` com conteúdo:

```text
seu.dominio {
  encode gzip
  reverse_proxy frontend:3000

  handle_path /api/* {
    reverse_proxy backend:8000
  }
}
```

Adicione um serviço ao `docker-compose.yml`:

```yaml
  proxy:
    image: caddy:2
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
    depends_on:
      - frontend
      - backend
    networks:
      - jamal_net
```

Com isso, o frontend estará disponível em `https://seu.dominio` e a API em `https://seu.dominio/api`.

### Opção B: Nginx

Use um `nginx.conf` com server blocks apontando `/` para `frontend:3000` e `/api/` para `backend:8000`. Obtenha certificados via Certbot ou use DigitalOcean Load Balancer/LetsEncrypt.

---

## 6) Operações Comuns

- Criar superuser (Django):

```bash
docker compose exec backend python manage.py createsuperuser
```

- Aplicar migrações manualmente:

```bash
docker compose exec backend python manage.py migrate
```

- Coletar estáticos manualmente:

```bash
docker compose exec backend python manage.py collectstatic --noinput
```

- Reiniciar serviços:

```bash
docker compose restart frontend backend
```

- Parar e remover:

```bash
docker compose down
```

---

## 7) Atualizações de Versão (Rolling Update)

1. Faça `git pull` com as mudanças.
2. Rebuild e recrie containers:

```bash
docker compose up -d --build
```

3. Execute migrações se o backend mudou:

```bash
docker compose exec backend python manage.py migrate
```

---

## 8) Backups

- Base de dados (snapshot rápido):

```bash
docker exec -t $(docker compose ps -q db) pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql
```

- Volume de media:
  - O volume `media_data` contém uploads. Para backup, sincronize (`rsync`) ou copie via `docker run --rm -v media_data:/data -v $(pwd):/backup busybox tar -czf /backup/media.tar.gz /data`.

Recomenda-se usar um serviço externo (Spaces/S3) para media em produção.

---

## 9) Troubleshooting

- Frontend não consegue chamar a API:
  - Verifique `NEXT_PUBLIC_API_URL` aponta para um endereço público (domínio/IP) ou se o proxy `/api` está configurado.
- Erros de CORS:
  - Ajuste `DJANGO_CORS_ORIGINS` para incluir seu domínio HTTPS.
- Certificado SSL não emite:
  - Cheque se o DNS A/AAAA está apontando para o IP do Droplet e portas 80/443 estão liberadas.
- Permissões de media/estáticos:
  - Confirme que o backend tem acesso de escrita aos diretórios montados e que o volume `media_data` existe.

---

## 10) Segurança e Boas Práticas

- Use senhas fortes e rotacione segredos periodicamente.
- Atualize o sistema e imagens Docker regularmente.
- Considere mover media para um bucket S3/Spaces com URLs assinadas.
- Use DO Load Balancer para alta disponibilidade e TLS gerenciado.
- Configure monitoramento (UptimeRobot/Healthchecks) e logging centralizado.

---

## 11) Checklist Rápido

- [ ] DNS do domínio aponta para o Droplet
- [ ] Docker + Compose instalados
- [ ] `.env` preenchido (segredos e URLs)
- [ ] `docker compose up -d --build` concluído
- [ ] Proxy reverso configurado (Caddy/Nginx) com TLS
- [ ] `createsuperuser` criado
- [ ] Backups agendados (DB + media)

---

## Referências

- DigitalOcean Docs: https://docs.digitalocean.com/
- Docker Docs: https://docs.docker.com/
- Caddy Docs: https://caddyserver.com/docs/
- Nginx Docs: https://nginx.org/en/docs/
