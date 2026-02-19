"""
Criar propriedade de teste SEM coordenadas para demonstrar geocodificação automática
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from core.models import Property, Agent
from decimal import Decimal

# Obter um agente existente ou None
agent = Agent.objects.first()

# Criar propriedade SEM latitude/longitude
property_data = {
    'title': 'Casa T4 no Bairro Central - Nampula',
    'description': '''Casa espaçosa T4 localizada no Bairro Central de Nampula.
    
Características:
- 4 quartos amplos
- 2 casas de banho completas
- Sala e cozinha espaçosas
- Quintal com jardim
- Garagem para 2 carros
- Próximo a escolas e supermercados

Imóvel em excelente estado, pronto para habitar.''',
    
    'type': 'casa',
    'status': 'venda',
    'price': Decimal('8500000.00'),
    'currency': 'MZN',
    
    # Localização SEM coordenadas - será geocodificado automaticamente
    'location': 'Bairro Central, Nampula',
    'address': 'Rua dos Combatentes, nº 456',
    'neighborhood': 'Bairro Central',
    'city': 'Nampula',
    'province': 'Nampula',
    'country': 'Moçambique',
    # PROPOSITALMENTE não incluímos latitude e longitude
    
    # Características
    'bedrooms': 4,
    'bathrooms': 2,
    'area': 180,
    'parking_spaces': 2,
    'furnished': False,
    'accepts_pets': True,
    'accepts_financing': True,
    
    'reference_code': 'TEST-GEOCODE-001',
}

if agent:
    property_data['agent'] = agent

# Criar a propriedade
property_obj, created = Property.objects.get_or_create(
    reference_code=property_data['reference_code'],
    defaults=property_data
)

if created:
    print(f"✅ Propriedade de teste criada com sucesso!")
    print(f"   ID: {property_obj.id}")
    print(f"   Título: {property_obj.title}")
    print(f"   Localização: {property_obj.neighborhood}, {property_obj.city}, {property_obj.province}")
    print(f"\n   ⚠️  Coordenadas exatas: NÃO fornecidas propositalmente")
    print(f"   ℹ️  O sistema irá geocodificar automaticamente para mostrar o mapa do bairro")
    
    # Testar geocodificação
    print(f"\n🔍 Testando geocodificação automática...")
    lat, lon, is_approx = property_obj.get_approximate_coordinates()
    
    if lat and lon and is_approx:
        print(f"   ✅ Coordenadas Aproximadas obtidas com sucesso:")
        print(f"      Latitude: {lat}")
        print(f"      Longitude: {lon}")
        print(f"\n   🗺️  Ver no OpenStreetMap:")
        print(f"      https://www.openstreetmap.org/?mlat={lat}&mlon={lon}#map=14/{lat}/{lon}")
        print(f"\n   🌐 Ver no frontend (depois de iniciar o servidor):")
        print(f"      http://localhost:3000/propriedades/{property_obj.id}")
    else:
        print(f"   ❌ Falha na geocodificação")
    
else:
    print(f"⚠️  Propriedade já existe com ID: {property_obj.id}")
    print(f"   Para testar novamente, delete a propriedade ou mude o reference_code")
