# Análise de Performance e Recursos do Servidor

**Data da Análise:** 21 de Fevereiro de 2026  
**Servidor:** 209.38.236.166 (DigitalOcean Droplet)  
**Status:** ⚠️ Servidor operacional mas com problemas de otimização

---

## 📊 Resumo Executivo

**Especificações do Servidor:**
- **CPU:** 1 vCPU (DigitalOcean Droplet)
- **RAM:** 2GB (1.9GB usável)
- **Disco:** 67GB SSD
- **SO:** Ubuntu 24.04 LTS

**Uso Atual:**
- **Disco:** 72% (49GB/67GB usado)
- **RAM:** 57% (1.1GB/1.9GB usado)
- **CPU:** <1% (idle, picos durante requests)

Foram identificados múltiplos problemas que estão consumindo recursos desnecessariamente e podem causar lentidão ou falhas no futuro.

### Problemas Críticos Identificados:
- ❌ **258,048 diretórios em /app/media/properties** (anormal! Possível causa de lentidão)
- ❌ **1.4GB de backup desnecessário** em /root
- ❌ **~3-4GB de imagens Docker duplicadas**
- ❌ **212MB de logs de falhas de login** (possível ataque de força bruta)
- ⚠️ **Sem SWAP configurado** (risco de crash se RAM acabar)
- ⚠️ **Gunicorn com 3 workers** pode ser otimizado para 2

---

## 💾 Uso de Disco (72% - 49GB/67GB usado)

### Distribuição do Espaço em Disco:

```
TOTAL DO SISTEMA: 67GB
├─ Sistema Operacional: ~15GB
├─ Docker: ~4.8GB
│  ├─ Volumes: 1.5GB
│  │  ├─ jamalimobiliaria_media_data: ~1.4GB (imagens de propriedades)
│  │  ├─ jamalimobiliaria_db_data: 64MB (PostgreSQL)
│  │  ├─ jamalimobiliaria_caddy_data: estimado 20-30MB
│  │  └─ jamalimobiliaria_caddy_config: estimado 5MB
│  ├─ Rootfs (containers): 1.3GB
│  ├─ Buildkit cache: 117MB
│  └─ Outros: ~2GB
├─ Imagens Docker: ~3GB
│  ├─ jamalimobiliaria_backend: 802MB
│  ├─ jamalimobiliaria-backend: 802MB ❌ DUPLICADO
│  ├─ jamalimobiliaria_frontend: 357MB
│  ├─ jamalimobiliaria-frontend: 358MB ❌ DUPLICADO
│  ├─ postgres:16: 641MB
│  └─ caddy:2-alpine: 75.6MB
├─ Backup em /root: 1.4GB ❌ DESNECESSÁRIO
│  └─ backup_images_clean_.tar.gz (17 Fev 2026)
├─ Logs do sistema: ~350MB ⚠️
│  ├─ btmp (tentativas login): 119MB ⚠️ ALERTA SEGURANÇA
│  ├─ btmp.1: 93MB
│  ├─ auth.log: 47MB
│  ├─ auth.log.1: 44MB
│  └─ outros logs: ~47MB
└─ Projeto: ~2MB
   ├─ /opt/JamalImobiliaria/backend: 392KB
   ├─ /opt/JamalImobiliaria/frontend: 1.5MB
   └─ Documentação e scripts: ~108KB
```

### 🚨 Problemas de Disco:

1. **Backup Desnecessário (1.4GB)**
   - Arquivo: `/root/backup_images_clean_.tar.gz`
   - Data: 17 de Fevereiro de 2026
   - **Problema:** Backup local de imagens que já estão no volume Docker
   - **Impacto:** Duplica o espaço usado pelos media files
   - **Recomendação:** Mover para backup externo ou S3, depois remover do servidor

2. **Imagens Docker Duplicadas (~1.6GB)**
   - `jamalimobiliaria-backend` (hífen) vs `jamalimobiliaria_backend` (underscore)
   - `jamalimobiliaria-frontend` (hífen) vs `jamalimobiliaria_frontend` (underscore)
   - **Problema:** Docker Compose gera nomes com underscore, mas builds manuais usam hífen
   - **Impacto:** Desperdício de ~1.6GB de disco
   - **Recomendação:** Remover imagens antigas com `docker image prune`

3. **Logs Excessivos (350MB)**
   - `btmp`: 212MB total (tentativas de login falhadas)
   - `auth.log`: 91MB total
   - **Problema:** Logs não estão rotacionando adequadamente + possível ataque de força bruta
   - **Impacto:** Consumo desnecessário de disco + risco de segurança
   - **Recomendação:** Configurar logrotate + instalar fail2ban

4. **🔴 CRÍTICO: Estrutura de Diretórios Anormal (258,048 diretórios)**
   - Localização: `/app/media/properties`
   - **Problema:** Número anormalmente alto de diretórios para um site imobiliário
   - **Esperado:** Centenas de propriedades × 5-10 imagens = 1-2 mil arquivos
   - **Atual:** 258 mil diretórios (!!)
   - **Impacto Potencial:**
     - **Lentidão nas listagens de arquivos**
     - **Consumo excessivo de inodes**
     - **Backups extremamente lentos**
     - **Possível causa da lentidão geral do servidor**
   - **Recomendação URGENTE:** Investigar estrutura e limpar arquivos órfãos
   - **Detalhes:** Ver [ANALISE_RECURSOS_UTILIZADOS.md](ANALISE_RECURSOS_UTILIZADOS.md) seção "Investigações Pendentes"

5. **Media Files (1.4GB)**
   - Localização: Volume Docker `jamalimobiliaria_media_data`
   - Conteúdo: Imagens de propriedades (original + com marca d'água)
   - **Status:** ✅ Normal para site imobiliário
   - **Observação:** Pode crescer significativamente com mais propriedades
   - **Recomendação Futura:** 
     - Implementar compressão de imagens (WebP)
     - Considerar CDN para imagens
     - Limpar imagens antigas de propriedades removidas

4. **Media Files (1.4GB)**
   - Localização: Volume Docker `jamalimobiliaria_media_data`
   - Conteúdo: Imagens de propriedades (original + com marca d'água)
   - **Status:** ✅ Normal para site imobiliário
   - **⚠️ PROBLEMA CRÍTICO IDENTIFICADO:** `/app/media/properties` contém **258,048 diretórios** (anormalmente alto!)
   - **Possíveis Causas:**
     - Django criou subdiretórios para cada variação de imagem
     - Milhares de arquivos órfãos de uploads falhados
     - Bug na estrutura de armazenamento
   - **Impacto:** 
     - Consome inodes do sistema de arquivos
     - Operações de listagem de diretórios ficam lentas
     - Backups demoram muito mais tempo
     - Pode ser a **causa principal da lentidão**
   - **Investigação URGENTE Necessária:**
     ```bash
     # Contar arquivos vs diretórios
     docker exec jamalimobiliaria_backend_1 bash -c "
       echo 'Arquivos:' && find /app/media/properties -type f | wc -l
       echo 'Diretórios:' && find /app/media/properties -type d | wc -l
     "
     
     # Ver estrutura
     docker exec jamalimobiliaria_backend_1 find /app/media/properties -maxdepth 2 -type d | head -20
     ```
   - **Recomendação Futura:** 
     - Implementar compressão de imagens (WebP)
     - Considerar CDN para imagens
     - **URGENTE:** Investigar estrutura de diretórios
     - Limpar arquivos órfãos se existirem
     - Reestruturar armazenamento se necessário

---

## 🧠 Uso de Memória RAM (57% - 1.1GB/1.9GB usado)

### Distribuição da Memória:

```
TOTAL DO SISTEMA: 1.9GB (1968MB)
├─ Usado: 1.1GB
├─ Livre: 134MB
├─ Buffer/Cache: 959MB
└─ Disponível: 882MB

SWAP: 0B ❌ NÃO CONFIGURADO
```

### Uso por Container:

| Container | Memória Usada | % do Total | CPU % | Status |
|-----------|---------------|------------|-------|--------|
| **Backend (Django)** | 185.7 MB | 9.4% | 0.02% | ✅ Normal |
| **Frontend (Next.js)** | 53.0 MB | 2.7% | 0.00% | ✅ Normal |
| **Database (PostgreSQL)** | 32.5 MB | 1.6% | 0.01% | ✅ Normal |
| **Proxy (Caddy)** | 20.3 MB | 1.0% | 0.00% | ✅ Normal |
| **TOTAL CONTAINERS** | **291.5 MB** | **14.7%** | - | ✅ |

### Uso por Processos do Sistema:

| Processo | Memória Usada | % do Total | Status |
|----------|---------------|------------|--------|
| **dockerd** | 443.4 MB | 22.4% | ⚠️ Alto |
| **Containers (total)** | 291.5 MB | 14.7% | ✅ Normal |
| **Sistema Operacional** | ~400 MB | 20% | ✅ Normal |

**Observação Crítica:** O daemon Docker (`dockerd`) está consumindo **443MB (22.4%)** da RAM total - mais memória que todos os containers juntos! Isso é esperado mas alto para um servidor de 2GB.

### 🚨 Problemas de Memória:

1. **Sem SWAP Configurado**
   - **Problema:** Se a RAM acabar, o sistema vai matar processos (OOM Killer)
   - **Risco:** Containers podem ser encerrados abruptamente
   - **Recomendação:** Configurar 2GB de SWAP
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

2. **Gunicorn com 3 Workers em Servidor de 1 vCPU**
   - Configuração atual: `--workers 3`
   - Servidor: **1 vCPU** (DigitalOcean Droplet básico)
   - Memória por worker: ~62MB (185.7MB / 3)
   - **Fórmula padrão:** `(2 * CPU cores) + 1 = (2 * 1) + 1 = 3`
   - **Problema:** Fórmula assume múltiplos cores; com 1 vCPU + 2GB RAM, 2 workers são mais eficientes
   - **Recomendação:** Reduzir para 2 workers para economizar ~60MB de RAM
   - **Nota:** 3 workers está tecnicamente correto pela fórmula, mas 2 workers é mais apropriado para este hardware
   ```dockerfile
   CMD ["gunicorn", "ijps_api.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120"]
   ```

3. **Sem Limites de Memória nos Containers**
   - **Problema:** Containers podem consumir toda a RAM
   - **Recomendação:** Adicionar limites no docker-compose.yml
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             memory: 512M
           reservations:
             memory: 256M
   ```

---

## 🐳 Configurações Docker

### Containers Ativos:

```
NOME                          IMAGEM                      STATUS      UPTIME
jamalimobiliaria_backend_1    jamalimobiliaria_backend    Up          12 min
jamalimobiliaria_frontend_1   jamalimobiliaria_frontend   Up          12 min
jamalimobiliaria_db_1         postgres:16                 Up          12 min
jamalimobiliaria_proxy_1      caddy:2-alpine              Up          12 min
```

### Configuração do Backend (Gunicorn):

```dockerfile
CMD ["gunicorn", "ijps_api.wsgi:application", 
     "--bind", "0.0.0.0:8000", 
     "--workers", "3",           # ⚠️ Pode ser reduzido para 2
     "--timeout", "120"]         # ⚠️ Timeout alto (2 minutos)
```

### Problemas de Configuração:

1. **Timeout de 120 segundos**
   - **Observação:** 2 minutos é muito tempo
   - **Problema:** Requests lentas podem travar workers
   - **Recomendação:** Reduzir para 60 segundos
   - **Exceção:** Manter 120s se upload de imagens grandes for frequente

2. **Worker Class: sync**
   - **Status:** Padrão (blocking)
   - **Observação:** Adequado para tráfego baixo/médio
   - **Recomendação Futura:** Considerar `gevent` ou `uvicorn` para mais concorrência

3. **Sem Healthchecks**
   - **Problema:** Docker não monitora se containers estão funcionando
   - **Recomendação:** Adicionar healthchecks no docker-compose.yml
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:8000/admin/"]
     interval: 30s
     timeout: 10s
     retries: 3
     start_period: 40s
   ```

---

## 🔒 Problemas de Segurança Identificados

### 1. Tentativas Massivas de Login SSH (CRÍTICO)

**Evidência:**
```
/var/log/btmp: 119MB (atual)
/var/log/btmp.1: 93MB (rotacionado)
Total: 212MB de tentativas de login falhadas
```

**Análise:**
- `btmp` registra **apenas falhas de autenticação**
- 212MB de logs indica **milhares de tentativas de acesso não autorizado**
- Possível ataque de força bruta contínuo

**Recomendação URGENTE:**
1. Instalar fail2ban para bloquear IPs após múltiplas tentativas:
   ```bash
   sudo apt-get install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

2. Configurar SSH para:
   - Desabilitar login root: `PermitRootLogin no`
   - Usar chaves SSH ao invés de senha
   - Mudar porta SSH de 22 para porta não-padrão
   - Implementar autenticação de dois fatores

3. Limpar logs antigos:
   ```bash
   sudo truncate -s 0 /var/log/btmp
   ```

### 2. Logs de Autenticação Extensos

**Evidência:**
```
/var/log/auth.log: 47MB
/var/log/auth.log.1: 44MB
```

**Problema:** Cada tentativa de login (bem ou mal-sucedida) gera entrada no log

**Recomendação:** Após implementar fail2ban, configurar logrotate mais agressivo

---

## 📈 Histórico de Acesso Legítimo

Últimos 20 logins bem-sucedidos (todos do Moçambique):
```
21/02/2026 11:40 - root via 41.220.201.174
19/02/2026 19:37 - root via 41.220.201.91
19/02/2026 19:34 - root via 41.220.201.91
16/02/2026 17:53 - root via 41.220.200.25
21/01/2026 17:53 - root via 197.235.80.100
21/01/2026 16:41 - root via 197.235.54.40
...
```

**Status:** ✅ Todos os acessos parecem legítimos (IPs do Moçambique)

---

## 🛠️ Recomendações de Otimização

### Imediatas (Podem ser feitas agora):

1. **Remover Backup Local (Libera 1.4GB)**
   ```bash
   # Fazer backup do backup em outro lugar primeiro!
   scp root@209.38.236.166:/root/backup_images_clean_.tar.gz ~/Desktop/
   # Depois remover do servidor
   ssh root@209.38.236.166 "rm /root/backup_images_clean_.tar.gz"
   ```

2. **Limpar Imagens Docker Antigas (Libera ~1.6GB)**
   ```bash
   ssh root@209.38.236.166 "cd /opt/JamalImobiliaria && docker image prune -a -f"
   ```

3. **Configurar SWAP (Segurança)**
   ```bash
   ssh root@209.38.236.166 << 'EOF'
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   EOF
   ```

4. **Instalar Fail2ban (Segurança URGENTE)**
   ```bash
   ssh root@209.38.236.166 "apt-get update && apt-get install -y fail2ban && systemctl enable fail2ban && systemctl start fail2ban"
   ```

5. **Limpar Logs de Tentativas de Login**
   ```bash
   ssh root@209.38.236.166 "truncate -s 0 /var/log/btmp"
   ```

**Espaço Total Liberado:** ~3GB (de 49GB para 46GB) = 69% de uso

---

### Curto Prazo (Próxima semana):

1. **Reduzir Workers do Gunicorn para 2**
   - Editar: `/opt/JamalImobiliaria/backend/Dockerfile`
   - Mudar: `--workers 3` para `--workers 2`
   - Rebuild: `docker-compose up -d --build backend`
   - **Economia:** ~60MB de RAM

2. **Adicionar Limites de Memória aos Containers**
   - Editar: `/opt/JamalImobiliaria/docker-compose.yml`
   - Adicionar seção `deploy.resources` para cada serviço
   - **Benefício:** Previne containers de consumir toda RAM

3. **Adicionar Healthchecks**
   - Editar: `/opt/JamalImobiliaria/docker-compose.yml`
   - Adicionar seção `healthcheck` para backend e frontend
   - **Benefício:** Docker reinicia automaticamente containers com problema

4. **Configurar SSH Seguro**
   - Desabilitar login root direto
   - Implementar autenticação por chave SSH
   - Mudar porta SSH para não-padrão (ex: 2222)

---

### Médio Prazo (Próximo mês):

1. **Implementar CDN para Imagens**
   - Opções: Cloudflare, BunnyCDN, DigitalOcean Spaces
   - **Benefício:** Reduz carga no servidor + acelera site
   - **Custo:** $5-10/mês

2. **Otimizar Imagens (WebP + Compressão)**
   - Converter imagens para formato WebP
   - Implementar compressão automática no upload
   - **Economia:** 30-50% do espaço de media

3. **Configurar Backup Automático Externo**
   - Usar DigitalOcean Backups ($1-2/mês) ou
   - Script de backup para S3/Backblaze
   - **Benefício:** Segurança sem consumir disco local

4. **Monitoramento de Recursos**
   - Instalar Netdata ou Grafana
   - Alertas de CPU/RAM/Disco
   - **Benefício:** Identificar problemas antes que afetem usuários

---

### Longo Prazo (Próximos 3 meses):

1. **Upgrade de Servidor**
   - **Quando:** Quando uso de disco > 80% ou RAM > 80%
   - **Opção 1:** Droplet de 4GB RAM ($24/mês)
   - **Opção 2:** Adicionar volume externo para media files
   - **Opção 3:** Migrar media para S3/Spaces

2. **Implementar Cache Redis**
   - Para sessões Django
   - Para cache de páginas estáticas
   - **Benefício:** Reduz carga no banco + acelera site
   - **Custo de RAM:** ~50-100MB

3. **Separar Serviços**
   - Banco de dados em servidor dedicado
   - Media files em S3/CDN
   - **Benefício:** Escalabilidade independente

---

## 📝 Checklist de Ações

### ✅ Fazer AGORA (Crítico):
- [ ] **URGENTE:** Investigar 258k diretórios em /app/media/properties (possível causa de lentidão)
- [ ] Instalar fail2ban (SEGURANÇA)
- [ ] Configurar SWAP 2GB
- [ ] Baixar backup local para máquina pessoal
- [ ] Remover backup de /root (libera 1.4GB)
- [ ] Limpar imagens Docker antigas (libera 1.6GB)
- [ ] Truncar /var/log/btmp (libera 212MB)

### ⚠️ Fazer Esta Semana:
- [ ] Reduzir Gunicorn workers: 3 → 2
- [ ] Adicionar limites de memória no docker-compose.yml
- [ ] Adicionar healthchecks
- [ ] Configurar SSH seguro (chave + porta não-padrão)
- [ ] Configurar logrotate para limpar logs antigos

### 📅 Fazer Este Mês:
- [ ] Pesquisar CDN para imagens
- [ ] Implementar compressão de imagens WebP
- [ ] Configurar backup automático externo
- [ ] Instalar monitoramento (Netdata)

### 🔮 Considerar no Futuro:
- [ ] Upgrade de servidor quando necessário
- [ ] Implementar Redis cache
- [ ] Separar banco de dados
- [ ] Migrar media para S3

---

## 🎯 Impacto Esperado das Otimizações

### Após Ações Imediatas:
- **Disco:** 72% → 69% (libera 3GB)
- **RAM:** Mesma (mas com segurança de SWAP)
- **Segurança:** ✅ Protegido contra força bruta SSH

### Após Uma Semana:
- **Disco:** 69% (mantido limpo)
- **RAM:** 57% → 54% (economia de ~60MB)
- **Estabilidade:** ✅ Healthchecks + Limites de recursos

### Após Um Mês:
- **Disco:** 65% (com CDN e compressão)
- **Performance:** +30% velocidade (CDN)
- **Custos:** +$5-10/mês (CDN)

---

## 📞 Contato e Suporte

**Responsável Técnico:** GitHub Copilot  
**Data de Análise:** 21 de Fevereiro de 2026  
**Próxima Revisão Recomendada:** 21 de Março de 2026

---

## 🔗 Links Úteis

- [Fail2ban Documentation](https://github.com/fail2ban/fail2ban)
- [Docker Resource Limits](https://docs.docker.com/compose/compose-file/deploy/)
- [Gunicorn Workers Configuration](https://docs.gunicorn.org/en/stable/design.html#how-many-workers)
- [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces)
- [WebP Image Compression](https://developers.google.com/speed/webp)

---

## 📎 Documentos Relacionados

- 🔴 **[PROBLEMA_CRITICO_MULTIPLICACAO_IMAGENS.md](PROBLEMA_CRITICO_MULTIPLICACAO_IMAGENS.md)** - **PROBLEMA CRÍTICO DESCOBERTO**
  - 2,817 arquivos (deveria ser ~563)
  - Múltiplas versões da mesma imagem não são removidas
  - ~1GB de espaço desperdiçado (70-75% do volume media)
  - Scripts Python para identificação e limpeza segura
  - Plano de execução detalhado
  
- **[ANALISE_RECURSOS_UTILIZADOS.md](ANALISE_RECURSOS_UTILIZADOS.md)** - Análise detalhada de quais recursos podem ser removidos com segurança
  - Volumes Docker e conteúdo
  - Imagens Docker duplicadas  
  - Scripts de teste vs produção
  - Media files com marca d'água
  - Plano de ação para limpeza
