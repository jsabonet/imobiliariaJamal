"""
Management command para adicionar marca d'água em imagens existentes
Uso: python manage.py add_watermark_to_existing
"""

from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from core.models import PropertyImage
from core.watermark_utils import add_watermark_with_property_code
from io import BytesIO


class Command(BaseCommand):
    help = 'Adiciona marca d\'água em todas as imagens existentes que ainda não possuem'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Reprocessar todas as imagens, mesmo as que já possuem marca d\'água',
        )
        
        parser.add_argument(
            '--limit',
            type=int,
            default=None,
            help='Limitar o número de imagens a processar',
        )

    def handle(self, *args, **options):
        force = options['force']
        limit = options['limit']
        
        queryset = PropertyImage.objects.all()
        
        if limit:
            queryset = queryset[:limit]
        
        total = queryset.count()
        processed = 0
        errors = 0
        skipped = 0
        
        self.stdout.write(self.style.WARNING(f'Processando {total} imagens...'))
        
        for img_obj in queryset:
            try:
                # Abrir imagem existente
                if not img_obj.image:
                    self.stdout.write(self.style.WARNING(f'Pulado (sem imagem): {img_obj.id}'))
                    skipped += 1
                    continue
                
                self.stdout.write(f'Processando imagem {img_obj.id}: {img_obj.image.name}')
                
                # Obter código de referência
                property_code = None
                if img_obj.property and hasattr(img_obj.property, 'reference_code'):
                    property_code = img_obj.property.reference_code
                
                # Aplicar marca d'água
                img_obj.image.open()
                watermarked = add_watermark_with_property_code(
                    img_obj.image.file,
                    property_code=property_code
                )
                
                # Salvar imagem processada
                img_name = img_obj.image.name.split('/')[-1]
                img_obj.image.save(img_name, watermarked, save=False)
                
                # Não executar save() normal para evitar loop
                # Usar update() direto
                PropertyImage.objects.filter(pk=img_obj.pk).update(
                    image=img_obj.image
                )
                
                processed += 1
                self.stdout.write(self.style.SUCCESS(f'✓ Processada: {img_obj.id}'))
                
            except Exception as e:
                errors += 1
                self.stdout.write(self.style.ERROR(f'✗ Erro ao processar {img_obj.id}: {e}'))
        
        # Resumo
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS(f'Total de imagens: {total}'))
        self.stdout.write(self.style.SUCCESS(f'Processadas com sucesso: {processed}'))
        if skipped > 0:
            self.stdout.write(self.style.WARNING(f'Puladas: {skipped}'))
        if errors > 0:
            self.stdout.write(self.style.ERROR(f'Erros: {errors}'))
        self.stdout.write(self.style.SUCCESS('='*60))
