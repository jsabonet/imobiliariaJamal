"""
Django management command para identificar imagens órfãs
Autor: Sistema de Análise de Performance
Data: 21 Fev 2026

Este comando identifica arquivos de imagem no disco que não estão 
referenciados no banco de dados, geralmente criados por uploads múltiplos
ou restaurações sem limpeza adequada.

Uso:
    docker exec jamalimobiliaria_backend_1 python manage.py identify_orphan_images
"""

from django.core.management.base import BaseCommand
from core.models import PropertyImage
import os
from pathlib import Path


class Command(BaseCommand):
    help = 'Identifica imagens órfãs no media/properties'

    def handle(self, *args, **options):
        media_root = Path('/app/media/properties')
        
        # 1. Obter todas as imagens referenciadas no banco
        self.stdout.write("🔍 Consultando banco de dados...")
        db_images = set(
            PropertyImage.objects.values_list('image', flat=True)
        )
        
        # Normalizar caminhos (remover prefixo 'properties/')
        db_images = {img.replace('properties/', '') for img in db_images if img}
        
        # 2. Obter todos os arquivos no disco
        self.stdout.write("📁 Escaneando diretório de mídia...")
        disk_files = set()
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG']:
            disk_files.update(
                f.name for f in media_root.glob(ext)
            )
        
        # 3. Encontrar órfãos (arquivos no disco sem referência no banco)
        orphans = disk_files - db_images
        
        # 4. Calcular tamanhos e gerar relatório
        total_size = 0
        orphan_list = []
        
        for orphan in sorted(orphans):
            file_path = media_root / orphan
            if file_path.exists():
                size = file_path.stat().st_size
                total_size += size
                orphan_list.append((orphan, size))
        
        # 5. Output formatado
        self.stdout.write(f"\n{'='*80}")
        self.stdout.write(
            self.style.WARNING("📊 ANÁLISE DE IMAGENS ÓRFÃS")
        )
        self.stdout.write(f"{'='*80}\n")
        
        self.stdout.write(f"✅ Total de imagens no banco: {len(db_images)}")
        self.stdout.write(f"📦 Total de arquivos no disco: {len(disk_files)}")
        self.stdout.write(
            self.style.ERROR(f"🗑️  Total de órfãos: {len(orphans)}")
        )
        self.stdout.write(
            self.style.ERROR(
                f"💾 Espaço desperdiçado: {total_size / 1024 / 1024:.2f} MB"
            )
        )
        
        # 6. Salvar lista detalhada
        if orphans:
            output_file = '/app/orphan_images.txt'
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("# Imagens órfãs identificadas\n")
                f.write(f"# Total: {len(orphans)} arquivos\n")
                f.write(f"# Tamanho: {total_size / 1024 / 1024:.2f} MB\n")
                f.write(f"# Data: {self._get_current_datetime()}\n\n")
                
                for name, size in orphan_list:
                    f.write(f"{name}\t{size / 1024:.2f} KB\n")
            
            self.stdout.write(
                self.style.SUCCESS(
                    f"\n✅ Lista salva em: {output_file}"
                )
            )
            
            # Mostrar amostra dos primeiros 10 órfãos
            self.stdout.write(f"\n📋 Amostra (primeiros 10 órfãos):")
            for name, size in orphan_list[:10]:
                self.stdout.write(f"   - {name} ({size / 1024:.2f} KB)")
            
            if len(orphan_list) > 10:
                self.stdout.write(f"   ... e mais {len(orphan_list) - 10} arquivos")
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    "\n✅ Nenhum arquivo órfão encontrado! Sistema está limpo."
                )
            )
        
        self.stdout.write(f"\n{'='*80}\n")
    
    def _get_current_datetime(self):
        from datetime import datetime
        return datetime.now().strftime('%Y-%m-%d %H:%M:%S')
