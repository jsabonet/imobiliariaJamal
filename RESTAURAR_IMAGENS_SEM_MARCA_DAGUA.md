# 🔄 PLANO DE RESTAURAÇÃO: Remover Marcas d'Água das Imagens

**Situação**: ~620 imagens com marca d'água indesejada aplicada em produção
**Objetivo**: Restaurar imagens originais sem marca d'água
**Backup**: DigitalOcean mantém snapshots/backups automáticos

---

## 📋 OPÇÕES DE RESTAURAÇÃO

### ✅ **OPÇÃO 1: Restaurar do Backup do DigitalOcean (RECOMENDADO)**

#### Passo 1: Verificar Backups Disponíveis
1. Acesse o painel do DigitalOcean: https://cloud.digitalocean.com
2. Vá em **Droplets** > Seu droplet (209.38.236.166)
3. Clique na aba **Snapshots** ou **Backups**
4. Identifique o backup **ANTES de 16 de Fevereiro de 2026** (antes das marcas d'água)

#### Passo 2: Restaurar Apenas o Diretório de Imagens
```bash
# Opção A: Criar snapshot temporário do backup antigo
# 1. No painel DigitalOcean, crie um novo droplet a partir do backup
# 2. Copie as imagens originais do droplet temporário:

# No seu computador local:
ssh root@<IP_DROPLET_TEMPORARIO> "tar -czf /tmp/media_backup.tar.gz /opt/JamalImobiliaria/backend/media/properties/"
scp root@<IP_DROPLET_TEMPORARIO>:/tmp/media_backup.tar.gz ./media_originais.tar.gz

# No droplet de produção:
scp media_originais.tar.gz root@209.38.236.166:/tmp/
ssh root@209.38.236.166 "cd /opt/JamalImobiliaria/backend/media && rm -rf properties && tar -xzf /tmp/media_backup.tar.gz --strip-components=6"

# 3. Destrua o droplet temporário (economizar $)
```

#### Passo 3: Desativar Sistema de Marca d'Água
```bash
# Em produção:
cd /opt/JamalImobiliaria
git pull origin main

# Editar backend/core/models.py - comentar save() override
# Ou usar flag para desativar
```

---

### 🔄 **OPÇÃO 2: Restaurar via Volume Backup**

Se você usa DigitalOcean Volumes:
```bash
# Verificar volumes
doctl compute volume list

# Restaurar do snapshot
doctl compute volume-snapshot list <VOLUME_ID>
doctl compute volume create --snapshot <SNAPSHOT_ID>
```

---

### 🛠️ **OPÇÃO 3: Desativar Marca d'Água e Re-upload Manual**

#### Passo 1: Desativar Sistema de Marca d'Água AGORA
```python
# backend/core/models.py - classe PropertyImage

def save(self, *args, **kwargs):
    """MARCA D'ÁGUA DESATIVADA - salvar sem processamento"""
    # Comentar todo o código de marca d'água
    super().save(*args, **kwargs)
```

#### Passo 2: Fazer Deploy
```bash
cd /opt/JamalImobiliaria
git pull origin main
sudo docker compose restart backend
```

#### Passo 3: Re-upload das Imagens no Django Admin
- Entre no Django Admin
- Para cada propriedade, faça re-upload das imagens originais
- O sistema NÃO aplicará marca d'água (sistema desativado)

---

## 🚨 AÇÃO IMEDIATA: Desativar Marca d'Água

**Antes de qualquer coisa, precisamos PARAR de aplicar marca d'água em novas imagens:**

```bash
# 1. Commit para desativar marca d'água
cd D:\Projectos\JamalImobiliaria

# 2. Comentar código no models.py (farei isso agora)

# 3. Push para produção
git add backend/core/models.py
git commit -m "Disable: Desativar sistema de marca d'água temporariamente"
git push origin main

# 4. Deploy
ssh root@209.38.236.166 "cd /opt/JamalImobiliaria && git pull && sudo docker compose restart backend"
```

---

## 📊 RESUMO DAS OPÇÕES

| Opção | Tempo | Custo | Dificuldade | Resultado |
|-------|-------|-------|-------------|-----------|
| **1. Backup DO** | 30min | $0.05 | Médio | ✅ 100% original |
| **2. Volume** | 15min | $0 | Fácil | ✅ 100% original |
| **3. Re-upload** | 5-10h | $0 | Alto (manual) | ✅ 100% original |

---

## 🎯 RECOMENDAÇÃO FINAL

**Melhor opção: OPÇÃO 1 (Backup DigitalOcean)**

### Ação Imediata (agora):
1. ✅ Desativar marca d'água no código
2. ✅ Deploy em produção

### Restauração (hoje):
1. 📸 Criar droplet temporário do backup de 15/fev
2. 📦 Copiar diretório `media/properties/`
3. 🔄 Restaurar em produção
4. 🗑️ Destruir droplet temporário

---

**Quer que eu:**
1. ❌ Desative a marca d'água AGORA (commit + deploy)?
2. 📋 Crie script automatizado para restauração do backup?
3. 📝 Crie guia passo-a-passo detalhado com screenshots?

**Responda qual opção prefere e posso executar imediatamente!**
