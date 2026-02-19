"""
Management command para limpar imagens temporárias com marca d'água
que já passaram de 2 horas de criação.

Uso:
    python manage.py cleanup_watermarked_images
    
Pode ser agendado para rodar via cron/scheduler:
    */30 * * * * cd /app && python manage.py cleanup_watermarked_images
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import TemporaryWatermarkedImage
import os


class Command(BaseCommand):
    help = 'Remove imagens temporárias com marca d\'água que já passaram de 2 horas'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Apenas mostra o que seria deletado sem deletar'
        )

    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        
        # Buscar todas as imagens temporárias
        all_images = TemporaryWatermarkedImage.objects.all()
        
        if dry_run:
            self.stdout.write(self.style.WARNING('🔍 MODO DRY-RUN - Nenhuma imagem será deletada'))
        
        deleted_count = 0
        expired_images = []
        
        # Identificar imagens expiradas
        for image in all_images:
            if image.is_expired():
                expired_images.append(image)
        
        if not expired_images:
            self.stdout.write(self.style.SUCCESS('✅ Nenhuma imagem expirada encontrada'))
            return
        
        self.stdout.write(self.style.NOTICE(f'📋 Encontradas {len(expired_images)} imagens expiradas'))
        
        # Deletar imagens expiradas
        for image in expired_images:
            try:
                filename = image.original_filename
                age_hours = (timezone.now() - image.created_at).total_seconds() / 3600
                
                if dry_run:
                    self.stdout.write(
                        f'  🗑️  Seria deletado: {filename} (idade: {age_hours:.1f}h)'
                    )
                else:
                    # Deletar arquivos físicos
                    if image.original_image:
                        if os.path.exists(image.original_image.path):
                            os.remove(image.original_image.path)
                    
                    if image.watermarked_image:
                        if os.path.exists(image.watermarked_image.path):
                            os.remove(image.watermarked_image.path)
                    
                    # Deletar registro do banco
                    image.delete()
                    
                    deleted_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'  ✅ Deletado: {filename} (idade: {age_hours:.1f}h)')
                    )
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ❌ Erro ao deletar {filename}: {str(e)}')
                )
        
        if not dry_run:
            self.stdout.write(
                self.style.SUCCESS(f'\n🎉 Limpeza concluída! {deleted_count} imagens deletadas')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'\n🔍 Dry-run concluído! {len(expired_images)} imagens seriam deletadas')
            )
