"""
Django management command para remover imagens órfãs
Autor: Sistema de Análise de Performance
Data: 21 Fev 2026

Este comando remove arquivos de imagem órfãos (não referenciados no banco)
COM SEGURANÇA: requer confirmação explícita ou modo dry-run

Uso:
    # Testar (não remove nada):
    docker exec jamalimobiliaria_backend_1 python manage.py cleanup_orphan_images --dry-run
    
    # Executar remoção (REQUER BACKUP ANTES):
    docker exec jamalimobiliaria_backend_1 python manage.py cleanup_orphan_images --confirm

IMPORTANTE: Execute backup do volume de mídia antes de usar --confirm
"""

from django.core.management.base import BaseCommand
from core.models import PropertyImage
import os
from pathlib import Path


class Command(BaseCommand):
    help = 'Remove imagens órfãs APÓS validação'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Apenas simula, não remove nada (RECOMENDADO PRIMEIRO)'
        )
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirmação necessária para executar remoção real'
        )

    def handle(self, *args, **options):
        # Validação de segurança
        if not options['confirm'] and not options['dry_run']:
            self.stdout.write(
                self.style.ERROR(
                    '\n❌ ERRO: Use --dry-run para testar ou --confirm para executar\n'
                )
            )
            self.stdout.write("Exemplos:")
            self.stdout.write("  python manage.py cleanup_orphan_images --dry-run")
            self.stdout.write("  python manage.py cleanup_orphan_images --confirm\n")
            return

        # Aviso de segurança
        if options['confirm']:
            self.stdout.write(
                self.style.ERROR(
                    "\n⚠️  ATENÇÃO: Você está prestes a REMOVER arquivos!\n"
                )
            )
            self.stdout.write("Certifique-se de que:")
            self.stdout.write("  1. ✅ Backup do volume foi feito")
            self.stdout.write("  2. ✅ Executou --dry-run primeiro")
            self.stdout.write("  3. ✅ Revisou lista de órfãos\n")
            
            response = input("Digite 'SIM' para continuar: ")
            if response != 'SIM':
                self.stdout.write(self.style.WARNING("\n❌ Operação cancelada.\n"))
                return

        media_root = Path('/app/media/properties')
        
        # 1. Obter imagens do banco
        self.stdout.write("🔍 Consultando banco de dados...")
        db_images = set(
            PropertyImage.objects.values_list('image', flat=True)
        )
        db_images = {img.replace('properties/', '') for img in db_images if img}
        
        # 2. Obter arquivos do disco
        self.stdout.write("📁 Escaneando diretório de mídia...")
        disk_files = set()
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.JPG', '*.JPEG', '*.PNG']:
            disk_files.update(f.name for f in media_root.glob(ext))
        
        # 3. Identificar órfãos
        orphans = disk_files - db_images
        
        if not orphans:
            self.stdout.write(
                self.style.SUCCESS(
                    "\n✅ Nenhum arquivo órfão encontrado! Sistema está limpo.\n"
                )
            )
            return
        
        # 4. Remover (ou simular)
        self.stdout.write(f"\n{'='*80}")
        if options['dry_run']:
            self.stdout.write(
                self.style.WARNING("🧪 MODO DE TESTE (DRY-RUN) - Nenhum arquivo será removido")
            )
        else:
            self.stdout.write(
                self.style.ERROR("🗑️  REMOVENDO ARQUIVOS...")
            )
        self.stdout.write(f"{'='*80}\n")
        
        removed_count = 0
        removed_size = 0
        
        for orphan in sorted(orphans):
            file_path = media_root / orphan
            if file_path.exists():
                size = file_path.stat().st_size
                
                if options['dry_run']:
                    self.stdout.write(
                        f"[DRY-RUN] Removeria: {orphan} ({size/1024:.2f} KB)"
                    )
                else:
                    try:
                        file_path.unlink()
                        self.stdout.write(
                            self.style.WARNING(
                                f"[REMOVIDO] {orphan} ({size/1024:.2f} KB)"
                            )
                        )
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(
                                f"[ERRO] Falha ao remover {orphan}: {e}"
                            )
                        )
                        continue
                
                removed_count += 1
                removed_size += size
        
        # 5. Resumo final
        self.stdout.write(f"\n{'='*80}")
        if options['dry_run']:
            self.stdout.write(
                self.style.WARNING("🧪 [SIMULAÇÃO - NADA FOI REMOVIDO]")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS("✅ [LIMPEZA CONCLUÍDA]")
            )
        
        self.stdout.write(f"📊 Arquivos processados: {removed_count}")
        self.stdout.write(f"💾 Espaço liberado: {removed_size / 1024 / 1024:.2f} MB")
        self.stdout.write(f"{'='*80}\n")
        
        if options['dry_run']:
            self.stdout.write(
                self.style.SUCCESS(
                    "\n✅ Para executar a limpeza real, use: --confirm\n"
                )
            )
