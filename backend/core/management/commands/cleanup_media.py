"""
Django management command para limpeza periódica de mídia
Autor: Sistema de Análise de Performance
Data: 21 Fev 2026

Este comando faz limpeza automática de arquivos órfãos.
Ideal para executar via cron diariamente.

Uso via cron:
    0 3 * * * docker exec jamalimobiliaria_backend_1 python manage.py cleanup_media

Também pode ser executado manualmente:
    docker exec jamalimobiliaria_backend_1 python manage.py cleanup_media
"""

from django.core.management.base import BaseCommand
from core.models import PropertyImage
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Limpa arquivos de mídia órfãos periodicamente (para cron)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Mostra detalhes de cada arquivo removido'
        )

    def handle(self, *args, **options):
        verbose = options.get('verbose', False)
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\n🧹 Iniciando limpeza automática de mídia...\n"
            )
        )
        
        media_root = Path('/app/media/properties')
        
        # 1. Obter imagens do banco de dados
        db_images = set(
            PropertyImage.objects.values_list('image', flat=True)
        )
        db_images = {img.replace('properties/', '') for img in db_images if img}
        
        # 2. Obter arquivos do disco
        disk_files = set()
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG']:
            disk_files.update(f.name for f in media_root.glob(ext))
        
        # 3. Identificar órfãos
        orphans = disk_files - db_images
        
        if not orphans:
            self.stdout.write(
                self.style.SUCCESS("✅ Nenhum arquivo órfão encontrado.\n")
            )
            logger.info("Cleanup automático: nenhum órfão encontrado")
            return
        
        # 4. Remover órfãos
        removed_count = 0
        removed_size = 0
        errors = []
        
        for orphan in orphans:
            file_path = media_root / orphan
            
            if not file_path.exists():
                continue
            
            try:
                size = file_path.stat().st_size
                file_path.unlink()
                
                removed_count += 1
                removed_size += size
                
                if verbose:
                    self.stdout.write(f"🗑️  Removido: {orphan} ({size/1024:.2f} KB)")
                
                logger.info(f"Cleanup: removido {orphan} ({size} bytes)")
                
            except Exception as e:
                error_msg = f"Erro ao remover {orphan}: {e}"
                errors.append(error_msg)
                logger.error(error_msg)
                
                if verbose:
                    self.stdout.write(
                        self.style.ERROR(f"❌ {error_msg}")
                    )
        
        # 5. Resumo
        self.stdout.write(f"\n{'='*60}")
        self.stdout.write(
            self.style.SUCCESS("✅ Limpeza automática concluída")
        )
        self.stdout.write(f"{'='*60}")
        self.stdout.write(f"📊 Arquivos removidos: {removed_count}")
        self.stdout.write(f"💾 Espaço liberado: {removed_size / 1024 / 1024:.2f} MB")
        
        if errors:
            self.stdout.write(
                self.style.ERROR(f"⚠️  Erros: {len(errors)}")
            )
            if verbose:
                for error in errors:
                    self.stdout.write(f"   - {error}")
        
        self.stdout.write(f"{'='*60}\n")
        
        # Log final
        logger.info(
            f"Cleanup concluído: {removed_count} arquivos, "
            f"{removed_size / 1024 / 1024:.2f} MB, {len(errors)} erros"
        )
