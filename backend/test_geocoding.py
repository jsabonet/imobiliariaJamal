"""
Script para testar a funcionalidade de geocodificação de propriedades
Testa a obtenção de coordenadas aproximadas baseadas em endereço
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from core.models import Property

def test_geocoding():
    """Testa a geocodificação de propriedades sem coordenadas"""
    print("=== TESTE DE GEOCODIFICAÇÃO ===\n")
    
    # Buscar todas as propriedades
    properties = Property.objects.all()
    
    if not properties:
        print("❌ Nenhuma propriedade encontrada no banco de dados")
        return
    
    print(f"📊 Total de propriedades: {properties.count()}\n")
    
    for prop in properties:
        print(f"\n{'='*80}")
        print(f"🏠 Propriedade: {prop.title}")
        print(f"   ID: {prop.id}")
        print(f"   Endereço: {prop.address or 'N/A'}")
        print(f"   Bairro: {prop.neighborhood or 'N/A'}")
        print(f"   Cidade: {prop.city or 'N/A'}")
        print(f"   Província: {prop.province or 'N/A'}")
        print(f"   País: {prop.country or 'N/A'}")
        
        # Verificar coordenadas exatas
        if prop.latitude and prop.longitude:
            print(f"\n   ✅ Coordenadas Exatas:")
            print(f"      Latitude: {prop.latitude}")
            print(f"      Longitude: {prop.longitude}")
        else:
            print(f"\n   ⚠️  Sem coordenadas exatas")
        
        # Testar geocodificação
        print(f"\n   🔍 Testando geocodificação...")
        lat, lon, is_approx = prop.get_approximate_coordinates()
        
        if lat and lon:
            if is_approx:
                print(f"   ✅ Coordenadas Aproximadas obtidas:")
                print(f"      Latitude: {lat}")
                print(f"      Longitude: {lon}")
                print(f"      🗺️  Ver no mapa: https://www.openstreetmap.org/?mlat={lat}&mlon={lon}#map=14/{lat}/{lon}")
            else:
                print(f"   ✅ Usando coordenadas exatas existentes")
        else:
            print(f"   ❌ Não foi possível geocodificar (faltam informações de localização)")
    
    print(f"\n{'='*80}")
    print("\n✨ Teste concluído!\n")

if __name__ == '__main__':
    test_geocoding()
