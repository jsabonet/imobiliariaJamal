"""
Django management command para gerar chaves VAPID
"""
from django.core.management.base import BaseCommand
from py_vapid import Vapid01
from cryptography.hazmat.primitives import serialization
import base64


class Command(BaseCommand):
    help = 'Gera par de chaves VAPID para push notifications'

    def handle(self, *args, **options):
        vapid = Vapid01()
        vapid.generate_keys()
        
        # Extrair as chaves
        public_key = vapid.public_key.public_bytes(
            encoding=serialization.Encoding.X962,
            format=serialization.PublicFormat.UncompressedPoint
        )
        
        private_key = vapid.private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        
        # Converter para base64 URL-safe
        public_key_b64 = base64.urlsafe_b64encode(public_key).decode('utf-8').rstrip('=')
        
        self.stdout.write(self.style.SUCCESS('\n🔑 Chaves VAPID geradas com sucesso!\n'))
        self.stdout.write('Adicione estas variáveis ao arquivo .env:\n')
        self.stdout.write(self.style.WARNING(f'\nVAPID_PUBLIC_KEY={public_key_b64}'))
        self.stdout.write(self.style.WARNING(f'VAPID_PRIVATE_KEY={private_key.decode("utf-8")}'))
        self.stdout.write(self.style.WARNING('VAPID_CLAIMS_EMAIL=mailto:contato@imobiliariajamal.com\n'))
        
        self.stdout.write('\n' + '='*70)
        self.stdout.write('\nATENÇÃO: A chave privada deve ficar APENAS no backend (.env)')
        self.stdout.write('A chave pública vai para frontend/.env.local como NEXT_PUBLIC_VAPID_PUBLIC_KEY')
        self.stdout.write('\n' + '='*70 + '\n')
