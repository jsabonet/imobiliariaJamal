import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from core.models import Property, PropertyImage

# Buscar a propriedade recém-criada
property_obj = Property.objects.get(reference_code='IJPS-001')

# URLs de imagens de exemplo (apartamentos modernos)
image_urls = [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',  # Living room
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',  # Modern apartment
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',  # Kitchen
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&h=800&fit=crop',  # Bedroom
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',  # Balcony view
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',  # Bathroom
]

# Adicionar imagens à propriedade
for index, url in enumerate(image_urls):
    PropertyImage.objects.get_or_create(
        property=property_obj,
        image=url,
        defaults={
            'is_primary': index == 0,  # Primeira imagem é a principal
            'order': index
        }
    )

print(f"✅ {len(image_urls)} imagens adicionadas à propriedade!")
print(f"🌐 Acesse em: http://localhost:3000/propriedades/{property_obj.id}")
