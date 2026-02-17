#!/usr/bin/env python
"""
Script para restaurar imagens originais (sem marca d'água) do backup
e atualizar referências no banco de dados de produção.

IMPORTANTE: Este script NÃO aplica marca d'água nas imagens.
"""

import os
import sys
import django
import re

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from core.models import PropertyImage, Property


def extract_base_filename(filename):
    """
    Extrai o nome base do arquivo removendo sufixos Django.
    
    Exemplos:
    - '1000653086_s1Cz5vU_rXqIunh.jpg' -> '1000653086.jpg'
    - '1000653086.jpg' -> '1000653086.jpg'
    """
    basename = os.path.basename(filename)
    # Remove o caminho 'properties/' se houver
    basename = basename.replace('properties/', '')
    
    # Padrão: número_sufixos.extensão
    # Queremos apenas: número.extensão
    match = re.match(r'^(\d+).*\.(jpg|jpeg|png|gif)$', basename, re.IGNORECASE)
    if match:
        number = match.group(1)
        extension = match.group(2)
        return f"{number}.{extension}"
    
    return basename


def analyze_images():
    """Analisa todas as imagens no banco de dados."""
    print("=" * 80)
    print("📊 ANÁLISE DE IMAGENS NO BANCO DE DADOS")
    print("=" * 80)
    print()
    
    all_images = PropertyImage.objects.select_related('property').all()
    total = all_images.count()
    
    print(f"Total de imagens no banco: {total}")
    print()
    
    # Agrupar por propriedade
    properties_with_images = {}
    images_with_suffixes = []
    images_without_suffixes = []
    
    for img in all_images:
        prop_id = img.property_id
        if prop_id not in properties_with_images:
            properties_with_images[prop_id] = {
                'property': img.property,
                'images': []
            }
        properties_with_images[prop_id]['images'].append(img)
        
        # Verificar se tem sufixos
        current_name = img.image.name
        base_name = extract_base_filename(current_name)
        
        if current_name != f"properties/{base_name}":
            images_with_suffixes.append({
                'id': img.id,
                'property_id': prop_id,
                'current': current_name,
                'base': base_name,
                'property_title': img.property.title if img.property else 'N/A'
            })
        else:
            images_without_suffixes.append({
                'id': img.id,
                'property_id': prop_id,
                'current': current_name
            })
    
    print(f"Propriedades com imagens: {len(properties_with_images)}")
    print(f"Imagens COM sufixos (marca d'água): {len(images_with_suffixes)}")
    print(f"Imagens SEM sufixos (originais): {len(images_without_suffixes)}")
    print()
    
    return {
        'total': total,
        'properties': properties_with_images,
        'with_suffixes': images_with_suffixes,
        'without_suffixes': images_without_suffixes
    }


def generate_update_sql(images_with_suffixes, backup_files):
    """
    Gera SQL para atualizar referências no banco de dados.
    
    Args:
        images_with_suffixes: Lista de imagens com sufixos
        backup_files: Lista de arquivos disponíveis no backup
    """
    print("=" * 80)
    print("📝 GERANDO SQL DE ATUALIZAÇÃO")
    print("=" * 80)
    print()
    
    sql_statements = []
    updated_count = 0
    not_found_count = 0
    
    # Criar set de arquivos disponíveis no backup (apenas base names)
    backup_base_files = set(backup_files)
    
    for img in images_with_suffixes:
        base_name = img['base']
        
        if base_name in backup_base_files:
            # Arquivo existe no backup, pode atualizar
            current = img['current']
            new_path = f"properties/{base_name}"
            
            sql = f"UPDATE core_propertyimage SET image = '{new_path}' WHERE id = {img['id']};"
            sql_statements.append(sql)
            updated_count += 1
            
            print(f"✓ ID {img['id']}: {os.path.basename(current)} -> {base_name}")
        else:
            not_found_count += 1
            print(f"✗ ID {img['id']}: {base_name} NÃO encontrado no backup (mantém original)")
    
    print()
    print(f"Imagens que serão atualizadas: {updated_count}")
    print(f"Imagens que permanecerão (não há backup): {not_found_count}")
    print()
    
    return sql_statements, updated_count


def save_sql_file(sql_statements, filename='update_image_references.sql'):
    """Salva as instruções SQL em arquivo."""
    filepath = os.path.join(os.path.dirname(__file__), filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write("-- Script de atualização de referências de imagens\n")
        f.write("-- Gerado automaticamente em: {}\n".format(os.popen('date').read().strip()))
        f.write("-- IMPORTANTE: Execute dentro de uma transação para poder reverter se necessário\n")
        f.write("-- BEGIN;\n\n")
        
        for sql in sql_statements:
            f.write(sql + "\n")
        
        f.write("\n-- COMMIT; -- Descomente após verificar que tudo está correto\n")
        f.write("-- ROLLBACK; -- Use se quiser desfazer\n")
    
    print(f"✅ SQL salvo em: {filepath}")
    return filepath


def main():
    print()
    print("🔄 RESTAURAÇÃO INTELIGENTE DE IMAGENS")
    print("=" * 80)
    print()
    print("Este script vai:")
    print("  1. Analisar todas as imagens no banco de dados")
    print("  2. Identificar quais têm versão original no backup")
    print("  3. Gerar SQL para atualizar as referências")
    print("  4. AGUARDAR seu comando para aplicar mudanças")
    print()
    print("⚠️  NÃO aplica marca d'água automaticamente!")
    print()
    
    input("Pressione ENTER para continuar...")
    print()
    
    # Passo 1: Analisar imagens no banco
    analysis = analyze_images()
    
    # Passo 2: Listar arquivos disponíveis no backup
    # NOTA: Por enquanto, vou assumir que temos todas as 633 imagens base
    # Você precisa extrair o tar.gz e listar os arquivos
    print("=" * 80)
    print("📦 AGUARDANDO EXTRAÇÃO DO BACKUP")
    print("=" * 80)
    print()
    print("Execute manualmente:")
    print("  1. Extraia: backup_images_originais.tar.gz")
    print("  2. Liste arquivos: find properties -name '*.jpg' > backup_files_list.txt")
    print()
    
    backup_list_file = os.path.join(os.path.dirname(__file__), '../backup_files_list.txt')
    
    if not os.path.exists(backup_list_file):
        print(f"❌ Arquivo não encontrado: {backup_list_file}")
        print()
        print("Execute este script novamente após criar o arquivo com a lista de imagens do backup.")
        return
    
    # Ler lista de arquivos do backup
    with open(backup_list_file, 'r') as f:
        backup_files = [extract_base_filename(line.strip()) for line in f if line.strip()]
    
    print(f"✅ {len(backup_files)} arquivos encontrados no backup")
    print()
    
    # Passo 3: Gerar SQL
    sql_statements, update_count = generate_update_sql(
        analysis['with_suffixes'],
        backup_files
    )
    
    # Passo 4: Salvar SQL
    if sql_statements:
        sql_file = save_sql_file(sql_statements)
        print()
        print("=" * 80)
        print("✅ PRÓXIMOS PASSOS")
        print("=" * 80)
        print()
        print("1. Revise o arquivo SQL gerado")
        print("2. Copie as imagens originais para o servidor")
        print("3. Execute o SQL no banco de dados")
        print("4. Verifique o site")
        print()
        print(f"📊 Estatísticas:")
        print(f"  - Total de imagens: {analysis['total']}")
        print(f"  - Serão atualizadas: {update_count}")
        print(f"  - Permanecerão com marca d'água: {len(analysis['with_suffixes']) - update_count}")
        print()
    else:
        print("❌ Nenhuma atualização necessária")


if __name__ == '__main__':
    main()
