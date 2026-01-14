import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from core.models import Property, PropertyImage
from decimal import Decimal

# Criar propriedade de exemplo com coordenadas reais de Maputo, Moçambique
property_data = {
    'title': 'Apartamento T3 Moderno na Polana',
    'description': '''Apartamento T3 luxuoso localizado no coração da Polana, um dos bairros mais nobres de Maputo.

Características principais:
- Sala ampla com varanda
- Cozinha equipada com eletrodomésticos modernos
- 3 quartos (1 suíte)
- 2 casas de banho completas
- Ar condicionado em todos os ambientes
- Lugar de garagem coberto
- Condomínio fechado com segurança 24h
- Piscina e área de lazer

Localização privilegiada próxima a:
- Supermercados e restaurantes
- Escolas internacionais
- Praia da Costa do Sol
- Centros comerciais

Imóvel em excelente estado de conservação, pronto para habitar.''',
    
    'type': 'Apartamento',
    'status': 'venda',
    'price': Decimal('12500000.00'),  # 12.5M MZN
    'currency': 'MZN',
    
    # Localização - Polana, Maputo
    'address': 'Avenida Julius Nyerere, 1234',
    'neighborhood': 'Polana',
    'city': 'Maputo',
    'province': 'Maputo Cidade',
    'district': 'KaMpfumo',
    'zip_code': '1100',
    'country': 'Moçambique',
    
    # Coordenadas reais da Polana, Maputo
    'latitude': Decimal('-25.9655'),
    'longitude': Decimal('32.5832'),
    
    # Características
    'bedrooms': 3,
    'suites': 1,
    'bathrooms': 2,
    'toilets': 0,
    'area': Decimal('145.00'),
    'useful_area': Decimal('130.00'),
    'parking_spaces': 1,
    
    # Detalhes
    'floor_number': 5,
    'total_floors': 8,
    'year_built': 2020,
    'property_condition': 'Excelente',
    'legal_status': 'escritura',
    'orientation': 'Norte/Sul',
    'energy_class': 'B',
    'heating_type': 'AC Central',
    'availability_date': '2026-02-01',
    
    # Comodidades
    'amenities': [
        'Ar Condicionado',
        'Aquecimento Central',
        'Varanda',
        'Elevador',
        'Garagem',
        'Piscina',
        'Ginásio',
        'Segurança 24h',
        'Jardim',
        'Portaria',
        'Sistema de Alarme',
        'Vídeo Porteiro'
    ],
    
    # Custos
    'condominium_fee': Decimal('3500.00'),
    'ipra': Decimal('25000.00'),
    'monthly_expenses': Decimal('5000.00'),
    
    # Flags
    'is_featured': True,
    'is_verified': True,
    'furnished': False,
    'accepts_pets': True,
    'accepts_financing': True,
    
    'reference_code': 'IJPS-001',
}

# Criar a propriedade
property_obj, created = Property.objects.get_or_create(
    reference_code=property_data['reference_code'],
    defaults=property_data
)

if created:
    print(f"✅ Propriedade criada com sucesso!")
    print(f"   ID: {property_obj.id}")
    print(f"   Título: {property_obj.title}")
    print(f"   Localização: {property_obj.neighborhood}, {property_obj.city}")
    print(f"   Coordenadas: {property_obj.latitude}, {property_obj.longitude}")
    print(f"   Preço: {property_obj.currency} {property_obj.price:,.2f}")
    print(f"\n🗺️  Ver no mapa: https://www.openstreetmap.org/?mlat={property_obj.latitude}&mlon={property_obj.longitude}#map=15/{property_obj.latitude}/{property_obj.longitude}")
    print(f"\n🌐 Acesse a propriedade em: http://localhost:3000/propriedades/{property_obj.id}")
else:
    print(f"ℹ️  Propriedade já existe!")
    print(f"   ID: {property_obj.id}")
    print(f"   Título: {property_obj.title}")
    print(f"\n🌐 Acesse em: http://localhost:3000/propriedades/{property_obj.id}")
