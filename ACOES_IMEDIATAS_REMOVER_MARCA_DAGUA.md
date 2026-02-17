# 🎯 GUIA RÁPIDO: Remover Marcas d'Água - Ações Imediatas

## ✅ PASSO 1: Desativar Sistema de Marca d'Água (FEITO!)

O sistema de marca d'água foi desativado automaticamente. Agora aceita essas mudanças:

### Arquivos Modificados:
- ✅ `backend/ijps_api/settings.py` - Adicionada flag `ENABLE_WATERMARK=False`
- ✅ `backend/core/models.py` - Verificação condicional antes de aplicar marca d'água
- ✅ `backend/.env.example` - Documentação da nova variável

### Fazer commit e push:
```bash
cd D:\Projectos\JamalImobiliaria

git add backend/ijps_api/settings.py backend/core/models.py backend/.env.example
git commit -m "Disable: Sistema de marca d'água desativado por padrão (ENABLE_WATERMARK=False)"
git push origin main
```

---

## 🚀 PASSO 2: Deploy em Produção (ESSENCIAL)

### Opção A: Deploy Rápido via SSH
```bash
ssh root@209.38.236.166
cd /opt/JamalImobiliaria
git pull origin main
sudo docker compose restart backend
exit
```

### Opção B: PowerShell (do seu computador)
```powershell
ssh root@209.38.236.166 "cd /opt/JamalImobiliaria && git pull origin main && sudo docker compose restart backend"
```

**Resultado**: A partir de agora, TODAS as novas imagens serão salvas SEM marca d'água!

---

## 🔄 PASSO 3: Restaurar Imagens Antigas (620+ imagens)

### Você tem 3 opções:

#### 🏆 OPÇÃO 1: Backup DigitalOcean (MAIS RÁPIDO - 30min)

**Instruções Detalhadas:**

1. **Acesse o painel DigitalOcean:**
   - https://cloud.digitalocean.com/droplets
   - Clique no seu droplet (209.38.236.166)

2. **Encontre o backup:**
   - Clique na aba "Snapshots" ou "Backups"
   - Procure backup de **14 ou 15 de Fevereiro de 2026** (ANTES das marcas d'água)

3. **Crie droplet temporário:**
   - Clique no backup → "Create Droplet from Snapshot"
   - Escolha plano mais barato ($6/mês)
   - Anote o novo IP (ex: 167.99.123.45)

4. **Execute o script de restauração:**
   ```bash
   cd D:\Projectos\JamalImobiliaria
   bash restore_images_from_backup.sh <IP_DO_DROPLET_TEMPORARIO>
   
   # Exemplo:
   bash restore_images_from_backup.sh 167.99.123.45
   ```

5. **Verifique no site:**
   - Acesse imobiliariajamal.com
   - Veja se as imagens estão SEM marca d'água

6. **Destrua o droplet temporário:**
   - DigitalOcean → Droplet temporário → Destroy
   - Economize $6/mês!

**Custo total:** ~$0.05 (1 hora de droplet)

---

#### ⚙️ OPÇÃO 2: Script Manual (se não tiver backup visível)

```bash
# 1. Conectar ao servidor
ssh root@209.38.236.166

# 2. Procurar backups automáticos
find /opt -name "*backup*" -o -name "*media*" -o -name "*snapshot*" | grep -i properties

# 3. Se encontrar backup, restaurar manualmente
cd /opt/JamalImobiliaria/backend/media
mv properties properties_com_marca_dagua_backup
cp -r /caminho/do/backup/properties ./
chown -R www-data:www-data properties
```

---

#### 📝 OPÇÃO 3: Re-upload Manual (ÚLTIMA OPÇÃO - 5-10 horas)

Se não houver backups, você precisará:

1. Ter as imagens originais no seu computador/HD externo
2. Entrar no Django Admin: https://imobiliariajamal.com/admin/
3. Para cada propriedade:
   - Remover imagens antigas (com marca d'água)
   - Fazer upload das imagens originais
   - Sistema NÃO aplicará marca d'água (está desativado!)

---

## 📊 Verificação Final

Após restaurar as imagens, verifique:

1. **Site público:**
   ```
   https://imobiliariajamal.com/propriedades
   ```
   → As imagens devem estar SEM marca d'água

2. **Tamanho do diretório:**
   ```bash
   ssh root@209.38.236.166 "du -sh /opt/JamalImobiliaria/backend/media/properties"
   ```
   → Deve mostrar tamanho similar ao backup original

3. **Contagem de imagens:**
   ```bash
   ssh root@209.38.236.166 "find /opt/JamalImobiliaria/backend/media/properties -type f | wc -l"
   ```
   → Deve mostrar ~620+ imagens

---

## 🆘 Precisa de Ajuda?

**Problemas comuns:**

1. **SSH pedindo senha repetidamente:**
   ```bash
   # Use ssh-copy-id para evitar senhas
   ssh-copy-id root@209.38.236.166
   ```

2. **Não encontro backups no DigitalOcean:**
   - Verifique se backups automáticos estão ativados
   - Entre em contato com suporte DigitalOcean
   - Use OPÇÃO 3 (re-upload manual)

3. **Script de restauração falha:**
   - Verifique conexão SSH: `ssh root@209.38.196.166 "echo 'OK'"`
   - Execute manualmente cada comando do script
   - Verifique permissões: `ls -la /opt/JamalImobiliaria/backend/media/`

---

## 📝 Resumo das Ações

- [x] Sistema de marca d'água desativado no código
- [ ] Commit + push das alterações
- [ ] Deploy em produção (git pull + restart backend)
- [ ] Restaurar imagens antigas (escolha uma opção acima)
- [ ] Verificar site sem marcas d'água

**Tempo estimado total:** 45 minutos - 2 horas (dependendo da opção escolhida)

---

**Qual opção você quer seguir para restaurar as imagens?**
1. OPÇÃO 1 (Backup DigitalOcean) - RECOMENDADO
2. OPÇÃO 2 (Busca manual de backups)
3. OPÇÃO 3 (Re-upload manual)

