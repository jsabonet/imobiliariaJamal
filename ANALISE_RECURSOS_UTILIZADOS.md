# Análise de Recursos Utilizados vs Não Utilizados

**Data da Análise:** 21 de Fevereiro de 2026  
**Servidor:** 209.38.236.166 (DigitalOcean)  
**Objetivo:** Identificar recursos seguros para remoção sem comprometer produção

---

## 🎯 Metodologia

Análise focada em:
1. **Volumes Docker** - O que está sendo servido vs arquivos órfãos
2. **Imagens Docker** - Versões ativas vs duplicadas/antigas
3. **Arquivos de Projeto** - Código em produção vs scripts de teste/documentação
4. **Backups** - Redundâncias e arquivos temporários
5. **Media Files** - Imagens COM marca d'água (produção) vs SEM marca d'água (removíveis)

---

## 📦 1. VOLUMES DOCKER

### Volume: `jamalimobiliaria_media_data` (1.4GB)

#### ✅ RECURSOS EM USO (NÃO REMOVER):

##### `/app/media/properties/` (~1.35GB)
- **Status:** 🔴 **CRÍTICO - EM PRODUÇÃO**
- **Conteúdo:** Imagens de propriedades servidas pelo backend e frontend
- **⚠️ PROBLEMA DESCOBERTO:** 🔴 **MULTIPLICAÇÃO DE ARQUIVOS**
  - **2,817 arquivos JPG** (deveria ser ~563)
  - **Múltiplas versões da mesma imagem** não estão sendo removidas
  - Exemplo: `1000653086.jpg` tem 5 versões ocupando 5x o espaço
  - **~1GB desperdiçado** (70-75% são duplicatas)
  - **Ver detalhes completos em:** [PROBLEMA_CRITICO_MULTIPLICACAO_IMAGENS.md](PROBLEMA_CRITICO_MULTIPLICACAO_IMAGENS.md)
- **Marca d'água:** ✅ Imagens já possuem marca d'água aplicada
- **Ação:** **NÃO REMOVER manualmente** - Usar scripts de limpeza segura
- **Recomendação URGENTE:** Executar limpeza de arquivos órfãos (ver documento específico)

**Exemplo de arquivos:**
```
/app/media/properties/1001097594_i6CPzga_k2btKSy_ibR5eCj.jpg
/app/media/properties/1000771514_MWC3iAS.jpg
/app/media/properties/1000886628.jpg
/app/media/properties/1000899900_lO9bkxw.webp  ← WebP moderno
```

**Nota Importante:** Os sufixos aleatórios (_i6CPzga, _MWC3iAS) indicam que Django está gerando versões únicas para evitar colisão de nomes. Essas são as imagens **COM marca d'água** já aplicadas.

##### `/app/media/agents/` (~10-20MB estimado)
- **Status:** ✅ **EM USO**
- **Conteúdo:** Fotos de perfil dos agentes imobiliários
- **Arquivos:** `1000676583.jpg`, `lura-bg.png`, `1000684487.png`
- **Ação:** **NÃO REMOVER** - Visíveis nas páginas de agentes

#### ⚠️ RECURSOS TEMPORÁRIOS (SEGURO REMOVER):

##### `/app/media/temp_watermark/` (Tamanho desconhecido)
- **Status:** 🟡 **PASTA TEMPORÁRIA**
- **Função:** Armazenamento temporário durante aplicação de marca d'água
- **Conteúdo:** Arquivos que deveriam ser apagados após processamento
- **Segurança:** ✅ **SEGURO LIMPAR** periodicamente
- **Risco:** Baixo - Se houver arquivos, são resíduos de uploads incompletos
- **Ação Recomendada:**
  ```bash
  # Limpar arquivos com mais de 1 hora
  find /app/media/temp_watermark/ -type f -mmin +60 -delete
  ```

**Recomendação:** Criar cron job para limpar automaticamente:
```bash
# No container backend, adicionar ao crontab
0 * * * * find /app/media/temp_watermark/ -type f -mmin +60 -delete
```

---

### Volume: `jamalimobiliaria_db_data` (64MB)

- **Status:** ✅ **EM USO - CRÍTICO**
- **Conteúdo:** Banco de dados PostgreSQL
- **Ação:** **NÃO REMOVER** - Contém todos os dados da aplicação

---

### Volume: `jamalimobiliaria_caddy_data` (~20-30MB estimado)

- **Status:** ✅ **EM USO**
- **Conteúdo:** Certificados SSL/TLS do Caddy (Let's Encrypt)
- **Ação:** **NÃO REMOVER** - Necessário para HTTPS

---

### Volume: `jamalimobiliaria_caddy_config` (~5MB estimado)

- **Status:** ✅ **EM USO**
- **Conteúdo:** Configurações do proxy Caddy
- **Ação:** **NÃO REMOVER**

---

## 🐳 2. IMAGENS DOCKER

### ❌ IMAGENS DUPLICADAS (SEGURO REMOVER):

#### Duplicação Identificada:

| Imagem Duplicada | Imagem Ativa | Tamanho | Status |
|------------------|--------------|---------|--------|
| `jamalimobiliaria-backend:latest` (hífen) | `jamalimobiliaria_backend:latest` (underscore) | 802MB | ❌ Remover |
| `jamalimobiliaria-frontend:latest` (hífen) | `jamalimobiliaria_frontend:latest` (underscore) | 357MB | ❌ Remover |

**Total Liberável:** ~1.6GB

**Causa:** Docker Compose gera nomes com underscore automaticamente. As versões com hífen são de builds manuais antigos.

**Como Identificar Qual Manter:**
```bash
# Ver qual está rodando nos containers
docker ps --format 'table {{.Names}}\t{{.Image}}'
```

**Resultado:**
- Containers usam: `jamalimobiliaria_backend` e `jamalimobiliaria_frontend` (com underscore)
- Duplicados com hífen: **NÃO ESTÃO EM USO**

**Comando para Remover (APÓS confirmar):**
```bash
# Ver IDs das imagens
docker images | grep jamalimobiliaria

# Remover as versões com hífen especificando o IMAGE ID
docker rmi <ID_da_imagem_com_hifen_backend>
docker rmi <ID_da_imagem_com_hifen_frontend>
```

### ✅ IMAGENS EM USO (NÃO REMOVER):

- `jamalimobiliaria_backend:latest` (8e5f01f2ec8c) - 802MB
- `jamalimobiliaria_frontend:latest` (37e0fc507568) - 357MB
- `postgres:16` (803ea6da631e) - 641MB
- `caddy:2-alpine` (953131cfea8e) - 75.6MB

---

## 📄 3. ARQUIVOS DO PROJETO (/opt/JamalImobiliaria/)

### ❌ SCRIPTS DE TESTE/DEBUG (SEGURO REMOVER EM PRODUÇÃO):

#### Scripts Python de Teste:
```
check_pywebpush_api.py          (4KB) - Teste de biblioteca pywebpush
check_vapid_api.py              (4KB) - Teste de chaves VAPID
check_versions.py               (4KB) - Verificação de versões de pacotes
clean_old_subscriptions.py      (4KB) - Script de limpeza (pode ser útil)
generate_vapid_with_vapid.py    (4KB) - Geração de chaves (já geradas)
test_property_notification.py   (4KB) - Teste de notificações
test_vapid_versions.py          (4KB) - Teste de versões VAPID
test_production.py              (8KB) - Teste de produção
```

**Total:** ~40KB  
**Segurança:** ✅ **SEGURO REMOVER** - São scripts de desenvolvimento/teste  
**Exceção:** `clean_old_subscriptions.py` pode ser útil manter para manutenção

#### Scripts Shell de Teste:
```
rebuild-and-verify.sh           (4KB) - Script de rebuild (obsoleto)
rebuild-frontend.sh             (4KB) - Script de rebuild (obsoleto)
restore_hybrid_step1.sh         (4KB) - Restauração antiga (obsoleto)
restore_images_from_backup.sh   (8KB) - Restauração de imagens (manter?)
verify-frontend-url.sh          (4KB) - Verificação de URL (teste)
```

**Total:** ~24KB  
**Segurança:** ✅ **SEGURO REMOVER** a maioria  
**Exceção:** `restore_images_from_backup.sh` pode ser útil para emergências

#### Scripts JavaScript de Teste:
```
simulate-browser-push.js        (12KB) - Simulação de push notifications
test-push-notifications.js      (12KB) - Teste de notificações
```

**Total:** ~24KB  
**Segurança:** ✅ **SEGURO REMOVER** - Apenas testes locais

**Total de Scripts de Teste:** ~88KB (negligível, mas organizacional)

---

### 📚 DOCUMENTAÇÃO (34 arquivos .md)

#### Documentos de Implementação (MANTER):
```
README.md                                    (16KB)
COMO_EXECUTAR.md                            (8KB)
CONFIGURACAO_PRODUCAO.md                    (4KB)
GUIA_DEPLOY_DOCKER_DIGITALOCEAN.md          (8KB)
INTEGRACAO_BACKEND_DJANGO_POSTGRESQL.md     (20KB)
SEO_IMPLEMENTATION.md                       (8KB)
```
**Status:** ✅ **MANTER** - Referência para operação

#### Documentos de Projeto/Estratégia (MANTER):
```
README_PROJETO.md                           (8KB)
ESTRATEGIA_IJPS_ZAWADI_DIGITAL.md           (28KB)
ESTRATEGIA_PARCERIA_E_MARKETING.md          (40KB)
ENTREGA_PROJETO.md                          (12KB)
```
**Status:** ✅ **MANTER** - Contexto do projeto

#### Documentos de Funcionalidades (MANTER):
```
MARCA_DAGUA_IMPLEMENTATION.md               (12KB)
PUSH_NOTIFICATIONS_SETUP.md                 (8KB)
GEOCODIFICACAO_AUTOMATICA.md                (12KB)
SISTEMA_PREFERENCIAS_NOTIFICACOES.md        (12KB)
SOLUCAO_NOTIFICACOES_PUSH.md                (4KB)
GERAR_ICONES_PWA.md                         (4KB)
```
**Status:** ✅ **MANTER** - Documentação técnica necessária

#### Documentos de Troubleshooting/Debug (PODEM SER REMOVIDOS):
```
ACOES_IMEDIATAS_REMOVER_MARCA_DAGUA.md      (8KB) - ❌ Ação já concluída
ATUALIZAR_PRODUCAO.md                       (4KB) - ❌ Procedimento genérico
BUGFIX_LOCALHOST_URLS.md                    (4KB) - ❌ Bug já corrigido
CONFIGURAR_VAPID_PRODUCAO.md                (4KB) - ❌ Já configurado
REBUILD_FRONTEND.md                         (4KB) - ❌ Procedimento genérico
RESTAURACAO_CONCLUIDA_17FEV2026.md          (8KB) - ⚠️ Histórico (mover para archive?)
RESTAURAR_IMAGENS_SEM_MARCA_DAGUA.md        (8KB) - ❌ Ação já concluída
PLANO_RESTAURACAO_CONTROLADA.md             (12KB) - ❌ Plano já executado
```

**Total Removível:** ~52KB (negligível)  
**Recomendação:** Mover para pasta `docs/archive/` ao invés de deletar

#### Documentos de Testes (PODEM SER REMOVIDOS):
```
COMO_TESTAR_GEOCODIFICACAO.md               (8KB)
TESTES_INTEGRACAO.md                        (8KB)
TESTES_PRODUCAO.md                          (8KB)
LOGS_NOTIFICACOES.md                        (12KB)
STATUS_FINAL_INTEGRACAO.md                  (8KB)
IMPLEMENTACAO_ATUAL.md                      (28KB)
```

**Total:** ~72KB  
**Recomendação:** Mover para `docs/testing/` - podem ser úteis para troubleshooting futuro

#### Documentos de Cliente (MANTER):
```
MENSAGEM_CLIENTE.txt                        (4KB)
RESUMO_REUNIAO_CLIENTE.txt                  (4KB)
REUNIAO_CLIENTE_PERGUNTAS.md                (20KB)
```
**Status:** ✅ **MANTER** - Contexto de negócio

---

### ✅ ARQUIVOS ESSENCIAIS (NÃO REMOVER):

```
docker-compose.yml              (4KB)  - CRÍTICO
docker-compose.yml.backup       (4KB)  - Backup útil
Caddyfile                       (4KB)  - Configuração do proxy
```

**Total Código Fonte:**
```
backend/                        (392KB) - CRÍTICO
frontend/                       (1.5MB) - CRÍTICO
```

---

## 💾 4. BACKUPS E ARQUIVOS TEMPORÁRIOS

### ❌ BACKUP LOCAL REDUNDANTE (REMOVER):

#### `/root/backup_images_clean_.tar.gz` (1.4GB)
- **Data:** 17 de Fevereiro de 2026
- **Conteúdo:** Backup das imagens SEM marca d'água
- **Status:** 🔴 **REDUNDANTE E OBSOLETO**
- **Motivo:**
  1. As imagens EM PRODUÇÃO agora TÊM marca d'água
  2. Este backup é de imagens antigas SEM marca d'água
  3. Duplica o espaço usado pelos media files atuais
  4. Backup local não é seguro (se servidor falhar, perde backup também)

**Segurança para Remoção:** ✅ **SEGURO REMOVER**

**Processo Recomendado:**
```bash
# 1. ANTES DE REMOVER: Fazer backup do backup (paradoxal mas prudente)
scp root@209.38.236.166:/root/backup_images_clean_.tar.gz ~/Desktop/backup_emergency_21fev2026.tar.gz

# 2. Ou enviar para S3/DigitalOcean Spaces
# aws s3 cp /root/backup_images_clean_.tar.gz s3://jamal-backups/

# 3. DEPOIS confirmar integridade do backup remoto
md5sum ~/Desktop/backup_emergency_21fev2026.tar.gz

# 4. ENTÃO remover do servidor
ssh root@209.38.236.166 "rm /root/backup_images_clean_.tar.gz"

# 5. Libera: 1.4GB de disco
```

**Liberação de Espaço:** 1.4GB (2% do disco total)

#### `/root/backup_info.txt` (237 bytes)
- **Segurança:** ✅ Pode remover após ler conteúdo
- **Ação:** Documentar conteúdo antes de remover

---

## 🗑️ 5. ARQUIVOS DE LOG EXCESSIVOS

### ⚠️ LOGS DE SEGURANÇA (LIMPAR APÓS IMPLEMENTAR FAIL2BAN):

```
/var/log/btmp            (119MB) - Tentativas de login falhadas (ATUAL)
/var/log/btmp.1          (93MB)  - Tentativas de login falhadas (ROTACIONADO)
```

**Total:** 212MB de **ataques SSH registrados**

**Status:** 🟡 **LIMPAR APÓS SEGURANÇA**

**Processo:**
```bash
# 1. PRIMEIRO: Instalar fail2ban
apt-get install fail2ban

# 2. DEPOIS: Limpar logs antigos
truncate -s 0 /var/log/btmp
truncate -s 0 /var/log/btmp.1

# 3. Libera: 212MB
```

**IMPORTANTE:** NÃO limpar antes de implementar fail2ban, senão continuará crescendo!

---

## 📊 RESUMO DE RECURSOS REMOVÍVEIS

### 🟢 SEGURO REMOVER AGORA (Baixo Risco):

| Item | Tamanho | Liberação | Risco |
|------|---------|-----------|-------|
| Imagens Docker duplicadas (hífen) | 1.6GB | ✅ | Muito Baixo |
| Scripts de teste (.py, .js, .sh) | 88KB | ✅ | Nenhum |
| Docs obsoletos (movê-los, não deletar) | 124KB | ✅ | Nenhum |
| **SUBTOTAL** | **~1.6GB** | | |

### 🟡 REMOVER COM PRECAUÇÃO (Médio Risco):

| Item | Tamanho | Liberação | Pré-requisito |
|------|---------|-----------|---------------|
| `/root/backup_images_clean_.tar.gz` | 1.4GB | ⚠️ | Backup externo primeiro |
| `/app/media/temp_watermark/*` | Variável | ⚠️ | Verificar se está vazio |
| Logs btmp | 212MB | ⚠️ | Instalar fail2ban primeiro |
| **SUBTOTAL** | **~1.6GB** | | |

### 🔴 NÃO REMOVER (Alto Risco):

| Item | Tamanho | Motivo |
|------|---------|--------|
| `/app/media/properties/` | 1.35GB | **Imagens em produção COM marca d'água** |
| `/app/media/agents/` | 15MB | **Fotos de agentes visíveis no site** |
| Volumes Docker (db, caddy) | 90MB | **Dados críticos da aplicação** |
| Código fonte (backend, frontend) | 2MB | **Aplicação em execução** |
| Docker images ativas (underscore) | 2.3GB | **Containers rodando** |
| **TOTAL NÃO REMOVÍVEL** | **~3.7GB** | |

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### Fase 1: Limpeza Segura (Libera ~1.6GB)

```bash
# 1. Remover imagens Docker duplicadas
docker images | grep jamalimobiliaria
docker rmi jamalimobiliaria-backend:latest
docker rmi jamalimobiliaria-frontend:latest

# 2. Criar pasta archive para docs obsoletos
mkdir -p /opt/JamalImobiliaria/docs/archive
mv /opt/JamalImobiliaria/ACOES_IMEDIATAS_* /opt/JamalImobiliaria/docs/archive/
mv /opt/JamalImobiliaria/BUGFIX_* /opt/JamalImobiliaria/docs/archive/
mv /opt/JamalImobiliaria/RESTAURACAO_* /opt/JamalImobiliaria/docs/archive/
mv /opt/JamalImobiliaria/PLANO_RESTAURACAO_* /opt/JamalImobiliaria/docs/archive/

# 3. Remover scripts de teste
mkdir -p /opt/JamalImobiliaria/scripts/testing
mv /opt/JamalImobiliaria/test_*.py /opt/JamalImobiliaria/scripts/testing/
mv /opt/JamalImobiliaria/check_*.py /opt/JamalImobiliaria/scripts/testing/
mv /opt/JamalImobiliaria/simulate-*.js /opt/JamalImobiliaria/scripts/testing/
mv /opt/JamalImobiliaria/test-*.js /opt/JamalImobiliaria/scripts/testing/
```

**Resultado:** Disco 72% → 69%

---

### Fase 2: Backup e Limpeza (Libera +1.4GB)

```bash
# 1. Fazer backup do backup para local seguro
scp root@209.38.236.166:/root/backup_images_clean_.tar.gz ~/safe_location/

# 2. Verificar integridade
md5sum ~/safe_location/backup_images_clean_.tar.gz

# 3. Remover do servidor
ssh root@209.38.236.166 "rm /root/backup_images_clean_.tar.gz"
```

**Resultado:** Disco 69% → 67%

---

### Fase 3: Segurança e Limpeza de Logs (Libera +212MB)

```bash
# 1. Instalar fail2ban
apt-get update && apt-get install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# 2. Limpar logs de ataques
truncate -s 0 /var/log/btmp
truncate -s 0 /var/log/btmp.1
```

**Resultado:** Disco 67% → 66%

---

### Fase 4: Limpeza de Temporários (Variável)

```bash
# Verificar se há arquivos temporários de watermark
docker exec jamalimobiliaria_backend_1 ls -la /app/media/temp_watermark/

# Se houver arquivos antigos (> 1 hora):
docker exec jamalimobiliaria_backend_1 find /app/media/temp_watermark/ -type f -mmin +60 -delete

# Configurar cron job para limpeza automática
docker exec jamalimobiliaria_backend_1 bash -c 'echo "0 * * * * find /app/media/temp_watermark/ -type f -mmin +60 -delete" | crontab -'
```

---

## ⚠️ INVESTIGAÇÕES PENDENTES

### 1. Estrutura Suspeita de Diretórios

**Problema Identificado:**
```
/app/media/properties: 258,048 diretórios
```

Isso é **anormalmente alto**. Para comparação, um site imobiliário típico tem centenas de propriedades, cada uma com 5-10 imagens, resultando em **1-2 mil arquivos**, não 258 mil diretórios.

**Possíveis Causas:**
1. Django criou subdiretórios para cada variação de imagem
2. Há milhares de arquivos órfãos de uploads falhados
3. Bug na estrutura de armazenamento

**Investigação Necessária:**
```bash
# Contar arquivos vs diretórios
docker exec jamalimobiliaria_backend_1 bash -c "
  echo 'Total de arquivos:'
  find /app/media/properties -type f | wc -l
  echo 'Total de diretórios:'
  find /app/media/properties -type d | wc -l
"

# Ver estrutura de um exemplo
docker exec jamalimobiliaria_backend_1 find /app/media/properties -maxdepth 2 -type d | head -20

# Listar propriedades no banco de dados
docker exec jamalimobiliaria_backend_1 python manage.py shell -c "
from core.models import Property
print(f'Total de propriedades: {Property.objects.count()}')
"
```

**Risco:** Se houver milhares de diretórios vazios ou arquivos órfãos, pode estar consumindo inodes e espaço desnecessário.

---

### 2. Verificação de Imagens com Marca d'Água

**Questão:** Confirmar que TODAS as imagens em `/app/media/properties/` têm marca d'água aplicada.

**Teste Recomendado:**
```bash
# Baixar uma amostra aleatória e verificar visualmente
docker exec jamalimobiliaria_backend_1 find /app/media/properties -type f -name '*.jpg' | shuf -n 5 | while read img; do
  echo "Verificar: $img"
  # Copiar para local temporário para inspeção visual
done
```

**Se encontrar imagens SEM marca d'água:**
- NÃO remover (são parte do sistema)
- Pode ser imagem de perfil de agente ou logo
- Ou são originais que ainda não foram processados

---

## 🎓 BOAS PRÁTICAS PARA FUTURO

### 1. Gestão de Backups
- ❌ Nunca armazenar backups no mesmo servidor
- ✅ Usar DigitalOcean Backups ($1-2/mês) ou S3
- ✅ Automatizar backups diários
- ✅ Testar restauração mensalmente

### 2. Limpeza Automática
```bash
# Adicionar ao cron do host (não container)
# /etc/cron.daily/docker-cleanup

#!/bin/bash
# Limpar imagens Docker não usadas (>7 dias)
docker image prune -a -f --filter "until=168h"

# Limpar volumes órfãos
docker volume prune -f

# Limpar build cache
docker builder prune -f --filter "until=168h"
```

### 3. Monitoramento de Espaço
```bash
# Script de alerta quando disco > 80%
#!/bin/bash
USAGE=$(df / | grep / | awk '{print $5}' | sed 's/%//g')
if [ $USAGE -gt 80 ]; then
  echo "ALERTA: Disco em ${USAGE}%" | mail -s "Servidor JamalImobiliaria Disco Cheio" admin@domain.com
fi
```

### 4. Rotação de Logs
```bash
# /etc/logrotate.d/jamal
/var/log/btmp {
    weekly
    rotate 4
    maxsize 50M
    compress
    delaycompress
}
```

---

## 📋 CHECKLIST DE EXECUÇÃO

### Antes de Remover Qualquer Coisa:
- [ ] Fazer snapshot do droplet no DigitalOcean
- [ ] Fazer backup de `/opt/JamalImobiliaria/` localmente
- [ ] Documentar md5sum de arquivos críticos
- [ ] Testar site está funcionando: https://jamalimobiliaria.co.mz
- [ ] Ter plano de rollback pronto

### Executar Remoções:
- [ ] Fase 1: Imagens Docker duplicadas (-1.6GB)
- [ ] Fase 2: Backup local para remoto (-1.4GB)
- [ ] Fase 3: Instalar fail2ban + limpar btmp (-212MB)
- [ ] Fase 4: Limpar temp_watermark (variável)

### Após Remoções:
- [ ] Testar site completamente (upload, visualização, navegação)
- [ ] Verificar containers rodando: `docker ps`
- [ ] Verificar logs não têm erros: `docker-compose logs --tail=100`
- [ ] Verificar espaço livre: `df -h`
- [ ] Atualizar documentação com mudanças

---

## ⚡ GANHO POTENCIAL TOTAL

### Liberação Imediata Segura:
- Imagens Docker: **1.6GB**
- Scripts de teste: **negligível**
- **TOTAL:** **~1.6GB** (72% → 69%)

### Liberação Com Precaução:
- Backup local: **1.4GB**
- Logs de ataque: **212MB**
- **TOTAL:** **+1.6GB** (69% → 66%)

### **LIBERAÇÃO TOTAL POSSÍVEL: ~3.2GB**
**Uso final estimado: 72% → 66% (49GB → 45GB)**

---

## 🚨 AVISOS FINAIS

### ⛔ NUNCA REMOVA:
1. `/app/media/properties/` - **Imagens de produção**
2. `/app/media/agents/` - **Fotos de agentes**
3. Volumes Docker ativos
4. Imagens Docker com underscore (`jamalimobiliaria_*`)
5. Código fonte (backend/frontend)

### ⚠️ CUIDADO ESPECIAL:
- **Marca d'água:** As imagens em `/app/media/properties/` JÁ TÊM marca d'água aplicada
- **Não confundir:** Arquivos com sufixos aleatórios (_MWC3iAS) são versões processadas, não duplicados
- **Backup primeiro:** Sempre ter backup antes de remover qualquer media file

### ✅ SEGURO REMOVER:
- Apenas imagens Docker com **hífen** (`jamalimobiliaria-*`)
- Scripts em `/opt/JamalImobiliaria/*.py` de teste
- Documentação obsoleta (após mover para archive)
- Backup local (após copiar para remoto)

---

**Última Atualização:** 21 de Fevereiro de 2026  
**Responsável:** Análise Técnica Automática  
**Próxima Revisão:** Após executar Fase 1 e 2
