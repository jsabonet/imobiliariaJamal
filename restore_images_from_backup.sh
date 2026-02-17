#!/bin/bash

# 🔄 Script de Restauração de Imagens do Backup DigitalOcean
# Remove marcas d'água restaurando imagens originais

set -e  # Parar se houver erro

echo "🔄 RESTAURAÇÃO DE IMAGENS - IJPS Imobiliária"
echo "=============================================="
echo ""

# Configurações
BACKUP_DROPLET_IP="$1"  # IP do droplet criado a partir do backup
PROD_IP="209.38.236.166"
BACKUP_PATH="/opt/JamalImobiliaria/backend/media/properties"
TEMP_ARCHIVE="/tmp/media_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
LOCAL_ARCHIVE="./media_backup_$(date +%Y%m%d_%H%M%S).tar.gz"

# Validar argumentos
if [ -z "$BACKUP_DROPLET_IP" ]; then
    echo "❌ Erro: Forneça o IP do droplet temporário criado do backup"
    echo ""
    echo "INSTRUÇÕES:"
    echo "1. Acesse DigitalOcean: https://cloud.digitalocean.com/droplets"
    echo "2. Clique no seu droplet (209.38.236.166)"
    echo "3. Vá em 'Snapshots' ou 'Backups'"
    echo "4. Selecione backup de ANTES de 16/fev/2026"
    echo "5. Clique 'Create Droplet from Snapshot'"
    echo "6. Anote o IP do novo droplet temporário"
    echo ""
    echo "USO:"
    echo "  ./restore_images_from_backup.sh <IP_DO_DROPLET_TEMPORARIO>"
    echo ""
    echo "EXEMPLO:"
    echo "  ./restore_images_from_backup.sh 167.99.123.45"
    exit 1
fi

echo "📋 Configuração:"
echo "  - Backup Droplet: $BACKUP_DROPLET_IP"
echo "  - Produção: $PROD_IP"
echo "  - Diretório: $BACKUP_PATH"
echo ""

# Verificar conexão SSH
echo "🔌 Verificando conexão SSH..."
if ! ssh -o ConnectTimeout=5 root@$BACKUP_DROPLET_IP "echo '✅ Conexão OK'" 2>/dev/null; then
    echo "❌ Erro: Não foi possível conectar ao droplet temporário"
    echo "Verifique se o IP está correto e se o droplet está ativo"
    exit 1
fi

# Passo 1: Criar backup das imagens atuais (segurança)
echo ""
echo "💾 Passo 1: Backup das imagens atuais (segurança)..."
ssh root@$PROD_IP "cd /opt/JamalImobiliaria/backend/media && tar -czf /tmp/properties_com_marca_dagua_$(date +%Y%m%d_%H%M%S).tar.gz properties/" || true
echo "✅ Backup de segurança criado em produção: /tmp/"

# Passo 2: Comprimir imagens originais do backup
echo ""
echo "📦 Passo 2: Comprimindo imagens do backup..."
ssh root@$BACKUP_DROPLET_IP "cd /opt/JamalImobiliaria/backend/media && tar -czf $TEMP_ARCHIVE properties/"
echo "✅ Arquivo criado: $TEMP_ARCHIVE"

# Passo 3: Copiar para máquina local
echo ""
echo "⬇️ Passo 3: Baixando imagens originais..."
scp root@$BACKUP_DROPLET_IP:$TEMP_ARCHIVE $LOCAL_ARCHIVE
echo "✅ Baixado: $LOCAL_ARCHIVE"

# Passo 4: Enviar para produção
echo ""
echo "⬆️ Passo 4: Enviando para produção..."
scp $LOCAL_ARCHIVE root@$PROD_IP:/tmp/
echo "✅ Enviado para produção: /tmp/"

# Passo 5: Substituir imagens em produção
echo ""
echo "🔄 Passo 5: Substituindo imagens em produção..."
read -p "⚠️ CONFIRMA substituir TODAS as imagens? (sim/não): " confirm
if [ "$confirm" != "sim" ]; then
    echo "❌ Operação cancelada pelo usuário"
    exit 1
fi

ssh root@$PROD_IP << 'EOF'
    cd /opt/JamalImobiliaria/backend/media
    
    # Remover diretório atual
    echo "  🗑️ Removendo imagens com marca d'água..."
    rm -rf properties
    
    # Extrair backup
    echo "  📂 Extraindo imagens originais..."
    tar -xzf /tmp/media_backup_*.tar.gz
    
    # Ajustar permissões
    echo "  🔒 Ajustando permissões..."
    chown -R www-data:www-data properties
    chmod -R 755 properties
    
    echo "  ✅ Imagens restauradas!"
EOF

# Passo 6: Limpar arquivos temporários
echo ""
echo "🧹 Passo 6: Limpando arquivos temporários..."
ssh root@$BACKUP_DROPLET_IP "rm -f $TEMP_ARCHIVE"
ssh root@$PROD_IP "rm -f /tmp/media_backup_*.tar.gz"
rm -f $LOCAL_ARCHIVE
echo "✅ Limpeza concluída"

# Resumo final
echo ""
echo "=============================================="
echo "✅ RESTAURAÇÃO CONCLUÍDA COM SUCESSO!"
echo "=============================================="
echo ""
echo "📊 Resumo:"
echo "  - Imagens originais restauradas em produção"
echo "  - Backup de segurança mantido em /tmp/ (produção)"
echo "  - Imagens SEM marca d'água"
echo ""
echo "📝 Próximas Ações:"
echo "  1. Verificar imagens no site: imobiliariajamal.com"
echo "  2. Se OK, destruir droplet temporário ($BACKUP_DROPLET_IP)"
echo "  3. Considerar desativar marca d'água permanentemente"
echo ""
echo "🗑️ Para destruir o droplet temporário:"
echo "   - Acesse: https://cloud.digitalocean.com/droplets/$BACKUP_DROPLET_IP"
echo "   - Clique 'Destroy' > 'Destroy Droplet'"
echo "   - Economize ~\$6/mês!"
echo ""
