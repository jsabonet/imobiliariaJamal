from django.core.management.base import BaseCommand
from core.models import Agent, Property

class Command(BaseCommand):
    help = 'Popula dados iniciais'

    def handle(self, *args, **options):
        agent, _ = Agent.objects.get_or_create(name='Agente IJPS', phone='+258820061863')
        Property.objects.get_or_create(
            title='Casa Moderna na Somershield',
            defaults={
                'description': 'Casa de luxo com piscina',
                'location': 'Maputo',
                'price': 15000000,
                'type': 'casa',
                'status': 'venda',
                'bedrooms': 4,
                'bathrooms': 3,
                'area': 350,
                'is_featured': True,
                'is_verified': True,
                'agent': agent,
                'amenities': ['garagem', 'piscina', 'jardim'],
            }
        )
        self.stdout.write(self.style.SUCCESS('Dados iniciais criados'))
