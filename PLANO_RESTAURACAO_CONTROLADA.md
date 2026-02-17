# 🎯 PLANO DE RESTAURAÇÃO HÍBRIDA - COM CONTROLE TOTAL

## OBJETIVO
Pegar as 633 imagens LIMPAS do servidor de BACKUP (165.22.30.160) e substituir as imagens com marca d'água correspondentes no servidor de PRODUÇÃO (209.38.236.166), mantendo as 2527 imagens novas que não existem no backup.

## SERVIDORES
- **BACKUP (165.22.30.160)**: 633 imagens LIMPAS (sem marca d'água) de 10/Fev
- **PRODUÇÃO (209.38.236.166)**: 3160 imagens COM marca d'água

## FLUXO
1. Analisar BD de produção → saber quais imagens existem
2. Listar imagens do backup → saber quais podemos substituir
3. Gerar SQL → atualizar referências no BD de produção
4. Copiar imagens do BACKUP → PRODUÇÃO
5. Aplicar SQL e reiniciar

---

## ETAPAS (execute uma por vez, aguardando confirmação)

### ✅ PASSO 1: Analisar banco de dados de PRODUÇÃO e criar mapeamento

```bash
ssh root@209.38.236.166

# Criar diretório temporário
mkdir -p /tmp/restore_analysis
cd /tmp/restore_analysis

# Criar script de análise
cat > analyze_db.py << 'EOFPYTHON'
import os
import re
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from core.models import PropertyImage

def get_base_id(filename):
    """Extrai ID numérico base: '1000653086_sufixos.jpg' -> '1000653086'"""
    basename = os.path.basename(filename)
    match = re.match(r'^(\d+)', basename)
    return match.group(1) if match else None

print("📊 ANÁLISE DO BANCO DE DADOS")
print("=" * 80)

all_images = PropertyImage.objects.all()
image_map = {}

for img in all_images:
    base_id = get_base_id(img.image.name)
    if base_id:
        if base_id not in image_map:
            image_map[base_id] = []
        image_map[base_id].append({
            'db_id': img.id,
            'property_id': img.property_id,
            'property_title': img.property.title if img.property else 'N/A',
            'current_path': img.image.name
        })

print(f"Total de imagens no banco: {all_images.count()}")
print(f"IDs únicos encontrados: {len(image_map)}")
print("")

# Salvar mapeamento
with open('production_image_map.txt', 'w') as f:
    for base_id, imgs in sorted(image_map.items()):
        for img in imgs:
            f.write(f"{base_id}|{img['db_id']}|{img['property_id']}|{img['current_path']}|{img['property_title']}\n")

print(f"✅ Mapeamento salvo: production_image_map.txt")
print("")
print("Exemplo:")
for i, (base_id, imgs) in enumerate(list(image_map.items())[:5]):
    for img in imgs:
        print(f"  ID {base_id}: DB#{img['db_id']} -> {os.path.basename(img['current_path'])}")
EOFPYTHON

# Executar análise
docker cp analyze_db.py jamalimobiliaria-backend-1:/tmp/
docker exec jamalimobiliaria-backend-1 python /tmp/analyze_db.py

# Copiar resultado
docker cp jamalimobiliaria-backend-1:/tmp/production_image_map.txt ./

echo ""
echo "✅ Análise concluída: production_image_map.txt"
cat production_image_map.txt | head -20
```

**AGUARDE CONFIRMAÇÃO ANTES DE PROSSEGUIR**

---

### ✅ PASSO 2: Listar imagens disponíveis no BACKUP e gerar SQL

```bash
# Conectar ao servidor de BACKUP
ssh root@165.22.30.160

# Listar imagens do backup
cd /tmp
tar -tzf images_originais_633.tar.gz | grep "\.jpg$" > backup_images_list.txt

echo "📦 Imagens disponíveis no BACKUP:"
wc -l backup_images_list.txt
head -20 backup_images_list.txt
```

**Agora no servidor de PRODUÇÃO:**

```bash
ssh root@209.38.236.166
cd /tmp/restore_analysis

# Baixar lista de imagens do backup
scp root@165.22.30.160:/tmp/backup_images_list.txt ./

# Criar script para gerar SQL
cat > generate_sql.py << 'EOFPYTHON'
import os
import re

def get_base_id(filename):
    """Extrai ID numérico: 'properties/1000653086.jpg' -> '1000653086'"""
    basename = os.path.basename(filename)
    match = re.match(r'^(\d+)', basename)
    return match.group(1) if match else None

# Ler imagens do backup
with open('backup_images_list.txt', 'r') as f:
    backup_files = {}
    for line in f:
        line = line.strip()
        if line:
            base_id = get_base_id(line)
            if base_id:
                # Normalizar path: properties/1000653086.jpg
                backup_files[base_id] = line

print(f"📦 {len(backup_files)} imagens únicas no BACKUP")
print("")

# Ler mapeamento de produção
production_map = {}
with open('production_image_map.txt', 'r') as f:
    for line in f:
        parts = line.strip().split('|')
        if len(parts) >= 4:
            base_id, db_id, prop_id, current_path, prop_title = parts[0], parts[1], parts[2], parts[3], parts[4] if len(parts) > 4 else 'N/A'
            if base_id not in production_map:
                production_map[base_id] = []
            production_map[base_id].append({
                'db_id': db_id,
                'prop_id': prop_id,
                'current': current_path,
                'title': prop_title
            })

print(f"📊 {len(production_map)} IDs únicos em PRODUÇÃO")
print("")

# Gerar SQL
updates = []
kept = []

for base_id, imgs in production_map.items():
    if base_id in backup_files:
        # Tem versão limpa no backup!
        backup_path = backup_files[base_id]
        
        for img in imgs:
            if img['current'] != backup_path:
                updates.append({
                    'db_id': img['db_id'],
                    'prop_id': img['prop_id'],
                    'title': img['title'],
                    'old': img['current'],
                    'new': backup_path
                })
    else:
        # Não tem no backup, manter com marca d'água
        for img in imgs:
            kept.append({
                'db_id': img['db_id'],
                'path': img['current']
            })

print("=" * 80)
print(f"📈 ESTATÍSTICAS:")
print(f"  Serão substituídas (imagens limpas): {len(updates)}")
print(f"  Ficarão com marca d'água: {len(kept)}")
print("=" * 80)
print("")

# Gerar SQL
with open('update_to_clean_images.sql', 'w') as f:
    f.write("-- Atualização para imagens LIMPAS do backup\n")
    f.write(f"-- Total de atualizações: {len(updates)}\n")
    f.write(f"-- Imagens mantidas com marca d'água: {len(kept)}\n\n")
    f.write("BEGIN;\n\n")
    
    for upd in updates:
        f.write(f"-- Propriedade: {upd['title']}\n")
        f.write(f"UPDATE core_propertyimage SET image = '{upd['new']}' WHERE id = {upd['db_id']};\n\n")
    
    f.write(f"\n-- COMMIT; -- Descomente para aplicar\n")
    f.write("-- ROLLBACK; -- Use para desfazer\n")

print(f"✅ SQL salvo: update_to_clean_images.sql")
print("")

if updates:
    print("Exemplos de atualizações (primeiras 5):")
    for upd in updates[:5]:
        print(f"\n  DB ID {upd['db_id']} - {upd['title']}")
        print(f"    DE: {os.path.basename(upd['old'])}")
        print(f"    PARA: {os.path.basename(upd['new'])}")
EOFPYTHON

# Executar geração de SQL
docker cp generate_sql.py jamalimobiliaria-backend-1:/tmp/
docker exec jamalimobiliaria-backend-1 python /tmp/generate_sql.py

# Copiar SQL gerado
docker cp jamalimobiliaria-backend-1:/tmp/update_to_clean_images.sql ./

echo ""
echo "✅ SQL gerado: update_to_clean_images.sql"
```

**AGUARDE CONFIRMAÇÃO ANTES DE PROSSEGUIR**

---

### ✅ PASSO 3: Revisar SQL gerado

```bash
ssh root@209.38.236.166
cd /tmp/restore_analysis

# Ver o SQL completo
cat update_to_clean_images.sql

# Ver apenas estatísticas e exemplos
head -50 update_to_clean_images.sql
tail -20 update_to_clean_images.sql
```

**⚠️ REVISE CUIDADOSAMENTE antes de confirmar aplicação!**

**AGUARDE SEU COMANDO para aplicar o SQL**

---

### ✅ PASSO 4: Copiar imagens LIMPAS do BACKUP para PRODUÇÃO

```bash
# No servidor de PRODUÇÃO
ssh root@209.38.236.166

# Baixar arquivo compactado do backup
cd /tmp
scp root@165.22.30.160:/tmp/images_originais_633.tar.gz ./

# Extrair para diretório temporário
mkdir -p /tmp/backup_clean_images
cd /tmp/backup_clean_images
tar -xzf ../images_originais_633.tar.gz

# Verificar
echo "Imagens extraídas:"
find properties -type f | wc -l
ls -lh properties/ | head -20
```

**AGUARDE CONFIRMAÇÃO**

---

### ✅ PASSO 5: Aplicar SQL e copiar arquivos (SOMENTE APÓS CONFIRMAÇÃO)

```bash
ssh root@209.38.236.166

# === PARTE 1: Aplicar SQL ===
echo "Aplicando SQL no banco de dados..."

# Modificar SQL para ter COMMIT automático
cd /tmp/restore_analysis
sed 's/-- COMMIT;/COMMIT;/' update_to_clean_images.sql > update_to_clean_images_final.sql

# Copiar para container e executar
docker cp update_to_clean_images_final.sql jamalimobiliaria-backend-1:/tmp/
docker exec jamalimobiliaria-backend-1 bash -c "psql -U ijps_user -d ijps_db -f /tmp/update_to_clean_images_final.sql"

echo "✅ SQL aplicado!"
echo ""

# === PARTE 2: Copiar imagens limpas ===
echo "Copiando imagens limpas do backup..."

# Copiar as 633 imagens limpas (sobrescreverá arquivos com mesmo nome)
cp -v /tmp/backup_clean_images/properties/*.jpg /var/lib/docker/volumes/jamalimobiliaria_media_data/_data/properties/

# Ajustar permissões
chown -R 1000:1000 /var/lib/docker/volumes/jamalimobiliaria_media_data/_data/properties/

echo "✅ Imagens copiadas e permissões ajustadas!"
echo ""

# Contar total de imagens
echo "Total de imagens em produção:"
find /var/lib/docker/volumes/jamalimobiliaria_media_data/_data/properties -type f | wc -l
```

⚠️ **NÃO EXECUTE SEM CONFIRMAÇÃO!**

---

### ✅ PASSO 6: Reiniciar serviços e verificar

```bash
ssh root@209.38.236.166

# Reiniciar backend e proxy para limpar cache
cd /opt/JamalImobiliaria
docker compose restart backend proxy

# Aguardar inicialização
sleep 10

# Verificar logs
echo "📋 Logs do backend:"
docker logs jamalimobiliaria-backend-1 --tail 30

echo ""
echo "✅ Serviços reiniciados!"
echo ""

# Verificar site
echo "🌐 Teste o site agora:"
echo "   https://imobiliariajamal.com"
echo ""
echo "   Limpe cache do navegador (Ctrl+Shift+Delete)"
echo "   Ou abra em aba anônima (Ctrl+Shift+N)"
```

---

## 📊 RESULTADO ESPERADO

Após executar todos os passos:
- ✅ **633 imagens antigas SEM marca d'água** (do servidor backup 165.22.30.160)
- ✅ **2527 imagens novas COM marca d'água** (mantidas em produção)
- ✅ **Total: 3160 imagens** funcionando
- ✅ Todas as 48 propriedades visíveis
- ✅ Referências no BD corretas
- ⏸️ **Sistema de marca d'água DESATIVADO** (aguardando seu comando para re-popular)

---

## 🚨 IMPORTANTE

- Execute **um passo por vez**
- Aguarde confirmação antes de prosseguir  
- O SQL tem BEGIN/COMMIT para segurança (pode fazer ROLLBACK)
- As imagens vêm do servidor **BACKUP (165.22.30.160)**, NÃO da produção
- **NÃO vamos aplicar marca d'água** até você confirmar que está tudo OK

---

**PRONTO PARA COMEÇAR O PASSO 1?**
