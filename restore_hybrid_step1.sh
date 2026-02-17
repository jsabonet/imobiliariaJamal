#!/bin/bash
# Script para restaurar imagens originais do backup
# Executa no servidor de PRODUÇÃO

set -e

echo "🔄 RESTAURAÇÃO HÍBRIDA DE IMAGENS"
echo "=================================="
echo ""
echo "Servidor backup: 165.22.30.160"
echo "Servidor produção: 209.38.236.166"
echo ""

# Passo 1: Baixar imagens originais do backup para produção
echo "📥 Passo 1: Baixando imagens do backup..."
scp root@165.22.30.160:/tmp/images_originais_633.tar.gz /tmp/

# Passo 2: Extrair para diretório temporário
echo "📦 Passo 2: Extraindo imagens..."
mkdir -p /tmp/backup_images
cd /tmp/backup_images
tar -xzf /tmp/images_originais_633.tar.gz

# Passo 3: Listar arquivos do backup
echo "📝 Passo 3: Listando arquivos do backup..."
find properties -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" > /tmp/backup_files_list.txt
BACKUP_COUNT=$(wc -l < /tmp/backup_files_list.txt)
echo "   Encontrados: $BACKUP_COUNT arquivos"

# Passo 4: Gerar script SQL de atualização
echo "🔧 Passo 4: Gerando SQL de atualização..."

cat > /tmp/generate_update_sql.py << 'EOFPYTHON'
import os
import re
import sys

def extract_base_filename(filename):
    """Remove suffixos Django do nome do arquivo."""
    basename = os.path.basename(filename)
    match = re.match(r'^(\d+).*\.(jpg|jpeg|png|gif)$', basename, re.IGNORECASE)
    if match:
        return f"{match.group(1)}.{match.group(2)}"
    return basename

# Ler lista de arquivos do backup
with open('/tmp/backup_files_list.txt', 'r') as f:
    backup_files = set(extract_base_filename(line.strip()) for line in f if line.strip())

print(f"-- Arquivos no backup: {len(backup_files)}")
print("-- Gerando SQLs de atualização...")
print("")
print("BEGIN;")
print("")

# Consultar banco de dados
import django
os.environ['DJANGO_SETTINGS_MODULE'] = 'ijps_api.settings'
django.setup()

from core.models import PropertyImage

updated = 0
kept = 0

for img in PropertyImage.objects.all():
    current_path = img.image.name
    basename = extract_base_filename(current_path)
    
    if basename in backup_files and current_path != f"properties/{basename}":
        # Tem versão no backup e precisa atualizar
        print(f"UPDATE core_propertyimage SET image = 'properties/{basename}' WHERE id = {img.id};")
        updated += 1
    else:
        kept += 1

print("")
print("-- COMMIT; -- Descomente para aplicar")
print(f"-- ROLLBACK; -- Use para desfazer")
print("")
print(f"-- Estatísticas:")
print(f"--   Atualizações: {updated}")
print(f"--   Mantidas: {kept}")

sys.exit(0)
EOFPYTHON

# Executar o script Python dentro do container Django
echo "   Executando análise..."
docker exec jamalimobiliaria-backend-1 python /tmp/generate_update_sql.py > /tmp/update_images.sql

# Passo 5: Mostrar estatísticas
echo ""
echo "✅ SQL gerado: /tmp/update_images.sql"
echo ""
echo "📊 REVISÃO DO SQL:"
tail -10 /tmp/update_images.sql

echo ""
echo "=" * 80
echo "⚠️  AGUARDANDO CONFIRMAÇÃO"
echo "=" * 80
echo ""
echo "Próximos passos (AGUARDE SEU COMANDO):"
echo "  1. Revisar: cat /tmp/update_images.sql"
echo "  2. Aplicar SQL no banco de dados"
echo "  3. Copiar imagens do backup para produção"
echo "  4. Verificar site"
echo ""
echo "NÃO prossiga sem confirmação!"
echo ""
